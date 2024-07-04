const authRoute = require("express").Router();
const { authController } = require("../controllers");
const { validationHandler } = require("../../middlewares");
const { auth } = require("../validation");

const { registerSchema, loginSchema } = auth;
authRoute.post("/login", validationHandler(loginSchema), authController.login); // login
authRoute.post("/register", validationHandler(registerSchema), authController.register); // register
authRoute.post("/verify", authController.verifyUser); // verify user
authRoute.post("/resend", authController.resendVerificationCode); // resend code
authRoute.post("/reset-password", authController.resetPassword); // forgot password

module.exports = authRoute;
