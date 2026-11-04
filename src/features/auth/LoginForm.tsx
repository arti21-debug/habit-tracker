"use client";
import { useRef, useState } from "react";

import { Activity, MailCheck } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import useSignIn from "@/hooks/auth/useSignIn";
import useRequestToResetPassword from "@/hooks/auth/useRequestToResetPassword";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useTranslations } from "next-intl";

interface LoginFormProps {
  setActiveAuth: (val: string) => void;
}

export default function LoginForm({ setActiveAuth }: LoginFormProps) {
  const [loginState, setLoginState] = useState("idle");
  const [errorLoginMsg, setErrorLoginMsg] = useState<null | string>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitError, setSubmitError] = useState<null | string>(null);

  const formRef = useRef<HTMLFormElement | null>(null);

  // хук для авторизации или авторизации через гугл
  const { signInWithEmail, signInWithOAuth } = useSignIn(
    setLoginState,
    setErrorLoginMsg,
  );

  // хук для сброса пароля
  const {
    resetPasswordPage,
    setResetPasswordPage,
    isReset,
    resetError,
    resetRequest,
  } = useRequestToResetPassword();

  const t = useTranslations("Login");
  const tErrs = useTranslations("Login.Errors");
  const tReset = useTranslations("Login.ResetPassword");
  const tList = useTranslations("Login.ResetMailList");

  const signIn = () => {
    const form = formRef.current;
    if (form) {
      setSubmitError(null);
      setErrorLoginMsg(null);

      try {
        if (password.length < 8)
          throw new Error(tErrs("passwordMin", { min: 8 }));
        signInWithEmail(email, password);
      } catch (err) {
        if (err instanceof Error) {
          setSubmitError(err.message);
        }
      }
    }
  };

  return (
    <main className="flex items-center justify-center h-screen">
      <article className="flex flex-col items-center w-100 p-8 rounded-2xl bg-surface border border-border max-[1024px]:w-85">
        <div className="flex justify-end w-full">
          <LanguageSwitcher />
        </div>
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
          className={`${isReset ? "hidden" : "w-full flex flex-col items-center"}`}
        >
          <h2 className="font-semibold text-[22px] pt-5 max-[1024px]:text-lg max-[1024px]:pt-4">
            {t("title")}
          </h2>
          <h3 className="text-text-secondary pt-1.5 max-[1024px]:text-sm">
            {t("subtitle")}
          </h3>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              signIn();
            }}
            ref={formRef}
            className={`${resetPasswordPage === "active" ? "hidden" : "flex"} flex-col gap-y-4 w-full pt-5 max-[1024px]:gap-y-3.5`}
          >
            <div className="relative">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-text-secondary max-[1024px]:text-xs">
                  {t("email")}
                </label>
                <input
                  onChange={(e) => {
                    setSubmitError(null);
                    setErrorLoginMsg(null);
                    setEmail(e.target.value);
                  }}
                  type="email"
                  required
                  className="h-9 rounded-lg border border-border p-4 transition duration-200 hover:border-border-hover max-[1024px]:h-8"
                />
              </div>
              <div className="flex flex-col pt-3 gap-1.5">
                <label className="text-sm font-medium text-text-secondary max-[1024px]:text-xs">
                  {t("password")}
                </label>
                <input
                  onChange={(e) => {
                    setSubmitError(null);
                    setErrorLoginMsg(null);
                    setPassword(e.target.value);
                  }}
                  type="password"
                  className="h-9 rounded-lg border border-border p-4 transition duration-200 hover:border-border-hover max-[1024px]:h-8"
                />
              </div>
              <div className="flex justify-center">
                {submitError && (
                  <div className="absolute pt-2 text-xs text-red-600 dark:text-red-400 max-[1024px]:text-[10px]">
                    {submitError}
                  </div>
                )}
                {loginState === "error" && (
                  <div className="absolute pt-2 text-xs text-red-600 dark:text-red-400 max-[1024px]:text-[10px]">
                    {errorLoginMsg}
                  </div>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={
                loginState === "loading" || email === "" || password === ""
              }
              className="w-full p-2 h-10.5 mt-3 rounded-lg border border-border transition duration-200 hover:bg-surface-hover max-[1024px]:text-sm max-[1024px]:h-9.25 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loginState === "loading" ? (
                <span className="flex items-center justify-center gap-1">
                  <span className="w-1 h-1 rounded-full bg-current animate-bounce [animation-delay:0ms]" />
                  <span className="w-1 h-1 rounded-full bg-current animate-bounce [animation-delay:150ms]" />
                  <span className="w-1 h-1 rounded-full bg-current animate-bounce [animation-delay:300ms]" />
                </span>
              ) : (
                t("submit")
              )}
            </button>

            <div className="flex items-center gap-3">
              <span className="w-[50%] h-px border border-border"></span>
              <div className="text-sm text-text-muted">{t("or")}</div>
              <span className="w-[50%] h-px border border-border"></span>
            </div>

            <button
              onClick={() => signInWithOAuth()}
              type="button"
              disabled={loginState === "loading"}
              className="flex items-center justify-center gap-2 w-full p-2 rounded-lg border border-border transition duration-200 hover:bg-surface-hover max-[1024px]:text-sm"
            >
              <FcGoogle />
              {t("google")}
            </button>

            <div className="flex justify-between text-sm max-[1024px]:text-xs">
              <button
                type="button"
                onClick={() => setActiveAuth("register")}
                className="text-primary hover:text-primary-light"
              >
                {t("register")}
              </button>
              <button
                onClick={() => setResetPasswordPage("active")}
                type="button"
                className="text-primary hover:text-primary-light"
              >
                {t("resetPassword")}
              </button>
            </div>
          </form>

          {resetPasswordPage === "active" && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                resetRequest(e);
              }}
              className={`${isReset ? "hidden" : "flex"} flex-col gap-y-4 w-full pt-5 max-[1024px]:gap-y-3.5`}
            >
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-text-secondary max-[1024px]:text-xs">
                  {tReset("email")}
                </label>
                <input
                  type="email"
                  name="email"
                  className="h-9 rounded-lg border border-border p-4 transition duration-200 hover:border-border-hover max-[1024px]:h-8"
                />
                {resetError && (
                  <div className="text-sm font-medium max-[1024px]:text-xs text-red-600">
                    {resetError}
                  </div>
                )}
              </div>
              <button
                type="submit"
                className="w-full p-2 h-10.5 mt-2 rounded-lg border border-border transition duration-200 hover:bg-surface-hover max-[1024px]:text-sm max-[1024px]:h-9.25 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {tReset("reset")}
              </button>
              <button
                onClick={() => setResetPasswordPage("unactive")}
                type="button"
                className="w-full p-2 h-10.5 rounded-lg border border-border transition duration-200 text-red-400 hover:bg-surface-hover max-[1024px]:text-sm max-[1024px]:h-9.25 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {tReset("cancel")}
              </button>
            </form>
          )}
        </div>

        {isReset && (
          <div className="flex flex-col items-center gap-4 pt-8">
            <div className="relative w-12 h-12 bg-border rounded-full max-[1024px]:w-10 max-[1024px]:h-10">
              <MailCheck className="absolute inset-0 m-auto max-[1024px]:w-5 max-[1024px]:h-5" />
            </div>
            <h1 className="font-bold text-xl max-[1024px]:text-lg">
              {tList("check_mail")}
            </h1>
            <p className="text-sm text-text-secondary max-[1024px]:text-xs">
              {tList("text")}
            </p>
            <div className="text-sm text-text-secondary max-[1024px]:text-xs">
              {tList("spam")}
            </div>
          </div>
        )}
      </article>
    </main>
  );
}
