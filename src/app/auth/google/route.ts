import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const supabase = await createClient();

  // Запрашиваем у Supabase URL для редиректа на страницу авторизации Google
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      // После авторизации Google вернёт пользователя сюда с кодом
      redirectTo: `${new URL(request.url).origin}/auth/confirm`,
    },
  });

  if (error) {
    console.error("Google OAuth error:", error);
    return NextResponse.redirect(new URL("/auth/auth-code-error", request.url));
  }

  // Перенаправляем пользователя на страницу выбора аккаунта Google
  return NextResponse.redirect(data.url);
}
