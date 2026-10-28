"use client";
import { useHabit } from "@/app/(dashboard)/habits/context/HabitContext";
import useDeleteHabit from "@/hooks/habits/useDeleteHabit";
import { X } from "lucide-react";

interface Props {
  isDelModalActive: boolean;
  setIsDelModalActive: (val: boolean) => void;
  habitId: string;
}

export default function HabitDeleteModal({
  isDelModalActive,
  setIsDelModalActive,
  habitId,
}: Props) {
  // удаление привычки
  const { mutate, isPending } = useDeleteHabit(setIsDelModalActive);

  // состояние меню из контекста
  const { setOpenMenuId } = useHabit();

  return (
    <>
      {isDelModalActive && (
        <div
          onClick={() => {
            setIsDelModalActive(false);
            setOpenMenuId(null);
          }}
          className="fixed inset-0 flex items-center justify-center z-10 bg-bg/50"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative flex flex-col items-center w-90 h-40 p-6 rounded-2xl bg-surface"
          >
            {isPending ? (
              <div className="flex items-center justify-center pt-10">
                <div className="size-12 animate-spin rounded-full border-2 border-[#2c3440] border-t-[#99aabb]" />
              </div>
            ) : (
              <>
                <button
                  onClick={() => {
                    setIsDelModalActive(false);
                    setOpenMenuId(null);
                  }}
                  className="absolute top-0 right-0 m-1"
                >
                  <X color="#d01111" />
                </button>
                <h1 className="font-semibold text-lg">
                  Уверены что хотите удалить привычку?
                </h1>
                <div className="flex items-center gap-10 pt-6">
                  <button
                    onClick={() => {
                      mutate(habitId);
                    }}
                    className="font-medium text-sm py-1.5 px-4 rounded-xl bg-primary"
                  >
                    <span className="text-primary-lighter">Да</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsDelModalActive(false);
                      setOpenMenuId(null);
                    }}
                    className="font-medium text-sm py-1.5 px-4 rounded-xl bg-primary"
                  >
                    <span className="text-primary-lighter">Отмена</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
