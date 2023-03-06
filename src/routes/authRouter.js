const { Router } = require("express");
const { check } = require("express-validator");
const authController = require("../controllers/authController");
const checkFields = require("../middleware/check-fields");
const checkJWT = require("../middleware/check-jwt");

const authRouter = Router();

authRouter.post(
  "/register",
  [
    check("name", "El campo name es obligatorio").not().isEmpty(),

    check("email", "El campo email debe ser válido").isEmail(),

    check(
      "password",
      "El campo password debe de tener más de 6 caracteres"
    ).isLength({ min: 6 }),

    checkFields,
  ],

  authController.register
);

authRouter.post(
  "/login",
  [
    check("email", "El campo email debe ser válido").isEmail(),

    check(
      "password",
      "El campo password debe de tener más de 6 caracteres"
    ).isLength({ min: 6 }),

    checkFields,
  ],

  authController.login
);

authRouter.get("/renew", checkJWT, authController.renewToken);

module.exports = authRouter;
