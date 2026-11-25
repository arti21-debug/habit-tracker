import { Completion, EditHabit, Habit, HabitWithCompletions, ServerHabit } from "@/types/data";
import { createClient } from "./supabase/client";
import { SupabaseClient } from "@supabase/supabase-js";

/**
 * Получает привычки пользователя вместе с историей выполнений.
 *
 * @param supabase - Клиент Supabase для выполнения запроса.
 * @returns Привычки с completions, отсортированными от новых к старым.
 * @throws Ошибка Supabase, если запрос не выполнен.
 */

// получение привычек
export async function fetchHabits(supabase: SupabaseClient,): Promise<HabitWithCompletions[]> {
  const { data, error } = await supabase
    .from("habits")
    .select("*, completions:habit_completions(completion_date, completed_at)");
  if (error) throw error;
  
  return data.map((habit) => ({
    ...habit,
    // от новых к старым: так ожидают getCurrentHabitStreak и подсчёты
    completions: [...habit.completions].sort((a: Completion, b: Completion) =>
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
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase.from("habits").insert({
    ...habitData,
    user_id: user?.id,
  });
  if (error) throw error;
}

// получение привычки
export async function getHabitById(
  id: string | undefined,
): Promise<ServerHabit> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("habits")
    .select("*")
    .eq("id", id) // сравнение - equals
    .maybeSingle();

  if (error) throw error;
  return data;
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

  const { error } = await supabase
    .from("habits")
    .update(updateHabit)
    .eq("id", updateHabit.id);
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