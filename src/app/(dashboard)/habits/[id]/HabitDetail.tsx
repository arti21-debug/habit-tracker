"use client";
import EditHabitModal from "@/features/habits/EditHabitModal";
import HabitDeleteModal from "@/features/habits/HabitDeleteModal";
import useHabitDetail from "@/hooks/habits/useHabitDetail";
import useHabitStats from "@/hooks/habits/useHabitStats";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import WeekStatChart from "./WeekStatChart";
import getBestHabitStreak from "@/utils/getBestHabitStreak";
import getCurrentHabitStreak from "@/utils/getCurrentHabitSreak";

export default function HabitDetail({ id }: { id: string }) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDelModalActive, setIsDelModalActive] = useState(false);

  const {
    habit,
    isLoading,
    mutate,
    completions,
    date,
    isDone,
    dates,
    startDay,
    capitalizedMonth,
    startYear,
    capitalizedMonthFrom,
    capitalizedMonthTo,
    yearTo,
    profile,
  } = useHabitDetail(id);

  const { totalCompletions, lastMonthRate } = useHabitStats(habit?.id);

  const router = useRouter();

  const bestStreak = getBestHabitStreak(completions ?? []);
  const streak = getCurrentHabitStreak(completions ?? [], profile?.time_zone);

  // Set выполненных дат для быстрой проверки наличия даты
  const completedDates = new Set(
    completions?.map((comp) => comp.completion_date),
  );

  if (!habit) return;

  if (isLoading)
    return (
      <div className="flex items-center justify-center pt-20">
        <div className="size-12 animate-spin rounded-full border-2 border-[#2c3440] border-t-[#99aabb]" />
      </div>
    );

  return (
    <div style={{ background: "var(--color-bg)", minHeight: "100vh" }}>
      {/* Hero */}
      <div
        className="px-6 pt-6 pb-8"
        style={{
          background: "var(--color-surface)",
          borderBottom: "1px solid var(--color-border)",
        }}
      >
        {/* Back + actions */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => router.push("/habits")}
            className="flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg transition duration-200 hover:bg-surface-hover"
            style={{
              color: "var(--color-text-secondary)",
              border: "1px solid var(--color-border)",
            }}
          >
            ← Назад
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="text-sm px-3 py-1.5 rounded-lg transition duration-200 hover:bg-surface-hover"
              style={{
                color: "var(--color-text-secondary)",
                border: "1px solid var(--color-border)",
              }}
            >
              ✏️ Изменить
            </button>
            <button
              onClick={() => setIsDelModalActive(true)}
              className="text-sm px-3 py-1.5 rounded-lg transition duration-200 hover:bg-surface-hover"
              style={{
                color: "var(--color-danger)",
                border: "1px solid var(--color-danger)",
              }}
              aria-label="Удалить привычку"
            >
              <Trash color="#d01111" size={20} />
            </button>
          </div>
        </div>

        {/* Habit info + mark button */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shrink-0"
              style={{ background: "var(--color-primary-lighter)" }}
            >
              🧘
            </div>
            <div>
              <h1
                className="text-xl font-medium"
                style={{ color: "var(--color-text-primary)" }}
              >
                Медитация
              </h1>
              <p
                className="text-sm mt-1"
                style={{ color: "var(--color-text-muted)" }}
              >
                {!startDay || !capitalizedMonth
                  ? habit.category
                  : `${habit.category} · ${habit.frequency[0].toLowerCase() + habit.frequency.slice(1)} · с ${startDay} ${capitalizedMonth} ${startYear}`}
              </p>
            </div>
          </div>

          {/* Mark button — отдельно от шапки */}
          <button
            onClick={() => {
              if (!habit?.id) return;

              if (date) {
                mutate({
                  habitId: habit.id,
                  date,
                  isDone: isDone ?? false,
                });
              }
            }}
            className="shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium bg-primary transition duration-200 hover:bg-[#6d65dd]"
            style={{
              color: "#fff",
              border: "1px solid transparent",
            }}
          >
            {isDone ? <div>✗ Отменить</div> : <div>✓ Отметить выполненной</div>}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6 flex flex-col gap-6">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: "Текущий streak", value: `🔥 ${streak}`, sub: "дней" },
            { label: "Лучший streak", value: `${bestStreak}`, sub: "дней" },
            {
              label: "Всего выполнено",
              value: `${totalCompletions}`,
              sub: "дней",
            },
            {
              label: "За 30 дней",
              value: `${lastMonthRate}%`,
              sub: "выполнение",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="p-4 rounded-xl flex flex-col gap-1"
              style={{
                background: "var(--color-surface)",
                border: "1px solid var(--color-border)",
              }}
            >
              <span
                className="text-xs"
                style={{ color: "var(--color-text-muted)" }}
              >
                {stat.label}
              </span>
              <span
                className="text-2xl font-medium"
                style={{ color: "var(--color-text-primary)" }}
              >
                {stat.value}
              </span>
              <span
                className="text-xs"
                style={{ color: "var(--color-text-muted)" }}
              >
                {stat.sub}
              </span>
            </div>
          ))}
        </div>

        {/* Calendar */}
        <div
          className="p-5 rounded-xl"
          style={{
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
          }}
        >
          <div className="flex justify-between">
            <h2
              className="text-sm font-medium mb-4"
              style={{ color: "var(--color-text-primary)" }}
            >
              Календарь выполнений
            </h2>
            <div className="flex gap-2">
              <h2>{`${capitalizedMonthFrom} — ${capitalizedMonthTo}`}</h2>
              <h2>{yearTo}</h2>
            </div>
          </div>

          {/* Day labels */}
          <div className="grid grid-cols-7 gap-1.5 mb-1">
            {["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"].map((d) => (
              <div
                key={d}
                className="text-center text-xs"
                style={{ color: "var(--color-text-muted)" }}
              >
                {d}
              </div>
            ))}
          </div>

          {/* Days grid */}
          <div className="grid grid-cols-7 gap-1.5">
            {dates.map((date) => {
              const isDone = completedDates.has(date.dateString);
              const day = date.dateString.slice(8);

              return (
                <button
                  onClick={() => {
                    if (!habit?.id) return;
                    mutate({
                      habitId: habit.id,
                      date: date.dateString,
                      isDone,
                    });
                  }}
                  key={date.dateString}
                  className="group relative aspect-square overflow-hidden rounded-md after:absolute after:inset-0 after:bg-black/0 after:transition-colors hover:after:bg-black/30"
                  style={{
                    background: isDone
                      ? "var(--color-primary)"
                      : "var(--color-surface-muted)",
                    border: "1px solid var(--color-border)",
                  }}
                >
                  <span className="transition-opacity group-hover:opacity-0">
                    {day.startsWith("0") ? day.slice(1) : day}
                  </span>

                  <span className="absolute inset-0 z-10 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
                    {isDone ? (
                      <span className="text-danger">
                        Отменить <br /> {date.dateString}
                      </span>
                    ) : (
                      <span className="text-success">
                        Отметить <br /> {date.dateString}
                      </span>
                    )}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-2 mt-3">
            <div
              className="w-3 h-3 rounded-sm"
              style={{
                background: "var(--color-surface-muted)",
                border: "1px solid var(--color-border)",
              }}
            />
            <span
              className="text-xs"
              style={{ color: "var(--color-text-muted)" }}
            >
              Не выполнено
            </span>
            <div
              className="w-3 h-3 rounded-sm ml-2"
              style={{ background: "var(--color-primary)" }}
            />
            <span
              className="text-xs"
              style={{ color: "var(--color-text-muted)" }}
            >
              Выполнено
            </span>
          </div>
        </div>

        {/* Weekly chart */}
        <WeekStatChart habitId={habit?.id} />
      </div>
      {isEditModalOpen && (
        <EditHabitModal
          habitId={habit?.id}
          setIsEditModalOpen={setIsEditModalOpen}
        />
      )}
      {isDelModalActive && habit && (
        <HabitDeleteModal
          isDelModalActive={isDelModalActive}
          setIsDelModalActive={setIsDelModalActive}
          habitId={habit.id}
        />
      )}
    </div>
  );
}
