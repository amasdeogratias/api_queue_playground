import express from 'express';
import { db } from './database/db.ts'
import { posts } from './database/schema.ts';
import { createPosts } from './lib/posts.ts';

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

app.listen(port, () => {
    console.log("Server is running on port " + port);
})