import { addDaysIso, getToday } from "./date";
import { isScheduledOn } from "./schedule";

export default function getCurrentHabitStreak(
  completions: { completion_date: string }[],
  timeZone: string,
  days?: string[] | null,
): number {
  if (!completions.length) return 0;

  const done = new Set(completions.map((c) => c.completion_date));
  const today = getToday(timeZone);

  // серия не может начаться раньше самого первого выполнения
  const floor = completions.reduce(
    (min, c) => (c.completion_date < min ? c.completion_date : min),
    completions[0].completion_date,
  );

  let streak = 0;
  for (let d = today; d >= floor; d = addDaysIso(d, -1)) {
    if (!isScheduledOn(days, d)) continue; // незапланированный день серию не трогает
    if (done.has(d)) streak++;
    else if (d !== today) break; // пропуск запланированного дня обрывает серию
    // а если не отмечен именно сегодня, у человека ещё есть время, серия сохраняется
  }
  return streak;
}
