"use client";
import { createClient } from "@/lib/supabase/client";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

export default function useResetPassword(
  setResetState: (val: string) => void,
  setErrorResetPassword: (val: null | string) => void,
) {
  const router = useRouter();
  const supabase = createClient();

  const t = useTranslations("Errors");

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

        const code = error.code ?? "unknown";
        const message = t.has(code) ? t(code) : t("unknown");

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
    } catch {
      // ошибка при сетевом сбое
      setErrorResetPassword(t("network"));
      setResetState("error");
    }
  }

  return { setPassword };
}
