"use client";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { locales } from "@/i18n/config";
import { setLocale } from "@/i18n/actions";

// как показывать языки пользователю (на родном языке)
const names = { ru: "Русский", uk: "Українська", en: "English" };

export default function LanguageSwitcher() {
  // текущий язык интерфейса (берётся из провайдера в layout)
  const locale = useLocale();
  const router = useRouter();

  return (
    <select
      value={locale}
      onChange={async (e) => {
        // 1. записываем выбранный язык в cookie (на сервере)
        await setLocale(e.target.value);
        // 2. просим Next.js заново отрисовать серверную часть:
        //    request.ts снова прочитает cookie и вернёт новые сообщения
        router.refresh(); // перерисовывает серверную часть с новым языком
      }}
    >
      {locales.map((l) => (
        <option key={l} value={l}>
          {names[l]}
        </option>
      ))}
    </select>
  );
}
