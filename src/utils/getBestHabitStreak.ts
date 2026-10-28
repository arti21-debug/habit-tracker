"use client";
import { Completion } from "@/types/data";

export default function getBestHabitStreak(completions: Completion[]) {
  if (!completions.length) return 0;

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