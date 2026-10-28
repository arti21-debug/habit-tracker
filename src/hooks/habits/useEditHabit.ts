"use client";
import { useHabit } from "@/app/(dashboard)/habits/context/HabitContext";
import { editHabitData, getHabitById } from "@/lib/habits";
import { getUser } from "@/lib/profiles";
import { ServerHabit } from "@/types/data";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

export default function useEditHabit(
  habitId: string | undefined,
  setIsEditModalOpen: (val: boolean) => void,
) {
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsSelectOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // состояние меню из контекста
  const { setOpenMenuId } = useHabit();

  // получение юзера
  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: getUser,
  });

  // получение привычки по id
  const {
    data: habit,
    isLoading,
    isError,
  } = useQuery<ServerHabit>({
    queryKey: ["habits", habitId],
    queryFn: () => getHabitById(habitId),
  });

  // мутация привычки
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: editHabitData,
    onError: () => {
      handleClose();
      toast.error("Не удалось добавить привычку");
    },
    onSuccess: () => {
      handleClose();
      toast.success("Привычка изменена");
      // Говорим TanStack что кэш с ключом ["habits"] устарел
      // Он автоматически перезапрашивает getHabits()
      // Habits.tsx обновится сам без каких-либо действий с моей стороны
      queryClient.invalidateQueries({ queryKey: ["habits", user?.id] });
    },
  });

  const handleClose = () => {
    setIsEditModalOpen(false);
    setOpenMenuId(null);
  };

  return {
    isSelectOpen,
    setIsSelectOpen,
    dropdownRef,
    habit,
    isLoading,
    isError,
    mutate,
    isPending,
    handleClose,
  };
}
