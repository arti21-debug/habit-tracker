import { redirect } from "next/navigation";
import { NextResponse, type NextRequest } from "next/server";

import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);

  const code = searchParams.get("code");
  const next = searchParams.get("next");

  const supabase = await createClient();

  if (code) {
    // Обмениваем одноразовый код на полноценную сессию
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Если пользователь пришёл через восстановление пароля — отправляем на смену пароля
      if (next === "/account/update-password") {
        return NextResponse.redirect(`${origin}/account/update-password`);
      }
      // Стандартный вход — отправляем на дашборд
      redirect("/dashboard");
    }
  }

  // Код отсутствует или обмен не удался
  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
