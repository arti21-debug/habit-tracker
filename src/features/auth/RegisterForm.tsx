"use client";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import useSignUp from "@/hooks/auth/useSignUp";
import { Activity, MailCheck } from "lucide-react";
import { useTranslations } from "next-intl";
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

  const t = useTranslations("Register");
  const tErrs = useTranslations("Register.Errors");
  const tSumbit = useTranslations("Register.RegisterSubmit");

  const signUp = () => {
    setSubmitError(null);
    setErrorRegisterMsg(null);

    try {
      if (password.length < 8)
        throw new Error(tErrs("passwordMin", { min: 8 }));
      signUpNewUser(email, password, username);
    } catch (err) {
      if (err instanceof Error) {
        setSubmitError(err.message);
      }
    }
  };

  return (
    <main className="flex items-center justify-center h-screen">
      <article className="relative flex flex-col items-center w-100 p-8 rounded-2xl bg-surface border border-border max-[1024px]:w-85">
        <div className="absolute top-2 right-2 flex justify-end w-full">
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
          className={`${successRegisterEmail ? "hidden" : "w-full flex flex-col items-center"}`}
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
              signUp();
            }}
            className="flex flex-col gap-y-4 w-full pt-5 max-[1024px]:gap-y-3.5"
          >
            <div className="relative">
              <div className="flex flex-col gap-1.5">
                <label
                  className="text-sm font-medium text-text-secondary max-[1024px]:text-xs"
                  htmlFor="username"
                >
                  {t("username")}
                </label>
                <input
                  id="username"
                  onChange={(e) => setUsername(e.target.value)}
                  type="text"
                  className="h-9 rounded-lg border border-border p-4 transition duration-200 hover:border-border-hover max-[1024px]:h-8"
                />
              </div>
              <div className="flex flex-col pt-3 gap-1.5">
                <label
                  className="text-sm font-medium text-text-secondary max-[1024px]:text-xs"
                  htmlFor="email"
                >
                  {t("email")}
                </label>
                <input
                  id="email"
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  className="h-9 rounded-lg border border-border p-4 transition duration-200 hover:border-border-hover max-[1024px]:h-8"
                />
              </div>
              <div className="flex flex-col pt-3 gap-1.5">
                <label
                  className="text-sm font-medium text-text-secondary max-[1024px]:text-xs"
                  htmlFor="password"
                >
                  {t("password")}
                </label>
                <input
                  id="password"
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
                t("submit")
              )}
            </button>

            <div className="flex justify-center gap-2 text-sm max-[1024px]:text-xs">
              <p className="text-text-muted">{t("already_register")}</p>
              <button
                type="button"
                onClick={() => setActiveAuth("login")}
                className="text-primary hover:text-primary-light"
              >
                {t("log_in")}
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
              {tSumbit("check_mail")}
            </h1>
            <p className="text-sm text-text-secondary max-[1024px]:text-xs">
              {tSumbit("text")}
            </p>
            <div className="text-sm text-text-secondary max-[1024px]:text-xs">
              {successRegisterEmail}
            </div>
            <div className="text-sm text-text-secondary max-[1024px]:text-xs">
              {tSumbit("spam")}
            </div>
          </div>
        )}
      </article>
    </main>
  );
}
