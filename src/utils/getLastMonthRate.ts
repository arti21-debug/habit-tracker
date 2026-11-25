import { addDaysIso } from "./date";
import { getScheduledDates, isScheduledOn } from "./schedule";

// процент выполнений за последние 30 дней (включая сегодня), строкой "0.0"
export function getLastMonthRate(
  completions: { completion_date: string }[],
  today: string | undefined,
  days?: string[] | null,
): string {
  if (!today) return "0.0";
  const from = addDaysIso(today, -29);

  // знаменатель: запланированные дни окна (у ежедневной привычки их 30)
  const total = getScheduledDates(days, from, today).length;

  // числитель: выполнения в окне, попавшие на запланированные дни
  const count = completions.filter(
    (c) =>
      c.completion_date >= from &&
      c.completion_date <= today &&
      isScheduledOn(days, c.completion_date),
  ).length;
  return total > 0 ? ((count / total) * 100).toFixed(1) : "0.0";
}
