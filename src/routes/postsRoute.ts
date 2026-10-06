import { Router } from "express";
import { postsController } from "#/controllers/postsController.ts";

export const postsRouter = Router();

postsRouter.post("/posts/generate", postsController.generatePosts);
postsRouter.post("/posts", postsController.createPost);
postsRouter.get("/posts", postsController.getPosts);
postsRouter.get("/posts/:id", postsController.getPostById);