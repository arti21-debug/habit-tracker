import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  // Базовый ответ — пропускаем запрос дальше без изменений
  let supabaseResponse = NextResponse.next({
    request,
  });

  // Создаём новый клиент на каждый запрос — нельзя хранить в глобальной переменной
  // при Fluid compute, иначе клиент будет shared между запросами
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        // Читаем куки из входящего запроса
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet, headers) {
          // Сначала обновляем куки в объекте запроса
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          // Пересоздаём ответ с обновлённым запросом, чтобы куки попали в следующий handler
          supabaseResponse = NextResponse.next({
            request,
          });
          // Записываем куки в ответ — браузер их сохранит
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
          // Переносим служебные заголовки от Supabase в ответ
          Object.entries(headers).forEach(([key, value]) =>
            supabaseResponse.headers.set(key, value),
          );
        },
      },
    },
  );

  // Получаем claims сессии — обязательно сразу после createServerClient,
  // любой код между ними может привести к случайным разлогинам пользователей
  const { data } = await supabase.auth.getClaims();

  // Извлекаем данные пользователя из claims
  const user = data?.claims;

  // Неавторизованный пользователь не может попасть в /dashboard — редиректим на главную
  if (!user && request.nextUrl.pathname.startsWith("/dashboard")) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  // Возвращаем supabaseResponse как есть — менять его нельзя без переноса кук,
  // иначе браузер и сервер рассинхронизируются и сессия оборвётся
  return supabaseResponse;
}
