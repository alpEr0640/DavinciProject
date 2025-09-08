import { axiosAuth } from "../../lib/axios";
import { usersSchema, type User } from "./type";
import { postSchema, type Post } from "../posts/types";

const LS_USERS = "users";
const LS_POSTS = "posts";

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
export function getNextUserIdLS(): number {
  const users = readUsersLS();
  if (users.length === 0) return 1;
  const maxId = users.reduce(
    (max, u) => (u.id > max ? u.id : max),
    users[0].id
  );
  return maxId + 1;
}

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

function writeUsersLS(users: User[]) {
  localStorage.setItem(LS_USERS, JSON.stringify(users));
}

function writePostsLS(posts: Post[]) {
  localStorage.setItem(LS_POSTS, JSON.stringify(posts));
}

export async function removeUserByIdLS(id: number) {
  const users = readUsersLS();
  const posts = readPostsLS();

  const nextUsers = users.filter((u) => u.id !== id);
  const nextPosts = posts.filter((p) => p.userId !== id);

  const changed =
    nextUsers.length !== users.length || nextPosts.length !== posts.length;
  if (changed) {
    writeUsersLS(nextUsers);
    writePostsLS(nextPosts);
  }
  return changed;
}

export async function updateUserByIdLS(next: User) {
  const users = readUsersLS();
  const idx = users.findIndex((u) => u.id === next.id);
  if (idx === -1) return false;

  const nextUsers = users.map((u) =>
    u.id === next.id ? { ...u, ...next } : u
  );
  writeUsersLS(nextUsers);
  return true;
}

export async function createUserLS(
  input: Pick<User, "name" | "username" | "email">
): Promise<User> {
  const users = readUsersLS();

  const usernameTaken = users.some(
    (u) => u.username.toLowerCase() === input.username.toLowerCase()
  );
  const emailTaken = users.some(
    (u) => u.email.toLowerCase() === input.email.toLowerCase()
  );
  if (usernameTaken) throw new Error("Bu kullanıcı adı zaten kullanılıyor.");
  if (emailTaken) throw new Error("Bu e-posta zaten kayıtlı.");

  const id = getNextUserIdLS();
  const newUser: User = { id, ...input };
  writeUsersLS([...users, newUser]);
  return newUser;
}

export const FetchUsers = async (): Promise<User[]> => {
  const local = readUsersLS();
  if (local.length > 0) return local;

  const res = await axiosAuth.get("/users");
  const data = usersSchema.parse(res.data);

  writeUsersLS(data);

  return data;
};
