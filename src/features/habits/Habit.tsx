"use client";

import { useHabit } from "@/app/(dashboard)/habits/context/HabitContext";
import useArchiveHabit from "@/hooks/useArchiveHabit";
import useHabitDetail from "@/hooks/useHabitDetail";
import useHabitStats from "@/hooks/useHabitStats";
import { ServerHabit } from "@/types/data";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Props = {
  habit: ServerHabit;
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
  setIsEditModalOpen,
  setCurrHabit,
  setIsDelModalActive,
}: Props) {
  const { streak, lastMonthRate } = useHabitStats(habit.id);
  const { completions, date } = useHabitDetail(habit.id);

  // изменение состояния архивирования привычки
  const { mutate, isPending } = useArchiveHabit(setIsDelModalActive);

  // проверяем есть ли запись за сегодня
  const isDone = completions?.some(
    (completion) => completion.completion_date === date,
  );

  // состояние меню из контекста
  const { openMenuId, setOpenMenuId } = useHabit();
  const router = useRouter();

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
              {habit.category} · {habit.frequency}
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
                  <span>👁</span> Открыть
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
                  <span>✏️</span> Редактировать
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
                  🗑 Удалить
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
                  {habit.is_archived ? "Разархивировать" : "Архивировать"}
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
            Месяц
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
            Сегодня
          </span>
          <span
            className="text-xs font-medium"
            style={{
              color: isDone ? "var(--color-success)" : "var(--color-danger)",
            }}
          >
            {isDone ? "✓ Выполнена" : "✗ Нет"}
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
