// src/features/demo/useDemoData.ts
"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import toast from "react-hot-toast";
import { getUser, getUserTimezone } from "@/lib/profiles";
import { seedDemoData, clearDemoData } from "./seedDemoData";

export default function useDemoData() {
  const t = useTranslations("Demo");
  const queryClient = useQueryClient();

  // все данные, зависящие от привычек, нужно перезапросить
  const refresh = () => {
    for (const key of ["habits", "completions", "habits-with-completions"]) {
      queryClient.invalidateQueries({ queryKey: [key] });
    }
  };

  const { mutate: seed, isPending: isSeeding } = useMutation({
    mutationFn: async () => {
      const user = await getUser();
      if (!user) throw new Error("Пользователь не авторизован");

      // если профиля нет, берём часовой пояс браузера
      const profile = await getUserTimezone().catch(() => null);
      const timeZone =
        profile?.time_zone ?? Intl.DateTimeFormat().resolvedOptions().timeZone;

      return seedDemoData({
        userId: user.id,
        timeZone,
        getName: (key) => t(`habits.${key}`),
      });
    },
    onSuccess: () => {
      toast.success(t("created"));
      refresh();
    },
    onError: () => toast.error(t("createFailed")),
  });

  const { mutate: clear, isPending: isClearing } = useMutation({
    mutationFn: clearDemoData,
    onSuccess: () => {
      toast.success(t("cleared"));
      refresh();
    },
    onError: () => toast.error(t("clearFailed")),
  });

  return { seed, clear, isSeeding, isClearing };
}
