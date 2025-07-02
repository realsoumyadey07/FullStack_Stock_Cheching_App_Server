import express from "express";
import { userLogin, userLogout, userRegister } from "../controllers/user.js";
import { IsAuthenticated } from "../middlewares/IsAuthenticated.js";

const userRouter = express.Router();

userRouter.post("/register", userRegister);
userRouter.post("/login", userLogin);
userRouter.get("/logout", IsAuthenticated, userLogout);

export default userRouter;