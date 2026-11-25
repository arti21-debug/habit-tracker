import { fetchHabits } from "@/lib/habits";
import { createClient } from "@/lib/supabase/server";
import { dehydrate, QueryClient } from "@tanstack/react-query";

/**
 * Предварительно загружает данные пользователя на сервере
 * и возвращает сериализованное состояние кэша TanStack Query.
 *
 * 1. Создаёт Supabase-клиент с текущей пользовательской сессией.
 * 2. Получает userId для формирования пользовательских queryKey.
 * 3. Параллельно загружает привычки и профиль в QueryClient.
 * 4. Преобразует кэш в dehydrated state для передачи на клиент.
 *
 * Используется для SSR-гидратации через HydrationBoundary.
 */

// Загружает привычки и профиль на сервере и возвращает «замороженный» кэш TanStack Query
export async function getHabitsDehydratedState() {
  const supabase = await createClient();

  // id нужен только для ключей кэша. Сессию уже проверил layout через getUser(),
  // а доступ к данным в любом случае ограничивает RLS
  const { data } = await supabase.auth.getClaims();
  const userId = data?.claims.sub;

  const queryClient = new QueryClient();

  if (userId) {
    await Promise.all([
      queryClient.prefetchQuery({
        queryKey: ["habits", userId],
        queryFn: () => fetchHabits(supabase),
      }),
      queryClient.prefetchQuery({
        queryKey: ["profile", userId],
        queryFn: async () => {
          const { data: profile, error } = await supabase
            .from("profiles")
            .select("time_zone")
            .eq("id", userId)
            .single();
          if (error) throw error;
          return profile;
        },
      }),
    ]);
  }

  return dehydrate(queryClient);
}
