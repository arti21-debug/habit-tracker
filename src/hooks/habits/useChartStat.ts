"use client";
import { useTranslations } from "next-intl";
import useHabitDetail from "./useHabitDetail";

export default function useChartStat(habitId: string) {
  const { dates, startDate, completions } = useHabitDetail(habitId);

  // груперуем массив дат по неделям
  const weekGroups = dates.reduce<(typeof dates)[]>((acc, date) => {
    const diff = date.date.getTime() - startDate.getTime();
    const dayDiff = diff / 86_400_000;
    const weekNum = Math.floor(dayDiff / 7);

    if (!acc[weekNum]) {
      acc[weekNum] = [];
    } // если накопителя по номеру текущей недели не существует - создаем

    acc[weekNum].push(date); // пушим дату в текущий накопленный массив
    return acc; // возвращаем накопитель для следующей итерации reduce
  }, []);

  // Set выполненных дат для быстрой проверки наличия даты
  const completedDates = new Set(
    completions?.map((comp) => comp.completion_date),
  );

  const t = useTranslations("WeekStat");

  // рассчитываем процент выполнений для каждой недели
  const weeksStat = weekGroups.map((group, i) => {
    const weekCompletions = group.filter(
      (date) => completedDates.has(date.dateString), // проверяем выполненные даты
    );

    return {
      label: `${t("week_short")} ${i + 1}`,
      percent: Math.round((weekCompletions.length / group.length) * 100), // процент выполненных за неделю
    };
  });

  return { weeksStat };
}
