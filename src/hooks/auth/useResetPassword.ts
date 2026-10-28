"use client";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const errorMessages: Record<string, string> = {
  same_password: "Новый пароль должен отличаться от старого",
  weak_password: "Пароль слишком простой",
  session_not_found: "Сессия сброса пароля недействительна или истекла",
  over_request_rate_limit: "Слишком много попыток. Попробуйте позже",
};

export default function useResetPassword(
  setResetState: (val: string) => void,
  setErrorResetPassword: (val: null | string) => void,
) {
  const router = useRouter();
  const supabase = createClient();

  async function setPassword(newPassword: string) {
    setResetState("loading");
    setErrorResetPassword(null);

    try {
      // попытка обновить пароль
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        console.error(error);
        console.log(newPassword);
        const message =
          (error?.code && errorMessages[error.code]) ??
          "Не удалось сбросить пароль. Попробуйте ещё раз";

        setErrorResetPassword(message);
        setResetState("error");
        return;
      }

      // очистка куков успешного обновления пароля
      await fetch("/auth/recovery/clear", {
        method: "POST",
      });

      setResetState("success");
      router.push("/dashboard");
    } catch (error) {
      // ошибка при сетевом сбое
      setErrorResetPassword("Не удалось подключиться. Попробуйте ещё раз");
      setResetState("error");
    }
  }

  return { setPassword };
}
