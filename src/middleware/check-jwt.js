const jwt = require("jsonwebtoken");
const config = require("../config");

const checkJWT = async (req, res, next) => {
  const authorization = req.get("Authorization");

  let token = "";

  if (!authorization || !authorization.toLowerCase().startsWith("bearer")) {
    return res.status(401).json({ error: "No hay token en la petición" });
  }

  token = authorization.substring(7);

  try {
    const { uid, name } = jwt.verify(token, config.KEY_SECRET);
    if (!uid || !name) {
      return res.status(401).json({ error: "Token no válido" });
    }

    req.uid = uid;
    req.name = name;

    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ error: "Token no válido" });
  }
};

module.exports = checkJWT;
