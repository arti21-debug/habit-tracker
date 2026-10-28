"use client";
import useResetPassword from "@/hooks/auth/useResetPassword";
import { Activity } from "lucide-react";
import { useState } from "react";

export default function UpdatePassword() {
  const [resetState, setResetState] = useState("idle");
  const [errResetPassword, setErrorResetPassword] = useState<null | string>(
    null,
  );
  const [newPassword, setNewPassword] = useState("");
  const [sumbitError, setSubmitError] = useState<null | string>(null);

  const { setPassword } = useResetPassword(
    setResetState,
    setErrorResetPassword,
  );

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

        <div className="w-full flex flex-col items-center">
          <h2 className="font-semibold text-[22px] pt-5 max-[1024px]:text-lg max-[1024px]:pt-4">
            С возвращением
          </h2>
          <h3 className="text-text-secondary pt-1.5 max-[1024px]:text-sm">
            Войдите, чтобы продолжить
          </h3>

          <form
            onSubmit={(e) => {
              e.preventDefault();

              try {
                if (newPassword.length < 8)
                  throw new Error(
                    "Пароль должен содержать не менее 8 символов",
                  );
                setPassword(newPassword);
              } catch (err) {
                if (err instanceof Error) {
                  setSubmitError(err.message);
                }
              }
            }}
            className="flex flex-col gap-y-4 w-full pt-5 max-[1024px]:gap-y-3.5"
          >
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-text-secondary max-[1024px]:text-xs">
                Введите новый пароль
              </label>
              <input
                onChange={(e) => setNewPassword(e.target.value)}
                type="password"
                name="password"
                className="h-9 rounded-lg border border-border p-4 transition duration-200 hover:border-border-hover max-[1024px]:h-8"
              />
            </div>

            {sumbitError && (
              <div className="flex items-center justify-center w-full text-xs p-2 rounded-lg border border-red-200 bg-red-50 text-red-600 dark:border-red-800 dark:bg-red-950/30 dark:text-red-400 max-[1024px]:text-[10px]">
                {sumbitError}
              </div>
            )}
            {resetState === "error" && (
              <div className="flex items-center justify-center w-full text-xs p-2 rounded-lg border border-red-200 bg-red-50 text-red-600 dark:border-red-800 dark:bg-red-950/30 dark:text-red-400 max-[1024px]:text-[10px]">
                {errResetPassword}
              </div>
            )}

            <button
              type="submit"
              disabled={resetState === "loading" || newPassword === ""}
              className="w-full p-2 h-10.5 mt-2 rounded-lg border border-border transition duration-200 hover:bg-surface-hover max-[1024px]:text-sm max-[1024px]:h-9.25 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {resetState === "loading" ? (
                <span className="flex items-center justify-center gap-1">
                  <span className="w-1 h-1 rounded-full bg-current animate-bounce [animation-delay:0ms]" />
                  <span className="w-1 h-1 rounded-full bg-current animate-bounce [animation-delay:150ms]" />
                  <span className="w-1 h-1 rounded-full bg-current animate-bounce [animation-delay:300ms]" />
                </span>
              ) : (
                "Сохранить"
              )}
            </button>
          </form>
        </div>
      </article>
    </main>
  );
}
