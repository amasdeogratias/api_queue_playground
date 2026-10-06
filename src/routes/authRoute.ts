import {Router} from "express";
import { authController } from "#/controllers/authController.ts";

export const authRouter = Router();

authRouter.post("/auth/login", authController.login);
authRouter.post("/auth/register", authController.register);
