import z from "zod";

export const postsSchema= z.object({
  userId: z.number(),
  id: z.number(),
  title: z.string(),
  body: z.string()
})