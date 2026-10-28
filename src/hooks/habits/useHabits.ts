"use client";
import { useHabit } from "@/app/(dashboard)/habits/context/HabitContext";
import { getHabits } from "@/lib/habits";
import { getUser } from "@/lib/profiles";
import { ServerHabit } from "@/types/data";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export default function useHabits() {
  const [filterActive, setFilterActive] = useState("Все");

  // состояние модалки полученное из context
  const { isModalOpen, setIsModalOpen } = useHabit();

  // получение юзера
  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: getUser,
  });

  // data привычек и состояний полученных через TanStack
  const {
    data: habits,
    isLoading,
    isError,
  } = useQuery<ServerHabit[]>({
    queryKey: ["habits", user?.id], // передача кэша привычек
    queryFn: getHabits, // передача функции которая получает привычки
    staleTime: 1000 * 60 * 5, // данные считаются свежими 5 минут — запроса не будет
  });

  // фильтрация по категориям
  const filteredHabits =
    filterActive === "Все" || filterActive === "Активные"
      ? habits?.filter((habit) => !habit.is_archived)
      : filterActive === "Архив"
        ? habits?.filter((habit) => habit.is_archived)
        : habits?.filter(
            (habit) => habit.category === filterActive && !habit.is_archived,
          );

  return {
    filterActive,
    setFilterActive,
    isModalOpen,
    setIsModalOpen,
    filteredHabits,
    isLoading,
    isError,
  };
}
