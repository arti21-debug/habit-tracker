"use client";
import { useHabit } from "@/app/(dashboard)/habits/context/HabitContext";
import { createHabit } from "@/lib/habits";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";

export default function useAddHabit() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    icon: "🧘",
    color: "#8b83e8",
    category: "Здоровье",
    frequency: "Ежедневно",
    days: [] as string[],
  });
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

  // состояние модалки полученное из context
  const { isModalOpen, setIsModalOpen } = useHabit();

  const queryClient = useQueryClient();

  const { mutate, isPending, isError, reset } = useMutation({
    mutationFn: createHabit, // передача функции которая создает привычку
    // вызовится после успешного завершения mutationFn
    onSuccess: () => {
      handleClose();
      // Говорим TanStack что кэш с ключом ["habits"] устарел
      // Он автоматически перезапрашивает getHabits()
      // Habits.tsx обновится сам без каких-либо действий с моей стороны
      queryClient.invalidateQueries({ queryKey: ["habits"] });
    },
  });

  // сброс состояния формы после submit
  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      icon: "🧘",
      color: "#8b83e8",
      category: "Здоровье",
      frequency: "Ежедневно",
      days: [],
    });
  };

  const handleClose = () => {
    resetForm();
    reset(); // сброс состояния с ошибкой isError из Query
    setIsModalOpen(false);
  };

  const isSubmitBtnDisabled =
    formData.name === "" ||
    (formData.frequency !== "Ежедневно" && formData.days.length < 1);

  return {
    formData,
    setFormData,
    isSelectOpen,
    setIsSelectOpen,
    isModalOpen,
    mutate,
    isPending,
    isError,
    handleClose,
    isSubmitBtnDisabled,
    dropdownRef,
  };
}
