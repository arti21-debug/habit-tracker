"use client";
import AddHabitModal from "./AddHabitModal";

import useHabits from "@/hooks/habits/useHabits";
import EditHabitModal from "./EditHabitModal";
import { useState } from "react";
import { ServerHabit } from "@/types/data";
import HabitDeleteModal from "./HabitDeleteModal";
import Habit from "./Habit";
import { useTranslations } from "next-intl";

const CATEGORIES = [
  { value: "Все", key: "all" },
  { value: "Здоровье", key: "health" },
  { value: "Спорт", key: "sport" },
  { value: "Образование", key: "education" },
  { value: "Продуктивность", key: "productivity" },
] as const;

const STATUSES = [
  { value: "Активные", key: "active" },
  { value: "Архив", key: "archive" },
];

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

  const tCategories = useTranslations("Habits.Categories");
  const tErrs = useTranslations("Errors");
  const tAdd = useTranslations("HabitHeader");

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
          {tErrs("network")}
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
        {CATEGORIES.map((cat) => (
          <button
            onClick={() => setFilterActive(cat.value)}
            key={cat.value}
            className={`px-6 py-2 rounded-full text-sm transition-colors ${filterActive === cat.value ? "bg-white" : "bg-transparent"} max-[1024px]:text-xs max-[1024px]:px-3 max-[1024px]:py-1.5 duration-200 ${filterActive !== cat.value && "hover:bg-surface-hover"}`}
            style={{
              border: "1px solid var(--color-border)",
              color:
                filterActive === cat.value
                  ? "black"
                  : "var(--color-text-secondary)",
            }}
          >
            {tCategories(`${cat.key}`)}
          </button>
        ))}
        <div
          className="w-px h-8 mx-1"
          style={{ background: "var(--color-border)" }}
        />
        {STATUSES.map((s) => (
          <button
            onClick={() => setFilterActive(s.value)}
            key={s.value}
            className={`px-6 py-2 rounded-full text-sm transition-colors ${filterActive === s.value ? "bg-white" : "bg-transparent"} max-[1024px]:text-xs max-[1024px]:px-3 max-[1024px]:py-1.5 duration-200 ${filterActive !== s.value && "hover:bg-surface-hover"}`}
            style={{
              border: "1px solid var(--color-border)",
              color:
                filterActive === s.value
                  ? "black"
                  : "var(--color-text-secondary)",
            }}
          >
            {tCategories(`${s.key}`)}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-[repeat(auto-fit,280px)] justify-center gap-4">
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
          <span className="text-sm">{tAdd("add_habit")}</span>
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
