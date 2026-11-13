import type { User } from "@supabase/supabase-js";

// Имя для отображения: введённое при регистрации → имя из Google → часть email до "@"
export function getDisplayName(user: User | null | undefined): string {
  if (!user) return "";
  const meta = user.user_metadata ?? {};
  return (
    meta.username ||
    meta.full_name ||
    meta.name ||
    user.email?.split("@")[0] ||
    ""
  );
}
