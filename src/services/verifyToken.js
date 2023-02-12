const jwt = require("jsonwebtoken");
const config = require("../config");

const verifyToken = (token) => {
  const res = {
    error: null,
    decodedToken: null,
  };
  jwt.verify(token, config.KEY_SECRET, (error, decodedToken) => {
    if (error) {
      res.error = new Error(error.name);
      return res;
    }
    res.decodedToken = decodedToken;
    return res;
  });

  return res;
};

module.exports = verifyToken;
