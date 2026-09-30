import { db } from "../database/db.ts";
import { posts } from "../database/schema.ts";
import type { Post } from "../types.ts";
import { sql } from 'drizzle-orm';


const TOTAL_POSTS = 10000;
const BATCH_SIZE = 500;

function generatePost(index: number): Post {
    return {
        title: `Post ${index}`,
        content: `This is the content for Post ${index}`
    }
}

export async function createPosts() {
    for (let i = 0; i < TOTAL_POSTS; i += BATCH_SIZE) {
        const end = Math.min(i + BATCH_SIZE, TOTAL_POSTS);
        const batch: Post[] = [];
        for (let j = i; j < end; j++) {
            batch.push(generatePost(j + 1));
        }
        // Here you would typically insert the batch into the database
        await db.insert(posts).values(batch);

        console.log(`Inserted posts ${i + 1} to ${end}`);
    }
    console.log(`Successfully generated ${TOTAL_POSTS} posts`)
}

//get all posts with pagination
interface PostParams {
    page: number,
    limit: number,
}

interface PostResponse {
    id: number,
    title: string,
    content: string,
    createdAt: Date,
    updatedAt: Date,
}

interface PaginatedPostsResponse {
    data: PostResponse[],
    pagination: {
        page: number,
        limit: number,
        total: number,
        totalPages: number,
        hasNextPage: boolean,
        hasPrevPage: boolean,
    }
}

export async function getPosts(params: PostParams): Promise<PaginatedPostsResponse> {
    //destructure params
    const { page, limit } = params;
    const offset = (page - 1) * limit;

    const [data, totalRows] = await Promise.all([
        db.select().from(posts).limit(limit).offset(offset),
        await db.select({ count: sql<number>`count(*)` }).from(posts)
    ]);

    const total = (totalRows[0] as any).total;
    const totalPages = Math.ceil(total / limit);

    return {
        data: data.map((post) => ({
            id: post.id,
            title: post.title,
            content: post.content,
            createdAt: post.createdAt,
            updatedAt: post.updatedAt,
        })),
        pagination: {
            page,
            limit,
            total,
            totalPages,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1,
        }
    }
}