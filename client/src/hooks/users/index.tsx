import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { User } from "@/services/users/type";
import {
  FetchUsers,
  removeUserByIdLS,
  updateUserByIdLS,
} from "@/services/users";

export function useUserActions() {
  const qc = useQueryClient();

  const getUsers = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: FetchUsers,
    staleTime: 60_000,
  });

  const updateUser = useMutation({
    mutationFn: (payload: User) => updateUserByIdLS(payload),
    onSuccess: (ok) => {
      if (ok) qc.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const removeUser = useMutation({
    mutationFn: (userId: number) => removeUserByIdLS(userId),
    onSuccess: (ok) => {
      if (ok) {
        qc.invalidateQueries({ queryKey: ["users"] });
        qc.invalidateQueries({ queryKey: ["posts"] });
      }
    },
  });

  return { getUsers, updateUser, removeUser };
}
