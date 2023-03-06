const express = require("express");
const cors = require("cors");
const config = require("./config");
const notFound = require("./middleware/notFound");
const handlerError = require("./middleware/handlerError");
const { default: helmet } = require("helmet");
const createAdmin = require("./services/createAdmin");
require("./database");

const app = express();

//ADMIN
createAdmin();

//SETTINGS
app.set("port", config.PORT || 8001);

//MIDDLEWARE
helmet({
  crossOriginResourcePolicy: false,
});

app.use(
  cors({
    origin: "http://localhost:3001",
  })
);
app.use(express.json());

//ROUTES
//app.use("/api/user", require("./routes/userRouter"));
app.use("/api/auth", require("./routes/authRouter"));
//app.use("/api/video", require("./routes/videoRouter"));
//app.use("/api/podcasts", require("./routes/podRouter"));

//HANDLER ERRORS
app.use(notFound);
app.use(handlerError);

module.exports = app;
