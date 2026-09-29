import express from 'express';
import { db } from './database/db.ts'
import { posts } from './database/schema.ts';
import { createPosts, getPosts } from './lib/posts.ts';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Define your routes here
app.get("/api/health", async (_req, res) => {
    try {
        await db.select().from(posts).limit(1);
        return res.status(200).json({
            status: "success",
            message: "Database connection is healthy",
        })
    } catch(error) {
        return res.status(500).json({
            status: "error",
            message: "Failed to connect to database",
        })
    }
})

//generate post api route
app.post("/api/posts/generate", async (req, res) => {
    try {
        await createPosts();
        return res.status(200).json({
            status: "success",
            message: "Posts generated successfully",
        })
    }catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Failed to generate posts",
        })
    }

})

//get all posts with pagination api route
app.get("/api/posts", async (req, res) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;

        const result = await getPosts({ page, limit });
        return res.status(200).json({
            status: "success",
            data: result
        });
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Failed to fetch posts",
        });
    }
});

app.listen(port, () => {
    console.log("Server is running on port " + port);
})