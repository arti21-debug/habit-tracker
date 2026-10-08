import { Habit, ServerHabit } from "@/types/data";
import { createClient } from "./supabase/client";

export async function getHabits(): Promise<ServerHabit[]> {
  const supabase = createClient();

  const { data, error } = await supabase.from("habits").select("*");
  if (error) throw error;
  return data;
}

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

export async function getHabitById(id: string): Promise<ServerHabit> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("habits")
    .select("*")
    .order("created_at", { ascending: false }) // получаем привычки от новых к старым
    .eq("id", id) // сравнение - equals
    .single();

  if (error) throw error;
  return data;
}
