const kycRoute = require("express").Router();
const { kycController } = require("../controllers");
const { verifyJwt } = require("../../middlewares");

kycRoute.post("/create", verifyJwt, kycController.createStripeCustomer); // create stripe customer
kycRoute.get("/", verifyJwt, kycController.checkOnboarding); // create stripe account

module.exports = kycRoute;
