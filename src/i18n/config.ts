// Поддерживаемые языки. "as const" делает их точными типами ("ru" | "uk" | "en"),
// а не просто string, поэтому TypeScript поймает опечатку в названии языка
export const locales = ["ru", "uk", "en"] as const;

// Тип одного языка: "ru" | "uk" | "en"
export type Locale = (typeof locales)[number];

// Язык по умолчанию: когда cookie ещё нет (первый визит) или в ней мусор
export const defaultLocale: Locale = "ru";
