const app = require("./app");

require("dotenv").config();

app.listen(app.get("port"), () => {
  console.log(`Server on port ${app.get("port")}`);
});
