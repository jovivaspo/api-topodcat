const userController = {};

userController.getUser = async (req, res, next) => {
  return res.status(200).json({ user: "No hay usuarios" });
};

module.exports = userController;
