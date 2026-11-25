import { addDaysIso } from "./date";
import { isScheduledOn } from "./schedule";

export default function getBestHabitStreak(
  completions: { completion_date: string }[],
  days?: string[] | null,
): number {
  if (!completions.length) return 0;

  const done = new Set(completions.map((c) => c.completion_date));
  const sorted = [...done].sort(); // порядок входного массива больше не важен
  const first = sorted[0];
  const last = sorted[sorted.length - 1];

  let best = 0;
  let run = 0;
  for (let d = first; d <= last; d = addDaysIso(d, 1)) {
    if (!isScheduledOn(days, d)) continue;
    if (done.has(d)) {
      run++;
      if (run > best) best = run;
    } else {
      run = 0;
    }
  }
  return best;
}
