import { db } from "../database/db.ts";
import { posts } from "../database/schema.ts";
import type { Post, QueueItem } from "../types.ts";

const retryInterval = Number(process.env.RETRY_INTERVAL || 5000);

const queue: QueueItem[] = [];

//add data to the retry queue
export function addToQueue(data: Post) {
  const item: QueueItem = {
    id: crypto.randomUUID(),
    data,
    attempts: 0,
    created_At: new Date(),
  };

  queue.push(item);
  console.log(`[QUEUE] Added ${item.id}. Queue size: ${queue.length}`);

  return item;
}

//insert post in the db in queue
async function insertPost(item: QueueItem) {
  item.attempts++;
  try {
    await db.insert(posts).values(item.data);
    console.log(
      `[SUCCESS] ${item.id} inserted successfully after ${item.attempts} attempt(s)`,
    );
    return true;
  } catch (error) {
    console.error(`[FAILED] to insert ${item.id} atempt ${item.attempts}`);
    return false;
  }
}

//process queue
async function processQueue() {
  if (queue.length === 0) {
    return;
  }
  console.log(`[QUEUE] Processing ${queue.length} pending item(s)`);

  for (const item of [...queue]) {
    const success = await insertPost(item);

    if (success) {
      const index = queue.findIndex((queuedItem) => queuedItem.id === item.id);

      if (index !== -1) {
        queue.splice(index, 1);
      }
    }
  }

  console.log(`[QUEUE] Remaining items: ${queue.length}`);
}

/**
 * Start retry worker
 */
export function startQueueWorker() {
  console.log(
    `[QUEUE] Retry worker started. Interval: ${retryInterval}ms`
  );

  setInterval(async () => {
    await processQueue();
  }, retryInterval);
}
