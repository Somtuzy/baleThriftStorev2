import { Router } from "express";
import authController from "../controllers/auth.controller";
import validator from "../middlewares/validator.middleware";
import { SignUpUserSchema, LoginUserSchema } from "../schemas/user.schema";
import isValidToken  from "../middlewares/isValidToken.middleware"
import authenticate from "../middlewares/authenticate";

const authRouter = Router();

authRouter.post("/login", [validator(LoginUserSchema)], authController.login);

authRouter.post("/signup", [validator(SignUpUserSchema)], authController.signup);

authRouter.post("/recover", [validator(LoginUserSchema)], authController.recover);

authRouter.get("/logout", authenticate, authController.logout);

authRouter.get("/", authenticate, isValidToken);

export default authRouter;