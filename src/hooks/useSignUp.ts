"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

const errorMessages: Record<string, string> = {
  email_exists: "Аккаунт с таким email уже существует",
  user_already_exists: "Аккаунт с таким email уже существует",
  weak_password: "Пароль не соответствует требованиям",
  email_address_invalid: "Введите корректный email",
  over_email_send_rate_limit: "Слишком много писем. Попробуйте позже",
  over_request_rate_limit: "Слишком много попыток. Попробуйте позже",
};

export default function useSignUp() {
  const [registerState, setRegisterState] = useState("idle");
  const [errorRegisterMsg, setErrorRegisterMsg] = useState<null | string>(null);
  const [successRegisterEmail, setSuccessRegisterEmail] = useState<
    null | string
  >(null);

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
        const message =
          (error?.code && errorMessages[error.code]) ??
          "Не удалось создать аккаунт. Попробуйте ещё раз";

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
      setErrorRegisterMsg("Не удалось подключиться. Попробуйте ещё раз");
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