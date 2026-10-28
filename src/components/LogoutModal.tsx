"use client";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

type Props = {
  isExitModalActive: boolean;
  setIsExitModalActive: (val: boolean) => void;
};

export default function LogOutModal({
  isExitModalActive,
  setIsExitModalActive,
}: Props) {
  const supabase = createClient();
  const router = useRouter();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error(error);
      return;
    }

    // logout успешен
    const queryClient = useQueryClient();
    queryClient.clear(); // очищаем кэш при выходе
  };

  return (
    <>
      {isExitModalActive && (
        <div
          onClick={() => setIsExitModalActive(false)}
          className="fixed inset-0 flex items-center justify-center z-10 bg-bg/50"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative flex flex-col items-center w-90 h-40 p-6 rounded-2xl bg-surface"
          >
            <button
              onClick={() => setIsExitModalActive(false)}
              className="absolute top-0 right-0 m-1"
            >
              <X color="#d01111" />
            </button>
            <h1 className="font-semibold text-lg">Выйти из учетной записи?</h1>
            <div className="flex items-center gap-10 pt-6">
              <button
                onClick={() => {
                  handleLogout();
                  router.push("/");
                }}
                className="font-medium text-sm py-1.5 px-4 rounded-xl bg-primary transition duration-200 hover:bg-primary-light"
              >
                <span className="text-primary-lighter">Да</span>
              </button>
              <button
                onClick={() => setIsExitModalActive(false)}
                className="font-medium text-sm py-1.5 px-4 rounded-xl bg-primary transition duration-200 hover:bg-primary-light"
              >
                <span className="text-primary-lighter">Отмена</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
