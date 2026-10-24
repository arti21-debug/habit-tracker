"use client";
import AddHabitModal from "./AddHabitModal";

import useHabits from "@/hooks/useHabits";
import EditHabitModal from "./EditHabitModal";
import { useState } from "react";
import { ServerHabit } from "@/types/data";
import HabitDeleteModal from "./HabitDeleteModal";
import Habit from "./Habit";

const categories = [
  "Все",
  "Здоровье",
  "Спорт",
  "Образование",
  "Продуктивность",
];
const statuses = ["Активные", "Архив"];

export default function Habits() {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currHabit, setCurrHabit] = useState<null | ServerHabit>(null);
  const [isDelModalActive, setIsDelModalActive] = useState(false);

  // получение привычек и состояний
  const {
    filterActive,
    setFilterActive,
    isModalOpen,
    setIsModalOpen,
    filteredHabits,
    isLoading,
    isError,
  } = useHabits();

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
            className={`px-6 py-2 rounded-full text-sm transition-colors ${filterActive === cat ? "bg-white" : "bg-transparent"} max-[1024px]:text-xs max-[1024px]:px-3 max-[1024px]:py-1.5 duration-200 ${filterActive !== cat && "hover:bg-surface-hover"}`}
            style={{
              border: "1px solid var(--color-border)",
              color:
                filterActive === cat ? "black" : "var(--color-text-secondary)",
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
            className={`px-6 py-2 rounded-full text-sm transition-colors ${filterActive === s ? "bg-white" : "bg-transparent"} max-[1024px]:text-xs max-[1024px]:px-3 max-[1024px]:py-1.5 duration-200 ${filterActive !== s && "hover:bg-surface-hover"}`}
            style={{
              border: "1px solid var(--color-border)",
              color:
                filterActive === s ? "black" : "var(--color-text-secondary)",
            }}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-[repeat(auto-fit,260px)] gap-4">
        {filteredHabits?.map((habit) => (
          <Habit
            key={habit.id}
            habit={habit}
            setIsEditModalOpen={setIsEditModalOpen}
            setCurrHabit={setCurrHabit}
            setIsDelModalActive={setIsDelModalActive}
          />
        ))}

        {/* Add card */}
        <button
          onClick={() => setIsModalOpen(true)}
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
      {isModalOpen && <AddHabitModal />}
      {isEditModalOpen && (
        <EditHabitModal
          habitId={currHabit?.id}
          setIsEditModalOpen={setIsEditModalOpen}
        />
      )}
      {isDelModalActive && currHabit && (
        <HabitDeleteModal
          isDelModalActive={isDelModalActive}
          setIsDelModalActive={setIsDelModalActive}
          habitId={currHabit.id}
        />
      )}
    </div>
  );
}
