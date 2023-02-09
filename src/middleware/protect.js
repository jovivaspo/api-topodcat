const jwt = require("jsonwebtoken");
const config = require("../config");
const Users = require("../models/Users");

const protect = (req, res, next) => {
  try {
    const authorization = req.get("Authorization");

    let token = "";

    if (authorization && authorization.toLowerCase().startsWith("bearer")) {
      token = authorization.substring(7);
    }

    jwt.verify(token, config.KEY_SECRET, async (error, decodedToken) => {
      if (error) {
        res.status(401);
        const error = new Error(error.name);
        return next(error);
      }
      const user = await Users.findOne({ email: decodedToken.email });
      if (!user) {
        res.status(401);
        const error = new Error("Permiso denegado");
        return next(error);
      }
      next();
    });
  } catch (error) {
    res.status(401);
    return next(error);
  }
};

module.exports = protect;
