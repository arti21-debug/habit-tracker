"use client";

import { editArchiveStatus } from "@/lib/habits";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type UpdateArchiveStatus = {
  id: string;
  isArchived: boolean;
};

export default function useArchiveHabit(
  setIsDelModalActive: (val: boolean) => void,
) {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: ({ id, isArchived }: UpdateArchiveStatus) =>
      editArchiveStatus(id, isArchived),
    onSuccess: () => {
      setIsDelModalActive(false);
      // Говорим TanStack что кэш с ключом ["habits"] устарел
      // Он автоматически перезапрашивает getHabits()
      // Habits.tsx обновится сам без каких-либо действий с моей стороны
      queryClient.invalidateQueries({ queryKey: ["habits"] });
    },
  });

  return { mutate };
}
