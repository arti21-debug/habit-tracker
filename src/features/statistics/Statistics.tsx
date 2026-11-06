"use client";

import { useTranslations } from "next-intl";

export default function Statistics() {
  const t = useTranslations("Statistics");

  return (
    <div className="flex justify-center p-30 text-text-primary font-bold text-lg whitespace-nowrap">
      {`${t("soon")}...`}
    </div>
  );
}
