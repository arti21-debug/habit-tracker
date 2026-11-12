import { createClient } from "@/lib/supabase/client";
import { useState } from "react";

// хук отдаёт код ошибки, а не готовый текст: перевод делает компонент
export type ResetError = "invalid_email" | "request_failed";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function useRequestToResetPassword() {
  const [resetPasswordPage, setResetPasswordPage] = useState("unactive");
  const [isReset, setIsReset] = useState(false);
  const [resetError, setResetError] = useState<ResetError | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function resetRequest(event: React.FormEvent<HTMLFormElement>) {
    // читаем форму ДО первого await: после него event.currentTarget уже null
    const email = String(
      new FormData(event.currentTarget).get("email") ?? "",
    ).trim();

    setResetError(null);

    // 1. валидация до запроса
    if (!EMAIL_RE.test(email)) {
      setResetError("invalid_email");
      return;
    }

    // 2. запрос с блокировкой кнопки на время выполнения
    setIsPending(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/recovery/confirm`,
      });

      if (error) {
        setResetError("request_failed");
        return;
      }

      setIsReset(true);
    } catch {
      // сеть недоступна и т.п.
      setResetError("request_failed");
    } finally {
      setIsPending(false);
    }
  }

  return {
    resetPasswordPage,
    setResetPasswordPage,
    isReset,
    resetError,
    isPending,
    resetRequest,
  };
}
