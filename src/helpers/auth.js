const jwt = require("jsonwebtoken");
const { JWT_KEY } = process.env;
const genarateToken = (data, rememberMe = false) => {
  const expiresIn = rememberMe ? "1y" : "2d";
  console.log("expires in", expiresIn, "rememberMe", rememberMe);
  return new Promise((resolve, reject) => {
    jwt.sign(
      {
        ...data,
      },
      `${JWT_KEY}`,
      { expiresIn: expiresIn },
      (err, token) => {
        err ? reject(err) : resolve(token);
      }
    );
  });
};
module.exports = { genarateToken };
