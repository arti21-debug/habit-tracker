"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { updateUserTimezone } from "@/lib/profiles";
import { useTranslations } from "next-intl";

export default function useSignUp() {
  const [registerState, setRegisterState] = useState("idle");
  const [errorRegisterMsg, setErrorRegisterMsg] = useState<null | string>(null);
  const [successRegisterEmail, setSuccessRegisterEmail] = useState<
    null | string
  >(null);

  const t = useTranslations("Register.Errors");
  const tErr = useTranslations("Errors");

  // регистрация юзера
  const supabase = createClient();
  async function signUpNewUser(email: string, password: string, username: string) {
    setRegisterState("loading");
    setErrorRegisterMsg(null);
    setSuccessRegisterEmail(null);

    try {
      // получение данных о сессии либо о ошибке
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { username },
          emailRedirectTo: `${window.location.origin}/auth/confirm`,
        },
      });

      if (error) {
        // создание переменной под ошибку регистрации
        const code = error.code ?? "unknown";
        const message = t.has(code) ? t(code) : t("unknown");

        // запись в стейт ошибки
        setErrorRegisterMsg(message);
        // запись состояния регистрации
        setRegisterState("error");
        return;
      }

      setRegisterState("success");
      setSuccessRegisterEmail(email);
      if (data.user) updateUserTimezone(data.user.id);
    } catch (error) {
      // ошибка при проблемах с сетью
      console.error("Sign up failed:", error);
      setErrorRegisterMsg(tErr("network"));
      setRegisterState("error");
    }
  }

  return {
    registerState,
    errorRegisterMsg,
    setErrorRegisterMsg,
    successRegisterEmail,
    signUpNewUser,
  };
}