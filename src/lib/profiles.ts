import { createClient } from "./supabase/client";

// получение юзера
export async function getUser() {
  const supabase = createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) throw authError;
  return user;
}

// обновление часового пояса
export async function updateUserTimezone(userId: string) {
  // запись часового пояса юзера
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const supabase = createClient();
  const { error } = await supabase.from("profiles").upsert(
    {
      id: userId,
      time_zone: timeZone,
    },
    { onConflict: "id" },
  );

  if (error) throw error;
}

// получение часового пояса юзера
export async function getUserTimezone() {
  const supabase = createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) throw authError;
  if (!user) throw new Error("Пользователь не авторизован");

  const { data, error } = await supabase
    .from("profiles")
    .select("time_zone")
    .eq("id", user.id)
    .single();

  if (error) throw error;
  return data;
}
