const { Router } = require("express");
const userController = require("../controllers/userController");

const userRouter = Router();

userRouter.get("/", userController.test);

userRouter.get("/all", userController.getAll);

userRouter.post("/register", userController.register);

userRouter.post("/login", userController.login);

userRouter.get("/:id", userController.getUser);

userRouter.delete("/:id", userController.deleteUser);

userRouter.put("/update/:id", userController.updateUser);

module.exports = userRouter;
