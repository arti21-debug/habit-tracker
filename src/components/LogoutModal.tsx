"use client";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

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
  const queryClient = useQueryClient();
  const t = useTranslations("LogOut");

  const [isPending, setIsPending] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsExitModalActive(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [setIsExitModalActive]);

  const handleLogout = async () => {
    setIsPending(true);
    setHasError(false);

    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      // выход не удался: остаёмся на месте и говорим об этом
      console.error(error);
      setHasError(true);
      setIsPending(false);
      return;
    }

    // выход успешен: убираем данные прежнего пользователя и уходим
    queryClient.clear(); // очищаем кэш при выходе
    router.replace("/"); // replace: «Назад» не вернёт на защищённую страницу
    router.refresh(); // сбрасываем серверный кэш маршрутов
  };

  return (
    <>
      {isExitModalActive && (
        <div
          onClick={() => !isPending && setIsExitModalActive(false)}
          className="fixed inset-0 flex items-center justify-center z-10 bg-bg/50"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative flex flex-col items-center w-90 h-40 p-6 rounded-2xl bg-surface"
            role="dialog"
            aria-modal="true"
          >
            <button
              onClick={() => setIsExitModalActive(false)}
              disabled={isPending}
              className="absolute top-0 right-0 m-1"
              aria-label="close"
            >
              <X color="#d01111" />
            </button>
            <h1 className="font-semibold text-lg">{t("log_out_?")}</h1>

            {hasError && (
              <p
                role="alert"
                className="pt-3 text-xs text-red-600 dark:text-red-400"
              >
                {t("error")}
              </p>
            )}

            <div className="flex items-center gap-10 pt-6">
              <button
                onClick={() => handleLogout()}
                disabled={isPending}
                className="font-medium text-sm py-1.5 px-4 rounded-xl bg-primary transition duration-200 hover:bg-primary-light"
              >
                <span className="text-primary-lighter">{t("confirm")}</span>
              </button>
              <button
                onClick={() => setIsExitModalActive(false)}
                disabled={isPending}
                className="font-medium text-sm py-1.5 px-4 rounded-xl bg-primary transition duration-200 hover:bg-primary-light"
              >
                <span className="text-primary-lighter">{t("cancel")}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
