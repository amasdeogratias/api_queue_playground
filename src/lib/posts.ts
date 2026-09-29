import { db } from "../database/db.ts";
import { posts } from "../database/schema.ts";
import type { GeneratedPost } from "../types.ts";

const TOTAL_POSTS = 10000;
const BATCH_SIZE = 500;

function generatePost(index: number): GeneratedPost {
    return {
        title: `Post ${index}`,
        content: `This is the content for Post ${index}`
    }
}

export async function createPosts() {
    for (let i = 0; i < TOTAL_POSTS; i += BATCH_SIZE) {
        const end = Math.min(i + BATCH_SIZE, TOTAL_POSTS);
        const batch: GeneratedPost[] = [];
        for (let j = i; j < end; j++) {
            batch.push(generatePost(j + 1));
        }
        // Here you would typically insert the batch into the database
        await db.insert(posts).values(batch);

        console.log(`Inserted posts ${i + 1} to ${end}`);
    }
    console.log(`Successfully generated ${TOTAL_POSTS} posts`)
}