const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../../.env") });
const { DB_NAME, DB_USERNAME, DB_PASSWORD, DB_HOST } = process.env;
module.exports = {
  development: {
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB_NAME,
    host: DB_HOST,
    dialect: "postgres",
    logging: false,
  },
  production: {
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB_NAME,
    host: DB_HOST,
    dialect: "postgres",
    logging: false,
  },
};
