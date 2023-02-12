const Users = require("../models/User");
const verifyToken = require("../services/verifyToken");

const protect = async (req, res, next) => {
  try {
    const authorization = req.get("Authorization");

    let token = "";

    if (authorization && authorization.toLowerCase().startsWith("bearer")) {
      token = authorization.substring(7);
    }

    const check = verifyToken(token);

    if (check.error) {
      res.status(401);
      return next(check.error);
    }
    const user = await Users.findOne({ email: check.decodedToken.email });
    if (!user) {
      res.status(401);
      const error = new Error("Permiso denegado");
      return next(error);
    }
    next();
  } catch (error) {
    console.log(error);
    res.status(401);
    return next(error);
  }
};

module.exports = protect;
