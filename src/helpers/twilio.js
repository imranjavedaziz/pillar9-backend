const { TWILIO_SERVICE_ID, TWILIO_AUTH_TOKEN, TWILIO_ACCOUNT_SID } = process.env; // Your Auth Token from www.twilio.com/console

const twilio = require("twilio");
const client = new twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
const sendVerificationCode = async (to) => {
  try {
    const verification = await client.verify
      .services(TWILIO_SERVICE_ID)
      .verifications.create({ to, channel: "email" });
    return verification;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};
const verify = async (to, code) => {
  try {
    const verify = await client.verify.v2
      .services(TWILIO_SERVICE_ID)
      .verificationChecks.create({ to, code: code });
    console.log(verify);
    return verify;
  } catch (err) {
    console.log(err);
    throw new Error("Invalid OTP, Verification failed!");
  }
};

module.exports = { sendVerificationCode, verify };
