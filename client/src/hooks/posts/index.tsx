import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Post } from "../../services/posts/types";
import {
  createPostLS,
  FetchPosts,
  FetchPostsByUserId,
} from "../../services/posts";

export function usePostsActions(selectedUserId?: number) {
  const qc = useQueryClient();

  const getPosts = useQuery<Post[]>({
    queryKey: ["posts", selectedUserId ?? "all"],
    queryFn: () =>
      selectedUserId ? FetchPostsByUserId(selectedUserId) : FetchPosts(),
    staleTime: 60_000,
  });

  const createPost = useMutation<
    boolean | Post,
    Error,
    Pick<Post, "userId" | "title" | "body">
  >({
    mutationFn: async (payload) => {
      const created = await createPostLS(payload);
      return created;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  return { getPosts, createPost };
}
