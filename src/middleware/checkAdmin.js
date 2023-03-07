const User = require("../models/User");

const checkAdmin = async (req, res, next) => {
  const { uid } = req;

  const user = await User.findById(uid);

  if (!user || user.role !== "admin") {
    return res.status(401).json({ error: "Permiso denegado" });
  }

  next();
};

module.exports = checkAdmin;
