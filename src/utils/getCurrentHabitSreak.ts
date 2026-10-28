"use client";
import { Completion } from "@/types/data";

export default function getCurrentHabitStreak(completions: Completion[], timeZone: string) {
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