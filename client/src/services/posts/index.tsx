import { axiosAuth } from "../../lib/axios";
import { usersSchema, type User } from "../users/type";
import { postSchema, type Post } from "./types";

const LS_POSTS = "posts";
const LS_USERS = "users";

function readPostsLS(): Post[] {
  try {
    const raw = localStorage.getItem(LS_POSTS);
    if (!raw) return [];
    const json = JSON.parse(raw);
    const parsed = postSchema.safeParse(json);
    return parsed.success ? parsed.data : [];
  } catch {
    return [];
  }
}

function readUsersLS(): User[] {
  try {
    const raw = localStorage.getItem(LS_USERS);
    if (!raw) return [];
    const json = JSON.parse(raw);
    const parsed = usersSchema.safeParse(json);
    return parsed.success ? parsed.data : [];
  } catch {
    return [];
  }
}

function writeUsersLS(data: Post[]) {
  localStorage.setItem(LS_POSTS, JSON.stringify(data));
}

function writePostsLS(data: Post[]) {
  localStorage.setItem(LS_POSTS, JSON.stringify(data));
}

export function updatePostByIdLS(next: Post): boolean {
  const posts = readPostsLS();
  const idx = posts.findIndex((p) => p.id === next.id);
  if (idx === -1) return false;
  const updated = posts.map((p) => (p.id === next.id ? { ...p, ...next } : p));
  writePostsLS(updated);
  return true;
}

export function removePostByIdLS(id: number): boolean {
  const posts = readPostsLS();
  const nextPosts = posts.filter((p) => p.id !== id);
  const changed = nextPosts.length !== posts.length;
  if (changed) writePostsLS(nextPosts);
  return changed;
}

export function getNextPostIdLS(): number {
  const posts = readPostsLS();
  if (posts.length === 0) return 1;
  const maxId = posts.reduce((m, p) => (p.id > m ? p.id : m), posts[0].id);
  return maxId + 1;
}

export async function createPostLS(
  input: Pick<Post, "userId" | "title" | "body">
): Promise<Post> {
  const posts = readPostsLS();
  const users = readUsersLS();

  const userExists = users.some((u) => u.id === input.userId);
  if (!userExists) throw new Error("Geçerli bir kullanıcı seçin.");

  const id = getNextPostIdLS();
  const newPost: Post = { id, ...input };

  writePostsLS([...posts, newPost]);
  return newPost;
}

export const FetchPosts = async (): Promise<Post[]> => {
  const local = readPostsLS();
  if (local.length > 0) return local;

  const res = await axiosAuth.get("/posts");
  const data = postSchema.parse(res.data);
  writeUsersLS(data);
  return data;
};

export async function FetchPostsByUserId(userId: number): Promise<Post[]> {
  const local = readPostsLS();
  if (local.length > 0) {
    const filtered = local.filter((p) => p.userId === userId);
    const parsed = postSchema.parse(filtered);
    return parsed;
  } else {
    return [];
  }
}
