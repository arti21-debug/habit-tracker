import { createClient } from "./supabase/client";

type UpdateUserResult = {
  usernameChanged: boolean;
  emailChanged: boolean;
  passwordChanged: boolean;
};

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
    data: { session },
  } = await supabase.auth.getSession(); // читает локальную сессию, без запроса в сеть
  if (!session) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("profiles")
    .select("time_zone")
    .eq("id", session.user.id)
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

export async function updateUserData(
  username: string,
  email: string,
  password: string,
): Promise<UpdateUserResult> {
  const supabase = createClient();

  const {
    data: { user },
    error: getUserError,
  } = await supabase.auth.getUser();

  if (getUserError) throw getUserError;
  if (!user) throw new Error("Not authenticated");

  const newUsername = username.trim();
  const newEmail = email.trim();

  // собираем только те поля, которые действительно изменились
  const updates: {
    email?: string;
    password?: string;
    data?: { username: string };
  } = {};

  // если страные данные !== новые то запишем в updates
  if (newUsername !== user.user_metadata.username) {
    updates.data = { username: newUsername };
  }

  if (newEmail !== user.email) {
    updates.email = newEmail;
  }

  if (password) {
    updates.password = password; // пароль не trim-им: пробелы могут быть намеренными
  }

  const result: UpdateUserResult = {
    usernameChanged: !!updates.data,
    emailChanged: !!updates.email,
    passwordChanged: !!updates.password,
  };

  // менять нечего: запрос в Supabase не отправляем
  if (
    !result.usernameChanged &&
    !result.emailChanged &&
    !result.passwordChanged
  ) {
    return result;
  }

  // если состояния истинные, обновляем и редиректим
  const { error } = await supabase.auth.updateUser(updates, {
    emailRedirectTo: `${window.location.origin}/auth/confirm?next=/setting`,
  });

  if (error) throw error;
  return result;
}
