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

// загрузка аватара
export async function uploadAvatar(userId: string, file: File) {
  const supabase = createClient();

  // фиксированный путь без расширения: старый файл перезаписывается,
  // «осиротевших» файлов (avatar.png и avatar.jpg) не остаётся
  const path = `${userId}/avatar`;

  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(path, file, { upsert: true, contentType: file.type });
  if (uploadError) throw uploadError;

  const { data } = supabase.storage.from("avatars").getPublicUrl(path);

  // путь не меняется, поэтому браузер и CDN отдадут старую картинку из кэша.
  // Параметр ?v=... заставляет их загрузить новую
  const avatarUrl = `${data.publicUrl}?v=${Date.now()}`;

  const { error } = await supabase
    .from("profiles")
    .update({ avatar_url: avatarUrl, updated_at: new Date().toISOString() })
    .eq("id", userId);
  if (error) throw error;

  return avatarUrl;
}

export async function getAvatar(userId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
  .from("profiles")
  .select("avatar_url")
  .eq("id", userId)
  .single();

  if (error) throw error;
  return data.avatar_url;
}