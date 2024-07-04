// const { User } = require("../models");
const bcrypt = require("bcryptjs");
const JWT = require("jsonwebtoken");
const { userService, kycService } = require("../services");
const crypto = require("crypto");
const { genarateToken, sendVerificationCode, verify, checkTokenExpired } = require("../../helpers");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const { JWT_KEY } = process.env;

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

class authController {
  async login(req, res, next) {
    try {
      const { email, password, rememberMe } = req.body;
      if (!email || !password)
        return res.status(400).json({ message: "Email or password is incorrect" });
      const tmp_email = email.toLowerCase();
      const user = await userService.getUser({ email: tmp_email });
      console.log("user", user);
      if (!user) return res.status(400).json({ message: "User not found" });
      if (user.userStatus === "blocked") return res.status(400).json({ message: "user blocked" });
      if (!user.isConfirmed) {
        const verification = await sendVerificationCode(user.email);
        return res.status(400).json({ data: { verified: false }, message: "user not verified" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ message: "Email or password is incorrect" });
      const token = await genarateToken(
        {
          user_id: user.id,
          email: user.email,
          role: user.role,
        },
        rememberMe
      );
      const tmp_user = user.toJSON();
      delete tmp_user.password;
      console.log("user", user.password);
      res
        .status(200)
        .json({ message: "Login successfully", data: { verified: true, user: tmp_user, token } });
    } catch (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
  }
  async register(req, res, next) {
    try {
      const { email, password, phoneNumber } = req.body;
      const user = await userService.getUserByEmailPhone({ email, phoneNumber });
      if (user) return res.status(400).json({ message: "Email or Phone Number already exists" });
      const hashedPassword = await bcrypt.hash(password, 12);
      req.body.password = hashedPassword;
      const walletId = new Date().getTime().toString(36) + crypto.randomBytes(20).toString("hex");
      const newUser = await userService.createUser({ ...req.body, walletId });
      const verification = await sendVerificationCode(email);

      return res.status(200).json({
        message: "Register and verification code sent successfully",
        success: true,
        data: { user: newUser },
      });
    } catch (err) {
      console.log(err);
      res.status(400).json({ success: false, message: err.message });
    }
  }
  async verifyUser(req, res, next) {
    try {
      const { email, verificationCode, rememberMe } = req.body;
      if (!email) return res.status(400).json({ message: "invalid email or phone number" });
      const user = await userService.getUser({ email });
      if (!user) return res.status(400).json({ message: "User not found" });
      const verifyUser = await verify(user.email, verificationCode);

      if (verifyUser.status === "approved") {
        const updatedUser = await userService.updateUser({ id: user.id }, { isConfirmed: true });

        const token = await genarateToken(
          {
            user_id: user.id,
            email: user.email,
            role: user.role,
          },
          rememberMe
        );
        delete updatedUser.password;
        // create stripe customer connect account
        const account = await stripe.accounts.create({
          type: "custom",
          country: "US",
          email: user.email,
          capabilities: {
            card_payments: { requested: true },
            transfers: { requested: true },
          },
        });
        // console.log("account", JSON.stringify(account));
        const newStripeAccount = await kycService.create({
          userId: user.id,
          stripeId: account.id,
        });
        const accountLink = await stripe.accountLinks.create({
          account: account.id,
          refresh_url: `${process.env.STRIPE_REFRESH_URL}/connectaccount/refresh-url`,
          return_url: `${process.env.STRIPE_ONBOARD_URL}`,
          type: "account_onboarding",
        });
        return res.status(200).json({
          message: "email verified successfully!",
          data: { user: updatedUser, token, accountLink },
        });
      }
      return res.status(400).json({ message: "Verification code is incorrect" });
    } catch (error) {
      console.log(error);
      res.status(400).json({ success: false, message: error.message });
    }
  }
  async resendVerificationCode(req, res, next) {
    try {
      const { email } = req.body;
      if (!email) return res.status(400).json({ message: "invalid email or phone number" });
      const user = await userService.getUserByEmail(email);
      if (!user) return res.status(400).json({ message: "User not found" });
      const verification = await sendVerificationCode(user.email);
      console.log("-------------------------", JSON.stringify(verification));
      return res.status(200).json({ message: "Verification code sent successfully" });
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }
  async resetPassword(req, res) {
    try {
      const { email, verificationCode, newPassword, rememberMe } = req.body;
      if (verificationCode) {
        // reset password with verification code
        if (!newPassword) return res.status(400).json({ message: "new password is required" });
        const userToken = await userService.getResetPasswordToken(verificationCode);
        if (!userToken)
          return res.status(400).json({ success: false, message: "Invalid verification token" });
        const checkExpired = await checkTokenExpired(userToken.createdAt);
        if (checkExpired) return res.status(400).json({ message: "Token expired" });
        if (!userToken) return res.status(400).json({ message: "invalid Token" });
        const user = await userService.getUserById(userToken.userId);
        if (!user) return res.status(400).json({ message: "User not found" });
        const hashedPassword = await bcrypt.hash(newPassword, 12);
        const updatedUser = await userService.updateUser(
          { id: userToken.userId },
          { password: hashedPassword }
        );
        await userService.deleteResetPasswordToken(verificationCode);
        const token = await genarateToken(
          {
            user_id: user.id,
            email: user.email,
            role: user.role,
          },
          rememberMe
        );
        return res.status(200).json({
          message: "Password changed successfully",
          data: { user: updatedUser, token },
        });
      }
      // send reset password link to email
      if (!email) return res.status(400).json({ message: "Invalid email" });
      const user = await userService.getUserByEmail(email);
      if (!user) return res.status(400).json({ message: "User not found" });

      const resetPasswordToken =
        new Date().getTime().toString(36) + crypto.randomBytes(13).toString("hex");
      const expiresIn = new Date();
      expiresIn.setHours(expiresIn.getMinutes() + 1);

      const verificationToken = await userService.resetPasswordToken({
        userId: user.id,
        token: resetPasswordToken,
        expiresIn: expiresIn,
      });
      const resetLink = `${process.env.DOMAIN_NAME}/auth/reset-password/${resetPasswordToken}`;
      const mailData = {
        name: user.name,
        resetLink,
        twilio_code: resetLink,
        userName: user.firstName,
      };
      const mail = await sgMail.send({
        from: process.env.SENDGRID_SENDER_EMAIL,
        to: user?.email,
        subject: `Forget Password`,
        templateId: "d-f6c64fc092784707bfd54fe7988cd80c",
        dynamicTemplateData: mailData,
      });
      res.status(200).json({
        message: "A reset link has been sent to your email, Please check your inbox",
        data: { success: true },
      });
    } catch (err) {
      console.log(err);
      console.log(JSON.stringify(err));
      res.status(400).json({ message: "Internal server error" });
    }
  }
}
module.exports = { authController: new authController() };
