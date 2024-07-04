const express = require("express");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const { db } = require("./api/models");
const routes = require("./api/routes");
db.sequelize
  .sync()
  .then(() => console.log("Db sync successfully"))
  .catch((err) => console.log("db err", err));

const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(function (err, req, res, next) {
  res.status(err.status || 500).send({ message: err.message, stack: err.stack });
});
app.use(routes);
app.get("/", (req, res) => res.send("Server is running!"));
app.all("*", (req, res) => res.status(404).send("Route not found!"));
app.listen(process.env.PORT || 5000, () =>
  console.log("Server is running on port " + process.env.PORT)
);
