import { EditHabit, Habit, ServerHabit } from "@/types/data";
import { createClient } from "./supabase/client";

// получение привычек
export async function getHabits(): Promise<ServerHabit[]> {
  const supabase = createClient();

  const { data, error } = await supabase.from("habits").select("*");
  if (error) throw error;
  return data;
}

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