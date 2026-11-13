-- =====================================================================
-- habit-tracker-next: снимок схемы БД (Supabase / PostgreSQL)
-- Справочный файл: отражает структуру, политики и триггеры,
-- которые настроены в проекте. Не является набором миграций.
-- =====================================================================

-- ---------- Таблицы ----------

create table public.profiles (
  id uuid not null,
  time_zone text not null default 'UTC'::text,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  avatar_url text,
  constraint profiles_pkey PRIMARY KEY (id),
  constraint profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE
);

create table public.habits (
  id uuid not null default gen_random_uuid(),
  user_id uuid not null,
  name text not null,
  description text,
  icon text,
  color text,
  category text,
  frequency text,
  days text[],
  created_at timestamp with time zone default now(),
  is_archived boolean not null default false,
  is_demo boolean not null default false,
  constraint habits_pkey PRIMARY KEY (id),
  constraint habits_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

create table public.habit_completions (
  id uuid not null default gen_random_uuid(),
  habit_id uuid not null,
  completion_date date not null,
  completed_at timestamp with time zone not null default now(),
  created_at timestamp with time zone not null default now(),
  constraint habit_completions_pkey PRIMARY KEY (id),
  constraint habit_completions_habit_id_fkey FOREIGN KEY (habit_id) REFERENCES public.habits(id) ON DELETE CASCADE,
  constraint unique_habit_completion_per_day UNIQUE (habit_id, completion_date)
);

-- ---------- Индексы ----------
-- Первичные ключи и уникальные ограничения создаются в определениях таблиц выше.

CREATE INDEX habits_user_id_idx ON public.habits USING btree (user_id);

-- ---------- Row Level Security ----------
-- Каждый пользователь видит и меняет только свои данные.

alter table public.profiles          enable row level security;
alter table public.habits            enable row level security;
alter table public.habit_completions enable row level security;

-- ---------- Политики: habits ----------
-- Прямая проверка владельца: auth.uid() = user_id

create policy "Users can view own habits"
  on public.habits
  for select
  to public
  using ((auth.uid() = user_id));

create policy "Users can insert own habits"
  on public.habits
  for insert
  to public
  with check ((auth.uid() = user_id));

create policy "Users can update own habits"
  on public.habits
  for update
  to public
  using ((auth.uid() = user_id));

create policy "Users can delete own habits"
  on public.habits
  for delete
  to public
  using ((auth.uid() = user_id));

-- ---------- Политики: habit_completions ----------
-- Владелец проверяется через родительскую привычку:
-- чужой habit_id ничего не даст.

create policy "Users can view their own habit completions"
  on public.habit_completions
  for select
  to authenticated
  using ((EXISTS ( SELECT 1
   FROM habits
  WHERE ((habits.id = habit_completions.habit_id) AND (habits.user_id = auth.uid())))));

create policy "Users can add their own habit completions"
  on public.habit_completions
  for insert
  to authenticated
  with check ((EXISTS ( SELECT 1
   FROM habits
  WHERE ((habits.id = habit_completions.habit_id) AND (habits.user_id = auth.uid())))));

create policy "Users can delete their own habit completions"
  on public.habit_completions
  for delete
  to authenticated
  using ((EXISTS ( SELECT 1
   FROM habits
  WHERE ((habits.id = habit_completions.habit_id) AND (habits.user_id = auth.uid())))));

-- ---------- Политики: profiles ----------
-- Пользователь работает только со своей строкой: auth.uid() = id

create policy "Users can view their own profile"
  on public.profiles
  for select
  to authenticated
  using ((auth.uid() = id));

create policy "Users can create their own profile"
  on public.profiles
  for insert
  to authenticated
  with check ((auth.uid() = id));

create policy "Users can update their own profile"
  on public.profiles
  for update
  to authenticated
  using ((auth.uid() = id))
  with check ((auth.uid() = id));

-- ---------- Создание профиля при регистрации ----------

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
begin
  insert into public.profiles (id)
  values (new.id);
  return new;
end;
$function$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ---------- Storage: бакет avatars ----------
-- Бакет avatars: public = true, file_size_limit = 2097152 (2 МБ),
-- allowed_mime_types = {image/png, image/jpeg, image/webp}.
-- Чтение аватаров публично, запись/обновление/удаление — только
-- в папку с id самого пользователя: avatars/<user id>/...

create policy "Avatars are publicly readable"
  on storage.objects
  for select
  to public
  using ((bucket_id = 'avatars'::text));

create policy "Users can upload own avatar"
  on storage.objects
  for insert
  to authenticated
  with check (((bucket_id = 'avatars'::text) AND ((storage.foldername(name))[1] = (auth.uid())::text)));

create policy "Users can update own avatar"
  on storage.objects
  for update
  to authenticated
  using (((bucket_id = 'avatars'::text) AND ((storage.foldername(name))[1] = (auth.uid())::text)));

create policy "Users can delete own avatar"
  on storage.objects
  for delete
  to authenticated
  using (((bucket_id = 'avatars'::text) AND ((storage.foldername(name))[1] = (auth.uid())::text)));