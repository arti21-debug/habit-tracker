// src/i18n/actions.ts
"use server"; // функции из этого файла выполняются на сервере, но вызываются из клиента
import { cookies } from "next/headers";
import { locales } from "./config";

export async function setLocale(locale: string) {
  // не доверяем клиенту: пишем в cookie только известные языки
  if (!(locales as readonly string[]).includes(locale)) return;

  (await cookies()).set("locale", locale, {
    path: "/", // cookie действует на всём сайте
    maxAge: 60 * 60 * 24 * 365, // хранится год
    sameSite: "lax",
  });
}
