import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  // Код обязателен — без него восстановление невозможно
  if (!code) {
    return NextResponse.redirect(new URL("/auth/auth-code-error", origin));
  }

  const supabase = await createClient();

  // Обмениваем одноразовый код на сессию
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(new URL("/auth/auth-code-error", origin));
  }

  const response = NextResponse.redirect(
    new URL("/account/update-password", origin),
  );

  // Устанавливаем куку-флаг, чтобы страница смены пароля
  // знала что пользователь пришёл через восстановление, а не обычный вход
  response.cookies.set("password_recovery", "true", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 10, // 10 минут
  });

  return response;
}
