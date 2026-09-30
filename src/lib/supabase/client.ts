import { createBrowserClient } from "@supabase/ssr";

// Инициализирует клиент Supabase с публичными переменными окружения
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  );
}