"use client";
import useSignUp from "@/hooks/auth/useSignUp";
import { Activity, MailCheck } from "lucide-react";
import { useState } from "react";

interface RegisterFormProps {
  setActiveAuth: (val: string) => void;
}

export default function RegisterForm({ setActiveAuth }: RegisterFormProps) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitError, setSubmitError] = useState<null | string>(null);

  // хук для регистрации юзера
  const {
    registerState,
    errorRegisterMsg,
    setErrorRegisterMsg,
    successRegisterEmail,
    signUpNewUser,
  } = useSignUp();

  const signUp = () => {
    setSubmitError(null);
    setErrorRegisterMsg(null);

    try {
      if (password.length < 8)
        throw new Error("Пароль должен содержать не менее 8 символов");
      signUpNewUser(email, password, username);
    } catch (err) {
      if (err instanceof Error) {
        setSubmitError(err.message);
      }
    }
  }

  return (
    <main className="flex items-center justify-center h-screen">
      <article className="flex flex-col items-center w-100 p-8 rounded-2xl bg-surface border border-border max-[1024px]:w-85">
        <div className="flex items-center gap-3">
          <div className="relative w-8 h-8 rounded-xl bg-primary max-[1024px]:w-7 max-[1024px]:h-7">
            <Activity
              color="#fff"
              className="absolute inset-0 m-auto max-[1024px]:w-5"
            />
          </div>
          <h1 className="font-bold text-lg max-[1024px]:text-base">
            HabitFlow
          </h1>
        </div>

        <div
          className={`${successRegisterEmail ? "hidden" : "w-full flex flex-col items-center"}`}
        >
          <h2 className="font-semibold text-[22px] pt-5 max-[1024px]:text-lg max-[1024px]:pt-4">
            Приветствуем
          </h2>
          <h3 className="text-text-secondary pt-1.5 max-[1024px]:text-sm">
            Зарегистрируйтесь, чтобы начать
          </h3>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              signUp();
            }}
            className="flex flex-col gap-y-4 w-full pt-5 max-[1024px]:gap-y-3.5"
          >
            <div className="relative">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-text-secondary max-[1024px]:text-xs">
                  Имя пользователя
                </label>
                <input
                  onChange={(e) => setUsername(e.target.value)}
                  type="text"
                  className="h-9 rounded-lg border border-border p-4 transition duration-200 hover:border-border-hover max-[1024px]:h-8"
                />
              </div>
              <div className="flex flex-col pt-3 gap-1.5">
                <label className="text-sm font-medium text-text-secondary max-[1024px]:text-xs">
                  Email
                </label>
                <input
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  className="h-9 rounded-lg border border-border p-4 transition duration-200 hover:border-border-hover max-[1024px]:h-8"
                />
              </div>
              <div className="flex flex-col pt-3 gap-1.5">
                <label className="text-sm font-medium text-text-secondary max-[1024px]:text-xs">
                  Пароль
                </label>
                <input
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  className="h-9 rounded-lg border border-border p-4 transition duration-200 hover:border-border-hover max-[1024px]:h-8"
                />
              </div>
              <div className="absolute w-full pt-2">
                {submitError && (
                  <div className="flex items-center justify-center w-full p-1 text-xs rounded-lg border border-red-200 bg-red-50 text-red-600 dark:border-red-800 dark:bg-red-950/30 dark:text-red-400 max-[1024px]:p-0.5 max-[1024px]:text-[10px]">
                    {submitError}
                  </div>
                )}
                {registerState === "error" && (
                  <div className="flex items-center justify-center w-full p-1 text-xs rounded-lg border border-red-200 bg-red-50 text-red-600 dark:border-red-800 dark:bg-red-950/30 dark:text-red-400 max-[1024px]:p-0.5 max-[1024px]:text-[10px]">
                    {errorRegisterMsg}
                  </div>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={
                registerState === "loading" ||
                email === "" ||
                password === "" ||
                username === ""
              }
              className="w-full p-2 h-10.5 mt-3 rounded-lg border border-border transition duration-200 hover:bg-surface-hover max-[1024px]:text-sm max-[1024px]:h-9.25 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {registerState === "loading" ? (
                <span className="flex items-center justify-center gap-1">
                  <span className="w-1 h-1 rounded-full bg-current animate-bounce [animation-delay:0ms]" />
                  <span className="w-1 h-1 rounded-full bg-current animate-bounce [animation-delay:150ms]" />
                  <span className="w-1 h-1 rounded-full bg-current animate-bounce [animation-delay:300ms]" />
                </span>
              ) : (
                "Создать аккаунт"
              )}
            </button>

            <div className="flex justify-center gap-2 text-sm max-[1024px]:text-xs">
              <p className="text-text-muted">Уже есть аккаунт?</p>
              <button
                type="button"
                onClick={() => setActiveAuth("login")}
                className="text-primary hover:text-primary-light"
              >
                Войти
              </button>
            </div>
          </form>
        </div>

        {successRegisterEmail && (
          <div className="flex flex-col items-center gap-4 pt-8">
            <div className="relative w-12 h-12 bg-border rounded-full max-[1024px]:w-10 max-[1024px]:h-10">
              <MailCheck className="absolute inset-0 m-auto max-[1024px]:w-5 max-[1024px]:h-5" />
            </div>
            <h1 className="font-bold text-xl max-[1024px]:text-lg">
              Проверьте почту
            </h1>
            <p className="text-sm text-text-secondary max-[1024px]:text-xs">
              Мы отправили ссылку для подтверждения вашего аккаунта. Перейдите
              по ней, чтобы завершить регистрацию.
            </p>
            <div className="text-sm text-text-secondary max-[1024px]:text-xs">
              {successRegisterEmail}
            </div>
            <div className="text-sm text-text-secondary max-[1024px]:text-xs">
              Не получили письмо? Проверьте папку «Спам».
            </div>
          </div>
        )}
      </article>
    </main>
  );
}
