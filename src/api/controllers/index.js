const { authController } = require("./auth");
const { kycController } = require("./kyc");
const { userController } = require("./user");
const { nftController } = require("./nft");
module.exports = {
  authController,
  kycController,
  userController,
  nftController,
};
