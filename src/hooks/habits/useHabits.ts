"use client";
import { useHabit } from "@/app/(dashboard)/habits/context/HabitContext";
import { getHabits } from "@/lib/habits";
import { getUser, getUserTimezone } from "@/lib/profiles";
import { HabitWithCompletions } from "@/types/data";
import { getToday } from "@/utils/date";
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

  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: getUserTimezone,
  });
  const timeZone: string | undefined = profile?.time_zone;
  const today = timeZone ? getToday(timeZone) : undefined;

  // data привычек и состояний полученных через TanStack
  const {
    data: habits,
    isLoading,
    isError,
  } = useQuery<HabitWithCompletions[]>({
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
    today,
    timeZone,
  };
}
