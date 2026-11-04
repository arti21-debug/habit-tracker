"use client";
import { CircleAlert } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

export default function AuthCodeError() {
  const router = useRouter();

  const t = useTranslations("AuthCodeError");

  return (
    <main className="flex items-center justify-center h-screen">
      <article className="flex flex-col items-center w-100 p-8 rounded-2xl bg-surface border border-border max-[1024px]:w-85">
        <div className="flex flex-col items-center gap-4 pt-8">
          <div className="relative w-12 h-12 bg-border rounded-full max-[1024px]:w-10 max-[1024px]:h-10">
            <CircleAlert
              color="#dd0e0e"
              className="absolute inset-0 m-auto max-[1024px]:w-5 max-[1024px]:h-5"
            />
          </div>
          <h1 className="font-bold text-xl max-[1024px]:text-lg">
            {t("title")}
          </h1>
          <p className="text-sm text-text-secondary max-[1024px]:text-xs">
            {t("text")}
          </p>
          <div className="flex flex-col gap-1 text-sm text-text-secondary max-[1024px]:text-xs">
            <span>{t("notReceived")}</span>
            <span>{t("spam")}</span>
          </div>
          <button
            onClick={() => router.push("/")}
            className="flex items-center justify-center gap-2 w-full p-2 rounded-lg border border-border transition duration-200 hover:bg-surface-hover max-[1024px]:text-sm"
          >
            {t("backToLogin")}
          </button>
        </div>
      </article>
    </main>
  );
}
