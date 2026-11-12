"use client";
import useResetPassword from "@/hooks/auth/useResetPassword";
import { Activity } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

const MIN_PASSWORD_LENGTH = 8;

export default function UpdatePassword() {
  const t = useTranslations("Login.UpdatePassword");

  const [resetState, setResetState] = useState("idle");
  const [serverError, setServerError] = useState<null | string>(null);
  const [newPassword, setNewPassword] = useState("");
  const [validationError, setValidationError] = useState<null | string>(null);

  const { setPassword } = useResetPassword(setResetState, setServerError);

  // показываем одну ошибку: сначала валидации, потом серверную
  const error =
    validationError ?? (resetState === "error" ? serverError : null);

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
            {t("title")}
          </h2>
          <p className="text-text-secondary pt-1.5 text-center max-[1024px]:text-sm">
            {t("subtitle")}
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();

              if (newPassword.length < MIN_PASSWORD_LENGTH) {
                setValidationError(t("passwordMin"));
                return;
              }

              setValidationError(null);
              setPassword(newPassword);
            }}
            className="flex flex-col gap-y-4 w-full pt-5 max-[1024px]:gap-y-3.5"
          >
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="new-password"
                className="text-sm font-medium text-text-secondary max-[1024px]:text-xs"
              >
                {t("passwordLabel")}
              </label>
              <input
                id="new-password"
                name="password"
                type="password"
                autoComplete="new-password"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  if (validationError) setValidationError(null); // ошибка уходит, как только человек начал исправлять
                }}
                className="h-9 rounded-lg border border-border p-4 transition duration-200 hover:border-border-hover max-[1024px]:h-8"
              />
            </div>

            {error && (
              <div
                role="alert"
                className="flex items-center justify-center w-full text-xs p-2 rounded-lg border border-red-200 bg-red-50 text-red-600 dark:border-red-800 dark:bg-red-950/30 dark:text-red-400 max-[1024px]:text-[10px]"
              >
                {error}
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
                t("submit")
              )}
            </button>
          </form>
        </div>
      </article>
    </main>
  );
}
