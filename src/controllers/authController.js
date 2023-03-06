const User = require("../models/User");
const createToken = require("../services/createToken");

const authController = {};

authController.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const user = await User.findOne({ email });

    if (user) {
      const error = new Error("Email en uso");
      res.status(401);
      return next(error);
    }

    const newUser = new User({
      name,
      email,
      password,
    });

    newUser.password = await newUser.encryptPassword(password);

    await newUser.save();

    const token = createToken(newUser.id, newUser.name);

    res.status(201).json({
      message: "Usuario registrado",
      email: newUser.email,
      uid: newUser.id,
      token,
    });
  } catch (err) {
    return next(err);
  }
};

authController.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      const error = new Error("Email no registrado");
      res.status(401);
      return next(error);
    }
    const match = await user.matchPassword(password);

    if (!match) {
      const error = new Error("Contraseña incorrecta");
      res.status(401);
      return next(error);
    }
    const token = createToken(user.id, user.name);
    res.status(200).json({
      message: "Inicio de sesión",
      email: user.email,
      uid: user.id,
      token,
    });
  } catch (error) {
    return next(error);
  }
};

authController.renewToken = async (req, res) => {
  try {
    const { uid, name } = req;

    const token = await createToken(uid, name);

    return res.status(201).json({ uid, name, token });
  } catch (err) {
    console.log(err);
    const error = new Error("Error al regenerar token");
    next(error);
  }
};

module.exports = authController;
