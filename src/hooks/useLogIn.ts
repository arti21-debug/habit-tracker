"use client";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const errorMessages: Record<string, string> = {
  invalid_credentials: "Неверный email или пароль",
  email_not_confirmed: "Сначала подтвердите почту",
  over_request_rate_limit: "Слишком много попыток. Попробуйте позже",
  email_address_invalid: "Введите корректный email",
};

const googleErrorMessages: Record<string, string> = {
  access_denied: "Вход через Google был отменён",
  provider_disabled: "Вход через Google сейчас недоступен",
  oauth_provider_not_supported: "Вход через Google не поддерживается",
  bad_oauth_callback: "Не удалось завершить авторизацию через Google",
  bad_oauth_state:
    "Сессия авторизации Google недействительна. Попробуйте ещё раз",
  flow_state_expired: "Сессия авторизации истекла. Попробуйте ещё раз",
  flow_state_not_found: "Сессия авторизации не найдена. Попробуйте ещё раз",
  bad_code_verifier: "Не удалось подтвердить авторизацию. Попробуйте ещё раз",
  server_error: "Ошибка сервера. Попробуйте ещё раз позже",
};

export default function useLogIn(
  setLoginState: (val: string) => void,
  setErrorLoginMsg: (val: null | string) => void,
) {
  const router = useRouter();
  const supabase = createClient();

  async function signInWithEmail(email: string, password: string) {
    setLoginState("loading");
    setErrorLoginMsg(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        // создание переменной под ошибку регистрации
        const message =
          (error?.code && errorMessages[error.code]) ??
          "Не удалось войти. Попробуйте ещё раз";

        // запись в стейт ошибки
        setErrorLoginMsg(message);
        // запись состояния регистрации
        setLoginState("error");
        return;
      }

      // успешная авторизация, переход на главную
      setLoginState("success");
      router.push("/dashboard");
    } catch (error) {
      // ошибка при проблемах с сетью
      console.error("Sign in failed:", error);
      setErrorLoginMsg("Не удалось подключиться. Попробуйте ещё раз");
      setLoginState("error");
    }
  }

  async function signInWithOAuth() {
    setLoginState("loading");
    setErrorLoginMsg(null);

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/confirm`,
        },
      });

      if (error) {
        // создание переменной под ошибку регистрации
        const message =
          (error?.code && googleErrorMessages[error.code]) ??
          "Не удалось войти. Попробуйте ещё раз";

        // запись в стейт ошибки
        setErrorLoginMsg(message);
        // запись состояния регистрации
        setLoginState("error");
        return;
      }

      // успешная авторизация
      setLoginState("success");
    } catch (error) {
      // ошибка при проблемах с сетью
      console.error("Sign in failed:", error);
      setErrorLoginMsg("Не удалось подключиться. Попробуйте ещё раз");
      setLoginState("error");
    }
  }

  return { signInWithEmail, signInWithOAuth };
}