import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";

// Точка входа middleware — делегирует всю логику в updateSession
export async function proxy(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  // Middleware запускается на всех маршрутах кроме:
  // - _next/static — статические файлы сборки
  // - _next/image  — оптимизированные изображения
  // - favicon.ico  — иконка сайта
  // - статические форматы файлов (svg, png, jpg, jpeg, gif, webp)
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
