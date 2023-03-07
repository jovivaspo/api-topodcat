const { Router } = require("express");
const authController = require("../controllers/authController");
const checkJWT = require("../middleware/check-jwt");

const authRouter = Router();

authRouter.post("/register", authController.register);

authRouter.post("/login", authController.login);

authRouter.get("/renew", checkJWT, authController.renewToken);

module.exports = authRouter;
