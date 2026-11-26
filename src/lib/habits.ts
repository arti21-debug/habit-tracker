import { EditHabit, Habit, HabitWithCompletions, ServerHabit } from "@/types/data";
import { createClient } from "./supabase/client";
import { SupabaseClient } from "@supabase/supabase-js";
import { Database, Tables } from "@/types/database";
import { habitInputSchema } from "./schemas/habit";

// Строка из БД (поля могут быть null) -> форма, которую ждёт приложение
export function toServerHabit(row: Tables<"habits">): ServerHabit {
  return {
    ...row,
    description: row.description ?? "",
    icon: row.icon ?? "",
    color: row.color ?? "",
    category: row.category ?? "",
    frequency: row.frequency ?? "",
    days: row.days ?? undefined,
  };
}

/**
 * Получает привычки пользователя вместе с историей выполнений.
 *
 * @param supabase - Клиент Supabase для выполнения запроса.
 * @returns Привычки с completions, отсортированными от новых к старым.
 * @throws Ошибка Supabase, если запрос не выполнен.
 */

// получение привычек
export async function fetchHabits(supabase: SupabaseClient<Database>,): Promise<HabitWithCompletions[]> {
  const { data, error } = await supabase
    .from("habits")
    .select("*, completions:habit_completions(completion_date, completed_at)");
  if (error) throw error;
  
  return data.map(({ completions, ...row }) => ({
    ...toServerHabit(row),
    // от новых к старым: так ожидают getCurrentHabitStreak и подсчёты
    completions: [...completions].sort((a, b) =>
      b.completion_date.localeCompare(a.completion_date),
    ),
  }));
}

/**
 * Создаёт Supabase-клиент и передаёт его в fetchHabits.
 * Используется как queryFn для получения привычек.
 */

export const getHabits = () => fetchHabits(createClient());

// создание привычки
export async function createHabit(habitData: Habit) {
  const parsed = habitInputSchema.safeParse(habitData);
  if (!parsed.success) throw new Error(parsed.error.issues[0].message)

  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase.from("habits").insert({
    ...habitData,
    user_id: user.id,
  });
  if (error) throw error;
}

// получение привычки
export async function getHabitById(
  id: string | undefined,
): Promise<ServerHabit | null> {
  if (!id) return null;

  const supabase = createClient();

  const { data, error } = await supabase
    .from("habits")
    .select("*")
    .eq("id", id) // сравнение - equals
    .maybeSingle();

  if (error) throw error;
  return data ? toServerHabit(data) : null;
}

// удаление привычки
export async function deleteHabit(id: string) {
  const supabase = createClient();

  const { error } = await supabase.from("habits").delete().eq("id", id);
  if (error) throw error;
}

// редактирование привычки
export async function editHabitData(updateHabit: EditHabit) {
  const supabase = createClient();

  const { id, ...changes } = updateHabit;
  if (!id) throw new Error("Habit id is required");

  const parsed = habitInputSchema.partial().safeParse(changes);
  if (!parsed.success) throw new Error(parsed.error.issues[0].message);

  const { error } = await supabase
    .from("habits")
    .update(changes)
    .eq("id", id);
  if (error) throw error;
}

// статус архивированной привычки
export async function editArchiveStatus(id: string, isArchived: boolean) {
  const supabase = createClient();

  const { error } = await supabase
    .from("habits")
    .update({ is_archived: !isArchived })
    .eq("id", id);

  if (error) throw error;
}