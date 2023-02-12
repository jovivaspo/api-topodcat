const mongoose = require("mongoose");
const config = require("./config");

mongoose.connect(
  `mongodb://${config.MONGO_INITDB_ROOT_USERNAME}:${config.MONGO_INITDB_ROOT_PASSWORD}@mongodb:27017/miapp?directConnection=true&authSource=admin`
);

const connection = mongoose.connection;

connection.on("connected", () => {
  console.log("DB connected");
});

connection.on("error", (error) => {
  console.log("Error to connect: ", error);
});

module.exports = connection;
