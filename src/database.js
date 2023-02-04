const mongoose = require("mongoose");
const config = require("./config");

mongoose.connect(
  `mongodb://${config.MONGO_INITDB_ROOT_USERNAME}:${config.MONGO_INITDB_ROOT_PASSWORD}@mongodb:27017/miapp?authSource=admin`
);

mongoose.connection.on("connected", () => {
  console.log("DB connected");
});

mongoose.connection.on("error", (error) => {
  console.log("Error to connect: ", error);
});
