"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
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
      const { error } = await supabase.auth.signUp({
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