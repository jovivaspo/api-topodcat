const express = require("express");
const cors = require("cors");
const config = require("./config");
const notFound = require("./middleware/notFound");
const handlerError = require("./middleware/handlerError");
const { default: helmet } = require("helmet");
require("./database");

const app = express();

//SETTINGS
app.set("port", config.PORT || 8001);

//MIDDLEWARE
app.use(helmet());
app.use(cors());
app.use(express.json());

//ROUTES
app.use("/api/user", require("./routes/userRouter"));
app.use("/api/video", require("./routes/videoRouter"));

//HANDLER ERRORS
app.use(notFound);
app.use(handlerError);

module.exports = app;
