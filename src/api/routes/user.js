const { userController } = require("../controllers");
const { verifyJwt } = require("../../middlewares");
const userRoute = require("express").Router();
userRoute.get("/", verifyJwt, userController.userDetails);
userRoute.post("/change-password", verifyJwt, userController.changePassword);
userRoute.put("/update", verifyJwt, userController.updateUser);
userRoute.delete("/delete", verifyJwt, userController.deleteUser);

module.exports = userRoute;
