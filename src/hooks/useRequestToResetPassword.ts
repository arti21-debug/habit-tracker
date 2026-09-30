import { createClient } from "@/lib/supabase/client";
import { useState } from "react";

export default function useRequestToResetPassword() {
  const [resetPasswordPage, setResetPasswordPage] = useState("unactive");
  const [isReset, setIsReset] = useState(false);
  const [resetError, setResetError] = useState<null | string>(null);

  async function resetRequest(event: React.FormEvent<HTMLFormElement>) {
    try {
      const data = new FormData(event.currentTarget);
      const email = String(data.get("email"));
      const emailExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      const supabase = createClient();
      // попытка сбросить пароль через почту
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        // редирект на страницу с обновлением пароля
        redirectTo: `${window.location.origin}/auth/recovery/confirm`,
      });

      if (error) {
        console.error("RESET PASSWORD ERROR:", error);
        return;
      }

      // валидация на корректный формат почты
      if (!emailExp.test(email)) throw new Error("Введите корректный email");
      setIsReset(true);
    } catch (err) {
      if (err instanceof Error) {
        setResetError(err.message);
      }
    }
  }


  return { resetPasswordPage, setResetPasswordPage, isReset, resetError, resetRequest };
}
