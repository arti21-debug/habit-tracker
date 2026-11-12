"use client";
import { useHabit } from "@/app/(dashboard)/habits/context/HabitContext";
import useArchiveHabit from "@/hooks/habits/useArchiveHabit";
import { useHabitLabels } from "@/hooks/habits/useHabitLabels";
import { HabitWithCompletions, ServerHabit } from "@/types/data";
import getCurrentHabitStreak from "@/utils/getCurrentHabitSreak";
import { getLastMonthRate } from "@/utils/getLastMonthRate";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Props = {
  habit: HabitWithCompletions;
  today: string | undefined;
  timeZone: string | undefined;
  setIsEditModalOpen: (val: boolean) => void;
  setCurrHabit: (val: null | ServerHabit) => void;
  setIsDelModalActive: (val: boolean) => void;
};

const getPercentColor = (percent: string) => {
  if (Number(percent) >= 75) return "var(--color-success)";
  if (Number(percent) >= 50) return "var(--color-warning)";
  return "var(--color-danger)";
};

export default function Habit({
  habit,
  today,
  timeZone,
  setIsEditModalOpen,
  setCurrHabit,
  setIsDelModalActive,
}: Props) {
  const lastMonthRate = getLastMonthRate(habit.completions, today);

  // изменение состояния архивирования привычки
  const { mutate } = useArchiveHabit(setIsDelModalActive);

  // проверяем есть ли запись за сегодня
  const isDone = !!today && habit.completions.some((c) => c.completion_date === today);

  // состояние меню из контекста
  const { openMenuId, setOpenMenuId } = useHabit();
  const router = useRouter();

  const streak = getCurrentHabitStreak(
    habit.completions,
    timeZone ?? Intl.DateTimeFormat().resolvedOptions().timeZone,
  );

  const t = useTranslations("Habit");
  const labels = useHabitLabels();

  return (
    <Link
      href={`/habits/${habit.id}`}
      key={habit.id}
      className="p-4 rounded-xl flex flex-col gap-3"
      style={{
        background: "var(--color-surface)",
        border: "1px solid var(--color-border)",
      }}
    >
      {/* Card header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
            style={{ background: "var(--color-surface-muted)" }}
          >
            {habit.icon}
          </div>
          <div>
            <div
              className="text-sm font-medium"
              style={{ color: "var(--color-text-primary)" }}
            >
              {habit.name}
            </div>
            <div
              className="text-xs mt-0.5"
              style={{ color: "var(--color-text-muted)" }}
            >
              {labels.category(habit.category)} ·{" "}
              {labels.frequency(habit.frequency)}
            </div>
          </div>
        </div>

        <div className="relative">
          {/* Menu button */}
          <button
            onClick={(e) => {
              e.preventDefault(); // отмена деф поведения у Link при всплытии
              // если меню карточки открыто — закрыть, иначе открыть
              setOpenMenuId((prev) => (prev === habit.id ? null : habit.id));
            }}
            className="w-6 h-6 rounded-md flex items-center justify-center text-lg leading-none"
            style={{ color: "var(--color-text-muted)" }}
            aria-label="menu"
          >
            ···
          </button>

          {/* Dropdown */}
          {openMenuId === habit.id && (
            <>
              <div
                className="fixed inset-0 z-0 cursor-default"
                onMouseDown={(e) => {
                  e.preventDefault();
                  setOpenMenuId(null);
                }}
              ></div>
              <div
                className="absolute -right-4 top-5 w-40 rounded-xl overflow-hidden z-10"
                style={{
                  background: "var(--color-surface)",
                  border: "1px solid var(--color-border)",
                }}
              >
                <button
                  onClick={() => router.push(`/habits/${habit.id}`)}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-left transition-colors duration-200 hover:bg-surface-hover"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  <span>👁</span> {t("open")}
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setIsEditModalOpen(true);
                    setCurrHabit(habit);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-left transition-colors duration-200 hover:bg-surface-hover"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  <span>✏️</span> {t("edit")}
                </button>
                <div
                  style={{
                    height: "1px",
                    background: "var(--color-border)",
                  }}
                />
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setIsDelModalActive(true);
                    setCurrHabit(habit);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-left transition-colors duration-200 hover:bg-surface-hover"
                  style={{ color: "var(--color-danger)" }}
                >
                  🗑 {t("delete")}
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setOpenMenuId(null);
                    mutate({ id: habit.id, isArchived: habit.is_archived });
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-left transition-colors duration-200 hover:bg-surface-hover"
                  style={{
                    color: !habit.is_archived
                      ? "var(--color-danger)"
                      : "var(--color-warning)",
                  }}
                >
                  {habit.is_archived ? `${t("unzip")}` : `${t("archive")}`}
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2">
        <div className="flex flex-col gap-0.5">
          <span
            className="text-xs"
            style={{ color: "var(--color-text-muted)" }}
          >
            Streak
          </span>
          <span
            className="text-sm font-medium"
            style={{ color: "var(--color-text-primary)" }}
          >
            🔥 {streak}
          </span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span
            className="text-xs"
            style={{ color: "var(--color-text-muted)" }}
          >
            {t("month")}
          </span>
          <span
            className="text-sm font-medium"
            style={{ color: getPercentColor(lastMonthRate) }}
          >
            {lastMonthRate}%
          </span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span
            className="text-xs"
            style={{ color: "var(--color-text-muted)" }}
          >
            {t("today")}
          </span>
          <span
            className="text-xs font-medium"
            style={{
              color: isDone ? "var(--color-success)" : "var(--color-danger)",
            }}
          >
            {isDone ? `✓ ${t("done")}` : `✗ ${t("not_completed")}`}
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div>
        <div
          className="w-full h-1 rounded-full overflow-hidden"
          style={{ background: "var(--color-surface-muted)" }}
        >
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${lastMonthRate}%`,
              background: getPercentColor(lastMonthRate),
            }}
          />
        </div>
      </div>
    </Link>
  );
}
