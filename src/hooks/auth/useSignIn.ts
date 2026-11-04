"use client";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { updateUserTimezone } from "@/lib/profiles";
import { useTranslations } from "next-intl";

export default function useSignIn(
  setLoginState: (val: string) => void,
  setErrorLoginMsg: (val: null | string) => void,
) {
  const router = useRouter();
  const supabase = createClient();

  const tLogin = useTranslations("Login.Errors");
  const tOAuth = useTranslations("OAuth.Errors");
  const tErr = useTranslations("Errors");

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
        const code = error.code ?? "unknown";
        const message = tLogin.has(code) ? tLogin(code) : tLogin("unknown");

        // запись в стейт ошибки
        setErrorLoginMsg(message);
        // запись состояния регистрации
        setLoginState("error");
        return;
      }

      // успешная авторизация, переход на главную
      setLoginState("success");
      router.push("/dashboard");
      updateUserTimezone(data.user.id);
    } catch (error) {
      // ошибка при проблемах с сетью
      console.error("Sign in failed:", error);
      setErrorLoginMsg(tErr("network"));
      setLoginState("error");
    }
  }

  async function signInWithOAuth() {
    setLoginState("loading");
    setErrorLoginMsg(null);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/confirm`,
        },
      });

      if (error) {
        // создание переменной под ошибку регистрации
        const code = error.code ?? "unknown";
        const message = tOAuth.has(code) ? tOAuth(code) : tOAuth("unknown");

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
      setErrorLoginMsg(tErr("network"));
      setLoginState("error");
    }
  }

  return { signInWithEmail, signInWithOAuth };
}