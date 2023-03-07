const User = require("../models/User");
const config = require("../config");

const createAdmin = async () => {
  try {
    const admin = await User.findOne({ email: config.ADMIN_EMAIL });

    if (!admin) {
      const newAdmin = new User({
        name: config.ADMIN_NAME,
        email: config.ADMIN_EMAIL,
        password: config.ADMIN_PASSWORD,
        role: "admin",
      });

      newAdmin.password = await newAdmin.encryptPassword(newAdmin.password);
      await newAdmin.save();
      console.log("New admin create");
    } else {
      console.log("Ya existe un administrador");
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = createAdmin;
