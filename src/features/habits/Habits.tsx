"use client";
import AddHabitModal from "./AddHabitModal";
import { useHabit } from "@/app/(dashboard)/habits/context/HabitContext";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getHabits } from "@/lib/habits";
import { ServerHabit } from "@/types/data";
import { useState } from "react";

const categories = [
  "Все",
  "Здоровье",
  "Спорт",
  "Образование",
  "Продуктивность",
];
const statuses = ["Активные", "Архив"];

export default function Habits() {
  const [filterActive, setFilterActive] = useState("Все");

  // состояние модалки полученное из context
  const { setIsModalOpen } = useHabit();

  // data привычек и состояний полученных через TanStack
  const {
    data: habits,
    isLoading,
    isError,
  } = useQuery<ServerHabit[]>({
    queryKey: ["habits"], // передача кэша привычек
    queryFn: getHabits, // передача функции которая получает привычки
    staleTime: 1000 * 60 * 5, // данные считаются свежими 5 минут — запроса не будет
  });

  // фильтрация
  const filteredHabits =
    filterActive === "Все" || filterActive === "Активные"
      ? habits
      : habits?.filter((habit) => habit.category === filterActive);

  if (isLoading)
    return (
      <div className="flex items-center justify-center pt-20">
        <div className="size-12 animate-spin rounded-full border-2 border-[#2c3440] border-t-[#99aabb]" />
      </div>
    );
  if (isError)
    return (
      <div className="flex items-center justify-center pt-20">
        <span className="font-medium text-red-400">
          Ошибка загрузки привычек<br></br>Попробуйте обновить страницу.
        </span>
      </div>
    );

  return (
    <div
      className="p-6"
      style={{ background: "var(--color-bg)", minHeight: "100vh" }}
    >
      {/* Filters */}
      <div className="flex items-center justify-center gap-6 mb-6 flex-wrap">
        {categories.map((cat) => (
          <button
            onClick={() => setFilterActive(cat)}
            key={cat}
            className="px-6 py-2 rounded-full text-sm transition-colors max-[1024px]:text-xs max-[1024px]:px-3 max-[1024px]:py-1.5"
            style={{
              border: "1px solid var(--color-border)",
              color:
                filterActive === cat ? "black" : "var(--color-text-secondary)",
              background: filterActive === cat ? "white" : "transparent",
            }}
          >
            {cat}
          </button>
        ))}
        <div
          className="w-px h-8 mx-1"
          style={{ background: "var(--color-border)" }}
        />
        {statuses.map((s) => (
          <button
            onClick={() => setFilterActive(s)}
            key={s}
            className="px-6 py-2 rounded-full text-sm transition-colors max-[1024px]:text-xs max-[1024px]:px-3 max-[1024px]:py-1.5"
            style={{
              border: "1px solid var(--color-border)",
              color:
                filterActive === s ? "black" : "var(--color-text-secondary)",
              background: filterActive === s ? "white" : "transparent",
            }}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-[repeat(auto-fit,260px)] gap-4">
        {filteredHabits?.map((habit) => (
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
              {/* Menu button */}
              <button
                className="w-6 h-6 rounded-md flex items-center justify-center text-lg leading-none"
                style={{ color: "var(--color-text-muted)" }}
              >
                ···
              </button>
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
                  {/* 🔥 {habit.streak} */}
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
                  // style={{ color: getPercentColor(habit.percent) }}
                >
                  {/* {habit.percent}% */}
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
                  // style={{
                  //   color: habit.done
                  //     ? "var(--color-success)"
                  //     : "var(--color-danger)",
                  // }}
                >
                  {/* {habit.done ? "✓ Выполнена" : "✗ Нет"} */}
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
                  // style={{
                  //   width: `${habit.percent}%`,
                  //   background: getPercentColor(habit.percent),
                  // }}
                />
              </div>
            </div>
          </Link>
        ))}

        {/* Add card */}
        <button
          onClick={() => {
            setIsModalOpen(true);
            <AddHabitModal />;
          }}
          className="p-4 rounded-xl flex flex-col items-center justify-center gap-2 min-h-36 transition-colors"
          style={{
            border: "1px dashed var(--color-border-hover)",
            background: "transparent",
            color: "var(--color-text-muted)",
          }}
        >
          <span className="text-2xl">+</span>
          <span className="text-sm">Добавить привычку</span>
        </button>
      </div>
      <AddHabitModal />
    </div>
  );
}
