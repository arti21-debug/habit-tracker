"use client";

import { getHabitCompletions } from "@/lib/completions";
import { getUser, getUserTimezone } from "@/lib/profiles";
import { Completion } from "@/types/data";
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
    const UTCTimestamp = Date.now();
    const timestamp30DaysAgo = UTCTimestamp - 30 * 24 * 60 * 60 * 1000;
    const lastMonthCompletions = completions?.filter(
      (comp) => Date.parse(comp.completion_date) >= timestamp30DaysAgo,
    );

    const percent = ((lastMonthCompletions?.length ?? 0) / 30) * 100;
    return percent.toFixed(1);
  }

  function getBestStreak(completions: Completion[]) {
    if (!completions.length) return [];

    const toUtcDay = (date: string) => {
      const [year, month, day] = date.split("-").map(Number);
      return Date.UTC(year, month - 1, day);
    };

    const streaks: { start: string; end: string; length: number }[] = [];

    // Начинаем первую серию с самой свежей даты
    let streakStart = completions[0].completion_date;
    let streakEnd = completions[0].completion_date;
    let streak = 1;
    let prevDate = toUtcDay(completions[0].completion_date);

    for (let i = 1; i < completions.length; i++) {
      const currDate = toUtcDay(completions[i].completion_date);
      const diff = (prevDate - currDate) / 86_400_000;

      if (diff === 1) {
        // Дни идут подряд — расширяем серию, обновляем начало
        // (массив отсортирован от новых к старым, поэтому start двигается назад)
        streakStart = completions[i].completion_date;
        streak++;
      } else {
        // Разрыв — сохраняем текущую серию и начинаем новую
        streaks.push({ start: streakStart, end: streakEnd, length: streak });

        // Новая серия начинается и заканчивается на текущей дате
        streakStart = completions[i].completion_date;
        streakEnd = completions[i].completion_date;
        streak = 1;
      }

      prevDate = currDate;
    }

    // Пушим последнюю серию — цикл заканчивается без разрыва
    // поэтому последняя серия никогда не попадёт в else блок
    streaks.push({ start: streakStart, end: streakEnd, length: streak });
    return Math.max(...streaks.map((s) => s.length)); // возврат наибольшей серии
  }

  // вычисление текущей серии
  function getCurrentStreak(completions: Completion[], timeZone: string) {
    if (!completions.length) return 0;

    // Преобразует календарную дату YYYY-MM-DD в timestamp полуночи UTC
    // для сравнения разницы между календарными днями.
    const toUtcDay = (date: string) => {
      const [year, month, day] = date.split("-").map(Number);
      return Date.UTC(year, month - 1, day);
    };

    // Получает сегодняшнюю календарную дату в часовом поясе пользователя.
    const today = new Intl.DateTimeFormat("en-CA", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date());

    // Проверяет, было ли последнее выполнение сегодня или вчера.
    const daysSinceLastCompletion =
      (toUtcDay(today) - toUtcDay(completions[0].completion_date)) / 86_400_000;

    if (daysSinceLastCompletion < 0 || daysSinceLastCompletion > 1) {
      return 0;
    } // Если последнее выполнение было раньше вчерашнего или дата в будущем,
    // текущая серия отсутствует.

    let streak = 1;

    // Сравнивает соседние даты, начиная с самой свежей.
    // Массив должен быть отсортирован от новых дат к старым.
    for (let i = 0; i < completions.length - 1; i++) {
      const currDate = toUtcDay(completions[i].completion_date);
      const prevDate = toUtcDay(completions[i + 1].completion_date);

      // Вычисляет разницу между соседними календарными датами в днях.
      const diff = (currDate - prevDate) / 86_400_000;

      if (diff === 1) {
        streak++; // Последовательные дни — продолжаем серию.
      } else {
        break; // Разрыв серии — прекращаем подсчёт.
      }
    }

    return streak;
  }

  // получение юзера
  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: getUser,
  });

  // получение часового пояса юзера
    const { data: profile } = useQuery({
      queryKey: ["profile", user?.id],
      queryFn: getUserTimezone,
    });

  // получаем актуальную серию выполнения привычек
  const streak = getCurrentStreak(completions ?? [], profile?.time_zone);

  // получаем наибольшую серию
  const bestStreak = getBestStreak(completions ?? []);

  // всего выполнено
  const totalCompletions = completions?.length ?? 0;

  // процент выполнений за последние 30 дней
  const lastMonthRate = getLastMonthCompletionRate();

  return { streak, bestStreak, totalCompletions, lastMonthRate };
}
