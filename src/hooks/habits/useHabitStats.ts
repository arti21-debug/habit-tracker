"use client";
import { getHabitCompletions } from "@/lib/completions";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

export default function useHabitStats(habitId: string | undefined) {
  useEffect(() => {
    if (error) {
      console.error("Ошибка получения выполнений:", error);
    }
  })

  // получение истории выполнения привычек
  const {
    data: completions,
    error,
  } = useQuery({
    queryKey: ["completions", habitId],
    queryFn: () => {
      if (!habitId) throw new Error("habitId отсутствует");
      return getHabitCompletions(habitId);
    },
    enabled: !!habitId,
  });

  function getLastMonthCompletionRate() {
    const timestamp30DaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
    const lastMonthCompletions = completions?.filter(
      (comp) => Date.parse(comp.completion_date) >= timestamp30DaysAgo,
    );

    const percent = ((lastMonthCompletions?.length ?? 0) / 30) * 100;
    return percent.toFixed(1);
  }

  // всего выполнено
  const totalCompletions = completions?.length ?? 0;

  // процент выполнений за последние 30 дней
  const lastMonthRate = getLastMonthCompletionRate();

  return { totalCompletions, lastMonthRate };
}
