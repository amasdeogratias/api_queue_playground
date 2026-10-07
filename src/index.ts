import express from 'express';
import { db } from './database/db.ts'
import { posts } from './database/schema.ts';
import { startQueueWorker } from './lib/queue.ts';
import { authRouter } from '#/routes/authRoute.ts';
import { postsRouter } from './routes/postsRoute.ts';
import cookieParser from "cookie-parser";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());

//routes
app.use("/api/", authRouter);
app.use("/api/", postsRouter);

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



app.listen(port, () => {
    console.log("Server is running on port " + port);

    startQueueWorker();
})