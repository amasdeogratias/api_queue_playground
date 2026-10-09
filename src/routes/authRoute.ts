import {Router} from "express";
import { authController } from "#/controllers/authController.ts";
import { authMiddleware } from "#/middleware/authMiddleware.ts";

export const authRouter = Router();

authRouter.post("/auth/login", authController.login);
authRouter.post("/auth/register", authController.register);
authRouter.get("/auth/profile", authMiddleware, authController.getUser);