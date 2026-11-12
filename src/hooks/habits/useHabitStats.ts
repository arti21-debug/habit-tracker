"use client";
import { getHabitCompletions } from "@/lib/completions";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

export default function useHabitStats(habitId: string | undefined) {
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

  useEffect(() => {
    if (error) {
      console.error("Ошибка получения выполнений:", error);
    }
  }, [error]);

  function getLastMonthCompletionRate() {
    const from = new Date();
    from.setDate(from.getDate() - 29);
    const fromDate = from.toLocaleDateString("en-CA");

    const lastMonthCompletions = completions?.filter(
      (comp) => comp.completion_date >= fromDate,
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
