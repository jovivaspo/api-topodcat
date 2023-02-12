const dotenv = require("dotenv");
const path = require("path");

const uri = `../.env.${process.env.NODE_ENV}`.replace(" ", "");

dotenv.config({
  path: path.resolve(__dirname, uri),
});

const config = {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  MONGO_INITDB_ROOT_USERNAME: process.env.MONGO_INITDB_ROOT_USERNAME,
  MONGO_INITDB_ROOT_PASSWORD: process.env.MONGO_INITDB_ROOT_PASSWORD,
  KEY_SECRET: process.env.KEY_SECRET,
  ADMIN_EMAIL: process.env.ADMIN_EMAIL,
  ADMIN_NAME: process.env.ADMIN_NAME,
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
};

module.exports = config;
