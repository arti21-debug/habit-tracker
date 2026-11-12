"use client";
import { deleteHabit } from "@/lib/habits";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function useDeleteHabit(setIsDelModalActive: (val: boolean) => void) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const t = useTranslations("HabitDelete");

  const { mutate, isPending } = useMutation({
    mutationFn: deleteHabit,
    onError: () => {
      setIsDelModalActive(false);
      toast.error(t("error"));
    },
    onSuccess: () => {
      setIsDelModalActive(false);
      toast.success(t("success"));
      // Говорим TanStack что кэш с ключом ["habits"] устарел
      // Он автоматически перезапрашивает getHabits()
      // Habits.tsx обновится сам без каких-либо действий с моей стороны
      queryClient.invalidateQueries({ queryKey: ["habits"] });
      router.push("/habits");
    },
  });

  return { mutate, isPending };
}