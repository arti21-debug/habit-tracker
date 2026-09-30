import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ ok: true });

  // Обнуляем куку восстановления после того как пользователь сменил пароль
  response.cookies.set("password_recovery", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0, // Удаляем немедленно
  });

  return response;
}
