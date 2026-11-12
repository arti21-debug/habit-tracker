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
import { useLocale, useTranslations } from "next-intl";
import { useHabitLabels } from "@/hooks/habits/useHabitLabels";

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
    isPending,
  } = useHabitDetail(id);

  const { totalCompletions, lastMonthRate } = useHabitStats(habit?.id);

  const router = useRouter();
  const locale = useLocale();

  const bestStreak = getBestHabitStreak(completions ?? []);
  const streak = getCurrentHabitStreak(completions ?? [], profile?.time_zone);

  // Set выполненных дат для быстрой проверки наличия даты
  const completedDates = new Set(
    completions?.map((comp) => comp.completion_date),
  );

  const t = useTranslations("HabitId");
  const tStats = useTranslations("HabitId.Stats");
  const labels = useHabitLabels();

  if (isLoading)
    return (
      <div className="flex items-center justify-center pt-20">
        <div className="size-12 animate-spin rounded-full border-2 border-[#2c3440] border-t-[#99aabb]" />
      </div>
    );

  if (!habit) return;

  // ---------- календарь ----------
  const todayString = date ?? dates[0].dateString; // «сегодня» для рамки

  // короткое название дня недели для подписи в ячейке
  const weekdayFormatter = new Intl.DateTimeFormat(locale, {
    weekday: "short",
    timeZone: "UTC", // даты — календарные, без привязки к поясу
  });

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
            ← {t("back")}
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
              ✏️ {t("edit")}
            </button>
            <button
              onClick={() => setIsDelModalActive(true)}
              className="text-sm px-3 py-1.5 rounded-lg transition duration-200 hover:bg-surface-hover"
              style={{
                color: "var(--color-danger)",
                border: "1px solid var(--color-danger)",
              }}
              aria-label={t("delete")}
            >
              <Trash color="#d01111" size={20} />
            </button>
          </div>
        </div>

        {/* Habit info + mark button */}
        <div className="flex items-center justify-between gap-4 max-[500px]:flex-col">
          <div className="flex items-center gap-4">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shrink-0"
              style={{ background: "var(--color-primary-lighter)" }}
            >
              {habit.icon}
            </div>
            <div>
              <h1
                className="text-xl font-medium"
                style={{ color: "var(--color-text-primary)" }}
              >
                {habit.name}
              </h1>
              <p
                className="text-sm mt-1"
                style={{ color: "var(--color-text-muted)" }}
              >
                {!startDay || !capitalizedMonth
                  ? habit.category
                  : `${labels.category(habit.category)} · ${labels.frequency(habit.frequency)} · ${t("from")} ${startDay} ${capitalizedMonth} ${startYear}`}
              </p>
            </div>
          </div>

          {/* Mark button — отдельно от шапки */}
          <button
            onClick={() => {
              if (date) {
                mutate({
                  habitId: habit.id,
                  date,
                  isDone: isDone ?? false,
                });
              }
            }}
            disabled={isPending || !date}
            className="shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium bg-primary transition duration-200 hover:bg-[#6d65dd] max-[570px]:px-3 max-[570px]:py-2 max-[570px]:text-xs"
            style={{
              color: "#fff",
              border: "1px solid transparent",
            }}
            aria-pressed={isDone}
          >
            {isDone ? (
              <div>✗ {t("done_cancel")}</div>
            ) : (
              <div>✓ {t("done_mark")}</div>
            )}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6 flex flex-col gap-6">
        {/* Stats */}
        <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-4">
          {[
            {
              label: `${tStats("CurrentStreak.label")}`,
              value: `🔥 ${streak}`,
              sub: `${tStats("CurrentStreak.sub")}`,
            },
            {
              label: `${tStats("BestStreak.label")}`,
              value: `${bestStreak}`,
              sub: `${tStats("BestStreak.sub")}`,
            },
            {
              label: `${tStats("TotalCompleted.label")}`,
              value: `${totalCompletions}`,
              sub: `${tStats("TotalCompleted.sub")}`,
            },
            {
              label: `${tStats("ForMonth.label")}`,
              value: `${lastMonthRate}%`,
              sub: `${tStats("ForMonth.sub")}`,
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
          <div className="flex justify-between gap-4">
            <h2
              className="text-sm font-medium mb-4"
              style={{ color: "var(--color-text-primary)" }}
            >
              {t("completion_schedule")}
            </h2>
            <div className="flex gap-2">
              <h2>{`${capitalizedMonthTo} — ${capitalizedMonthFrom}`}</h2>
              <h2>{yearTo}</h2>
            </div>
          </div>

          {/* Days grid */}
          <div className="grid grid-cols-7 gap-1.5">
            {dates.map(({ dateString }) => {
              const isToday = dateString === todayString;
              const isDoneDay = completedDates.has(dateString);
              const day = dateString.slice(8);

              return (
                <button
                  key={dateString}
                  onClick={() =>
                    mutate({
                      habitId: habit.id,
                      date: dateString,
                      isDone: isDoneDay,
                    })
                  }
                  className="group relative aspect-square overflow-hidden rounded-md after:absolute after:inset-0 after:bg-black/0 after:transition-colors hover:after:bg-black/30"
                  style={{
                    background: isDoneDay
                      ? "var(--color-primary)"
                      : "var(--color-surface-muted)",
                    border: "1px solid var(--color-border)",
                    outline: isToday
                      ? "2px solid var(--color-text-primary)"
                      : undefined,
                    outlineOffset: isToday ? 1 : undefined,
                  }}
                >
                  <span className="transition-opacity group-hover:opacity-0">
                    {day.startsWith("0") ? day.slice(1) : day}
                  </span>

                  <span
                    className="absolute bottom-0.5 right-1 text-[9px] transition-opacity group-hover:opacity-0"
                    style={{ color: "white" }}
                  >
                    {weekdayFormatter.format(
                      new Date(`${dateString}T00:00:00Z`),
                    )}
                  </span>

                  <span className="absolute inset-0 z-10 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
                    {isDoneDay ? (
                      <>
                        <span className="text-danger max-[700px]:text-xs max-[580px]:hidden">
                          {t("cancel")} <br /> {dateString}
                        </span>
                        <span className="hidden text-danger text-lg max-[580px]:block">
                          ✗
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="text-success max-[700px]:text-xs max-[580px]:hidden">
                          {t("mark")} <br /> {dateString}
                        </span>
                        <span className="hidden text-success text-lg max-[580px]:block">
                          ✓
                        </span>
                      </>
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
              {t("not_completed")}
            </span>
            <div
              className="w-3 h-3 rounded-sm ml-2"
              style={{ background: "var(--color-primary)" }}
            />
            <span
              className="text-xs"
              style={{ color: "var(--color-text-muted)" }}
            >
              {t("done")}
            </span>
          </div>
        </div>

        {/* Weekly chart */}
        <WeekStatChart habitId={habit.id} />
      </div>

      {isEditModalOpen && (
        <EditHabitModal
          habitId={habit.id}
          setIsEditModalOpen={setIsEditModalOpen}
        />
      )}
      {isDelModalActive && (
        <HabitDeleteModal
          isDelModalActive={isDelModalActive}
          setIsDelModalActive={setIsDelModalActive}
          habitId={habit.id}
        />
      )}
    </div>
  );
}
