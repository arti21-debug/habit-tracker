import { addDaysIso } from "./date";

const WEEKDAY_BY_LABEL: Record<string, number> = {
  Вс: 0,
  Пн: 1,
  Вт: 2,
  Ср: 3,
  Чт: 4,
  Пт: 5,
  Сб: 6,
};

export const weekdayOf = (iso: string): number =>
  new Date(`${iso}T00:00:00Z`).getUTCDay();

// Пустой список или null означает ежедневную привычку
export function isScheduledOn(
  days: string[] | null | undefined,
  iso: string,
): boolean {
  if (!days || days.length === 0) return true;
  const weekday = weekdayOf(iso);
  return days.some((label) => WEEKDAY_BY_LABEL[label] === weekday);
}

export function getScheduledDates(
  days: string[] | null | undefined,
  from: string,
  to: string,
): string[] {
  const result: string[] = [];
  for (let d = from; d <= to; d = addDaysIso(d, 1)) {
    if (isScheduledOn(days, d)) result.push(d);
  }
  return result;
}
