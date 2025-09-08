import z from "zod";
import { postsSchema } from "./schema";

export const postSchema = z.array(postsSchema);
export type Post = z.infer<typeof postsSchema>;
