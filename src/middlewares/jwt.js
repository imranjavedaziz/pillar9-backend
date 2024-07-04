const httpError = require("http-errors");
const jwt = require("jsonwebtoken");
const { JWT_KEY } = process.env;
const { userService } = require("../api/services");

exports.verifyJwt = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (authHeader) {
    // const token = authHeader;
    try {
      const token = authHeader.split(" ")[1];
      if (!token) {
        return res.status(404).json({
          success: false,
          error: "Token is not Provided",
        });
      }
      jwt.verify(token, JWT_KEY, async (err, user) => {
        if (err) {
          console.log("error1", err);
          return res
            .status(400)
            .json({ success: false, error: err.message || "Invalid auth token" });
          // throw httpError.Unauthorized();
        }
        const userData = await userService.getUser({ id: user.user_id });
        if (!userData) {
          return res.status(400).json({ success: false, error: "User not found" });
        }
        req.user = userData;
        if (userData?.userStatus === "blocked") {
          return res.status(403).json({
            err: {
              msg: "User is blocked please contact the customer support team!",
              status: 403,
              blocked: true,
              success: false,
            },
          });
        }

        next();
      });
    } catch (error) {
      return res.status(404).json({
        err: {
          msg: error,
        },
      });
    }
  } else {
    return res.status(404).json({
      success: false,
      error: "Token is not Provided",
    });
  }
};
