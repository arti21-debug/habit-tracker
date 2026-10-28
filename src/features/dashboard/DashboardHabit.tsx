"use client";
import useHabitDetail from "@/hooks/habits/useHabitDetail";
import { HabitWithCompletions } from "@/types/data";
import getCurrentHabitStreak from "@/utils/getCurrentHabitSreak";

type Props = {
  habit: HabitWithCompletions;
  timeZone: string;
};

export default function DashboardHabit({ habit, timeZone }: Props) {
  const { mutate, date } = useHabitDetail(habit.id);

  const todayDate = new Date().toLocaleDateString("en-CA");

  const isDone = habit.completions.some((comp) =>
    comp.completion_date.startsWith(todayDate),
  ); // проверка на выполнение привычки

  const streak = getCurrentHabitStreak(habit.completions, timeZone); // текущая серия привычки

  return (
    <div
      className="flex items-center gap-3 py-3 px-4 rounded-lg"
      style={{ background: "var(--color-surface-muted)" }}
    >
      <button
        onClick={() => {
          if (!habit?.id || !date) return;
          mutate({
            habitId: habit.id,
            date,
            isDone,
          });
        }}
        className="w-5 h-5 rounded-md shrink-0 flex items-center justify-center"
        style={{
          background: isDone ? "var(--color-primary)" : "transparent",
          border: isDone
            ? "1px solid var(--color-primary)"
            : "1px solid var(--color-border-hover)",
        }}
      >
        {isDone && (
          <span style={{ color: "#fff", fontSize: 11, lineHeight: 1 }}>✓</span>
        )}
      </button>

      <span className="text-lg">{habit.icon}</span>

      <span
        className="text-sm flex-1"
        style={{
          color: isDone
            ? "var(--color-text-muted)"
            : "var(--color-text-primary)",
          textDecoration: isDone ? "line-through" : "none",
        }}
      >
        {habit.name}
      </span>

      <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>
        🔥 {streak}
      </span>
    </div>
  );
}
