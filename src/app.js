const express = require("express");
const cors = require("cors");
const config = require("./config");

const app = express();

//SETTINGS
app.set("port", config.PORT || 8001);

//MIDDLEWARE
app.use(cors());

//ROUTES

//HANDLER ERRORS

module.exports = app;
