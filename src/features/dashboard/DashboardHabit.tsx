"use client";
import useToggleCompletion from "@/hooks/habits/useToggleCompletion";
import { HabitWithCompletions } from "@/types/data";
import getCurrentHabitStreak from "@/utils/getCurrentHabitSreak";

type Props = {
  habit: HabitWithCompletions;
  timeZone: string;
  today: string | undefined;
};

export default function DashboardHabit({ habit, timeZone, today }: Props) {
  const { mutate, isPending } = useToggleCompletion();

  // проверка на выполнение привычки
  const isDone =
    !!today && habit.completions.some((c) => c.completion_date === today);
    
  const streak = getCurrentHabitStreak(habit.completions, timeZone);

  return (
    <div
      className="flex items-center gap-3 py-3 px-4 rounded-lg"
      style={{ background: "var(--color-surface-muted)" }}
    >
      <button
        onClick={() => {
          if (!today) return;
          mutate({
            habitId: habit.id,
            date: today,
            isDone,
          });
        }}
        disabled={!today || isPending}
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
