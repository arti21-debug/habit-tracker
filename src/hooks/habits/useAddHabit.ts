"use client";
import { useHabit } from "@/app/(dashboard)/habits/context/HabitContext";
import { CATEGORIES, DAILY } from "@/features/habits/constants";
import { createHabit } from "@/lib/habits";
import { getUser } from "@/lib/profiles";
import { HabitFormData } from "@/types/data";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

const initialForm: HabitFormData = {
  name: "",
  description: "",
  icon: "🧘",
  color: "#8b83e8",
  category: CATEGORIES[0].value,
  frequency: DAILY,
  days: [],
};

export default function useAddHabit() {
  const [formData, setFormData] = useState<HabitFormData>(initialForm);
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

  const t = useTranslations("CreateHabit");

  // состояние модалки полученное из context
  const { isModalOpen, setIsModalOpen } = useHabit();

  const queryClient = useQueryClient();

  // получение юзера
  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: getUser,
  });

  const { mutate, isPending, isError, reset } = useMutation({
    mutationFn: createHabit, // передача функции которая создает привычку
    onSuccess: () => {
      toast.success(t("created"));
      handleClose();
      // Говорим TanStack что кэш с ключом ["habits"] устарел
      // Он автоматически перезапрашивает getHabits()
      // Habits.tsx обновится сам без каких-либо действий с моей стороны
      queryClient.invalidateQueries({ queryKey: ["habits", user?.id] });
    },
  });

  // сброс состояния формы после submit
  const resetForm = () => {
    setFormData(initialForm);
  };

  const handleClose = () => {
    resetForm();
    reset(); // сброс состояния с ошибкой isError из Query
    setIsModalOpen(false);
  };

  const isSubmitBtnDisabled =
    formData.name === "" ||
    (formData.frequency !== DAILY && (formData?.days.length ?? 0) < 1);

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
