import z from "zod";
import { userSchema } from "./schema";

export const usersSchema = z.array(userSchema);
export type User = z.infer<typeof userSchema>;
