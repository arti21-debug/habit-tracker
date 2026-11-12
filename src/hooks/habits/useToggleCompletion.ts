"use client";
import { completeHabit, uncompleteHabit } from "@/lib/completions";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function useToggleCompletion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      habitId,
      date,
      isDone,
    }: {
      habitId: string;
      date: string;
      isDone: boolean;
    }) =>
      isDone ? uncompleteHabit(habitId, date) : completeHabit(habitId, date),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["completions"] });
      queryClient.invalidateQueries({ queryKey: ["habits-with-completions"] });
      // список привычек теперь содержит выполнения внутри
      queryClient.invalidateQueries({ queryKey: ["habits"] });
    },
  });
}
