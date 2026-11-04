import { cookies } from "next/headers";
import { getRequestConfig } from "next-intl/server";
import { locales, defaultLocale, type Locale } from "./config";

// next-intl вызывает эту функцию на каждый запрос на сервере
export default getRequestConfig(async () => {
  // читаем cookie запроса
  const store = await cookies();
  const value = store.get("locale")?.value;

  // защита: берём язык из cookie, только если он в списке поддерживаемых.
  // Иначе в messages попал бы произвольный текст из cookie
  const locale = locales.includes(value as Locale)
    ? (value as Locale)
    : defaultLocale;

  return {
    locale,
    // подгружаем файл переводов для выбранного языка
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});