const jwt = require("jsonwebtoken");
const config = require("../config");

const createToken = (uid, name) => {
  const token = jwt.sign({ uid, name }, config.KEY_SECRET, {
    expiresIn: 86400, //1 día = 86400 seg
  });

  return token;
};

module.exports = createToken;
