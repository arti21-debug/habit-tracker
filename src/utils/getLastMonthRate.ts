import { addDaysIso } from "./date";

// процент выполнений за последние 30 дней (включая сегодня), строкой "0.0"
export function getLastMonthRate(
  completions: { completion_date: string }[],
  today: string | undefined,
): string {
  if (!today) return "0.0";
  const from = addDaysIso(today, -29);
  const count = completions.filter(
    (c) => c.completion_date >= from && c.completion_date <= today,
  ).length;
  return ((count / 30) * 100).toFixed(1);
}
