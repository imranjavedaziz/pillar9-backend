const { userService } = require("../services");
const bcrypt = require("bcryptjs");
const { verify, sendVerificationCode } = require("../../helpers");
const { userSchema } = require("../validation");

class userController {
  async changePassword(req, res) {
    try {
      const { user } = req;
      const { oldPassword, newPassword, verificationCode } = req.body;
      if (!oldPassword || !newPassword) return res.status(400).json({ message: "Invalid request" });
      if (oldPassword === newPassword)
        return res.status(400).json({ message: "Old password and new password can not be same" });
      const oldPasswordMatch = await bcrypt.compare(newPassword, user.password);
      if (oldPasswordMatch)
        return res.status(400).json({ message: "Old password and new password can not be same" });
      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) return res.status(400).json({ message: "Old password is incorrect" });
      console.log("......user", user);
      if (verificationCode) {
        const verifyUser = await verify(user.email, verificationCode);
        console.log("verifyUser", verifyUser.status !== "approved");
        if (verifyUser.status !== "approved")
          return res.status(400).json({ message: "Invalid verification code" });

        const hashedPassword = await bcrypt.hash(newPassword, 12);
        const updatedUser = await userService.updateUser(
          { id: user.id },
          {
            password: hashedPassword,
          }
        );
        return res
          .status(200)
          .json({ message: "Password changed successfully", data: { user: updatedUser } });
      }
      const verification = await sendVerificationCode(user.email);
      return res.status(200).json({
        message: "verification code sent to your email.",
        data: { user: user },
      });
    } catch (err) {
      console.log(err);
      res.status(400).json({ message: err.message, success: false });
    }
  }
  async updateUser(req, res, next) {
    try {
      const { user } = req;
      if (!req.body) return res.status(400).json({ message: "Invalid request" });
      const { role, complete } = req.user;
      delete req.body.password;
      delete req.body.role;
      //  when user is newly registered and completes his profile
      if (role === "practitioner" && !complete) {
        try {
          const validate = await userSchema.completeProfileSchema.validate(req.body, {
            strict: true,
          });
          const updatedUser = await userService.updateUser(
            { id: user.id },
            {
              ...req.body,
              complete: true,
            }
          );
          delete updatedUser.password;
          return res.status(200).json({
            message: "User updated successfully",
            success: true,
            data: { user: updatedUser },
          });
        } catch (error) {
          console.log(error);
          return res.status(400).json({ err: { status: 400, msg: error.errors[0] } });
        }
      }
      //      // when user is updating his profile, we need to add 2fa verification
      const { verificationCode } = req.body;
      if (!verificationCode) {
        const verification = await sendVerificationCode(user.email);
        return res
          .status(200)
          .json({ success: true, message: "verification code sent to your email" });
      }
      const verifyUser = await verify(user.email, verificationCode);
      if (verifyUser.status !== "approved")
        return res.status(400).json({ message: "Invalid verification code" });
      const updatedUser = await userService.updateUser(
        { id: user.id },
        {
          ...req.body,
        }
      );

      delete updatedUser.password;
      return res
        .status(200)
        .json({ message: "User updated successfully", success: true, data: { user: updatedUser } });
    } catch (err) {
      return res
        .status(400)
        .json({ message: err?.message || err?.errors[0]?.message, success: false });
    }
  }
  async userDetails(req, res) {
    try {
      const user = await userService.getUser({ id: req.user.id });
      const tmp_user = user.toJSON();
      delete tmp_user.password;
      return res
        .status(200)
        .json({ message: "User details", success: true, data: { user: tmp_user } });
    } catch (err) {
      console.log(err);
      return res.status(400).json({ success: false, message: err.message });
    }
  }
  async deleteUser(req, res) {
    console.log("delete user");
    try {
      const { user } = req;
      const deletedUser = await userService.deleteUser({ id: user.id });
      return res
        .status(200)
        .json({ message: "User deleted successfully", success: true, data: { user: deletedUser } });
    } catch (err) {
      console.log(err);
      return res.status(400).json({ success: false, message: err.message });
    }
  }
}
module.exports = { userController: new userController() };
