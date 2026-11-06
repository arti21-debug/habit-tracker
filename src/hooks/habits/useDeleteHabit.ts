"use client";
import { deleteHabit } from "@/lib/habits";
import { getUser } from "@/lib/profiles";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function useDeleteHabit(setIsDelModalActive: (val: boolean) => void) {
  const router = useRouter();
  const queryClient = useQueryClient();
  
  // получение юзера
  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: getUser,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: deleteHabit,
    onError: () => {
      setIsDelModalActive(false);
      toast.error("Не удалось удалить привычку");
    },
    onSuccess: () => {
      setIsDelModalActive(false);
      toast.success("Привычка удалена");
      // Говорим TanStack что кэш с ключом ["habits"] устарел
      // Он автоматически перезапрашивает getHabits()
      // Habits.tsx обновится сам без каких-либо действий с моей стороны
      queryClient.invalidateQueries({ queryKey: ["habits"] });
      router.push("/habits");
    },
  });

  return { mutate, isPending };
}