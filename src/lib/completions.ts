import { createClient } from "./supabase/client";

// Отметить привычку выполненной
export async function completeHabit(habitId: string, date: string) {
  const supabase = createClient();
  const { error } = await supabase
    .from("habit_completions")
    .insert({ habit_id: habitId, completion_date: date });
  if (error) throw error;
}

// Отменить выполнение
export async function uncompleteHabit(habitId: string, date: string) {
  const supabase = createClient();
  const { error } = await supabase
    .from("habit_completions")
    .delete()
    .eq("habit_id", habitId)
    .eq("completion_date", date);
  if (error) throw error;
}

// Получить все выполнения привычки
export async function getHabitCompletions(habitId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("habit_completions")
    .select("*")
    .eq("habit_id", habitId)
    .order("completion_date", { ascending: false });
  if (error) throw error;
  return data;
}

// Получить выполнения за период
export async function getCompletionsByPeriod(
  habitId: string,
  from: string,
  to: string,
) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("habit_completions")
    .select("completion_date")
    .eq("habit_id", habitId)
    .gte("completion_date", from)
    .lte("completion_date", to)
    .order("completion_date", { ascending: true });

  if (error) throw error;
  return data;
}
