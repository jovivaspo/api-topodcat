const dotenv = require("dotenv");
const path = require("path");

const uri = `../.env.${process.env.NODE_ENV}`.replace(" ", "");

dotenv.config({
  path: path.resolve(__dirname, uri),
});

const config = {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
};

module.exports = config;
