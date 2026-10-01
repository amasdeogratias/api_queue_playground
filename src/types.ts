export type Post = {
    title: string;
    content: string;
}

export type QueueItem = {
    id: string;
    data: Post;
    attempts: number;
    created_At: Date;
}