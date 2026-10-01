import express from 'express';
import { db } from './database/db.ts'
import { posts } from './database/schema.ts';
import { createPosts, getPosts } from './lib/posts.ts';
import { z } from 'zod';
import type { Post } from './types.ts';
import { addToQueue, startQueueWorker } from './lib/queue.ts';
import { eq } from 'drizzle-orm';

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

//insert posts api route
const PostSchema = z.object({
    title: z.string().min(3, "Title cannot be empty"),
    content: z.string().min(10, "Content cannot be empty")
})

app.post("/api/posts", async (req: express.Request<{}, {}, Post>, res) => {
    
    const validatedData = PostSchema.safeParse(req.body);
    if (!validatedData.success) {
        return res.status(400).json({
            status: "error",
            message: validatedData.error.issues,
        })
    }
    const {title, content} = validatedData.data

    try {
        const response = await db.insert(posts).values({
            title,
            content
        })
        if(response) {
            return res.status(201).json({
                status: "success",
                message: "Post inserted successfully"
            })
        }

    }catch (error) {
        //if anything happen, try to insert data later
        const queueItem = addToQueue(validatedData.data)
        return res.status(202).json({
            message: "Database unavailable. Your request has been queued for later processing.",
            status: "queued",
            queueId: queueItem.id
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
            data: result.data,
        });
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Failed to fetch posts",
        });
    }
});

//get single post by id
app.get("/api/posts/:id", async (req, res) => {
    const id = Number(req.params.id)
    if(!id) {
        return res.status(400).json({
            message: "No post found"
        })
    }
    try {
        const response = await db.select().from(posts).where(eq(posts.id, id))
        if(response.length === 0) {
            return res.status(200).json({
                message: "No post found for this id"
            })
        }
        return res.status(200).json(response)
    } catch (error) {
        return res.status(500).json({
            message: `"Problem in fetching data ${error}`
        })
    }
})

app.listen(port, () => {
    console.log("Server is running on port " + port);

    startQueueWorker();
})