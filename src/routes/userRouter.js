const { Router } = require("express");
const userController = require("../controllers/userController");
const checkJWT = require("../middleware/check-jwt");
const checkAdmin = require("../middleware/checkAdmin");

const userRouter = Router();

userRouter.get("/test", userController.test);

userRouter.get("/all", [checkJWT, checkAdmin], userController.getAll);

userRouter.get("/:id", checkJWT, userController.getUser);

userRouter.delete("/:id", checkJWT, userController.deleteUser);

userRouter.put("/:id", checkJWT, userController.updateUser);

module.exports = userRouter;
