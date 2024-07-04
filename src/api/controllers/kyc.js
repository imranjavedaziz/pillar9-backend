// const { User } = require("../models");

const { kycService, userService } = require("../services");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
class kycController {
  async createStripeCustomer(req, res, next) {
    try {
      const { user } = req;
      const stripeAccount = await kycService.findByUserId(user.id);
      if (stripeAccount) {
        return res.status(400).json({ message: "Stripe account already exists!" });
      }

      const account = await stripe.accounts.create({
        type: "custom",
        country: "US",
        email: user.email,
        capabilities: {
          card_payments: { requested: true },
          transfers: { requested: true },
        },
      });
      console.log("account", JSON.stringify(account));

      const newStripeAccount = await kycService.createStripeAccount({
        userId: user.id,
        stripeId: account.id,
      });

      return res.status(200).json({ success: true, data: { stripeAccount: newStripeAccount } });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
  async checkOnboarding(req, res, next) {
    try {
      const { user } = req;
      const kyc = await kycService.findOne({ userId: user.id });
      let tmp_kyc = kyc.toJSON();
      let account = null;
      if (kyc) {
        account = await stripe.accounts.retrieve(tmp_kyc.stripeId);
        if (account && account.requirements.currently_due.length > 0) {
          const accountLink = await stripe.accountLinks.create({
            account: account.id,
            refresh_url: `${process.env.STRIPE_REFRESH_URL}/connectaccount/refresh-url`,
            return_url: `${process.env.STRIPE_ONBOARD_URL}`,
            type: "account_onboarding",
          });
          console.log(
            "requirements currently due----------",
            account.requirements.currently_due.length
          );
          console.log("====================================account link if required", accountLink);
          return res
            .status(200)
            .json({ success: true, data: { status: "incomplete", account, accountLink } });
        }
        console.log("====================================status updated onboarding---");
        const user = await userService.updateUser({ id: user.id }, { onBoarded: true });
        return res.status(200).json({ success: true, data: { status: "complete", account } });
      }
    } catch (err) {
      console.log(err);
      return res.status(400).json({ success: false, message: err.message });
    }
  }
}
module.exports = { kycController: new kycController() };
