// src/features/demo/seedDemoData.ts
import { createClient } from "@/lib/supabase/client";
import { DAILY, FREQUENCIES } from "@/features/habits/constants";

const DAYS_BACK = 90; // сколько дней истории генерируем (~3 месяца)
const WEEKLY = FREQUENCIES[1].value; // "По дням недели"

// как в JS: Date.getUTCDay() даёт 0 для воскресенья
const WEEKDAY_INDEX: Record<string, number> = {
  Пн: 1,
  Вт: 2,
  Ср: 3,
  Чт: 4,
  Пт: 5,
  Сб: 6,
  Вс: 0,
};

type DemoHabitSpec = {
  key: string; // ключ имени в переводах (Demo.habits.<key>)
  icon: string;
  color: string;
  category: string; // значение как в БД (русское)
  days: string[]; // пусто = ежедневная привычка
  rate: number; // вероятность выполнить запланированный день (0..1)
  tail: number; // сколько последних запланированных дней подряд выполнено: даёт текущий streak
  doneToday: boolean; // отмечена ли сегодня
};

export const DEMO_HABITS: DemoHabitSpec[] = [
  {
    key: "meditation",
    icon: "🧘",
    color: "#8b83e8",
    category: "Здоровье",
    days: [],
    rate: 0.85,
    tail: 21,
    doneToday: true,
  },
  {
    key: "run",
    icon: "🏃",
    color: "#1D9E75",
    category: "Спорт",
    days: ["Пн", "Ср", "Пт"],
    rate: 0.8,
    tail: 4,
    doneToday: false,
  },
  {
    key: "reading",
    icon: "📚",
    color: "#EF9F27",
    category: "Образование",
    days: [],
    rate: 0.65,
    tail: 3,
    doneToday: false,
  },
  {
    key: "water",
    icon: "💧",
    color: "#378ADD",
    category: "Здоровье",
    days: [],
    rate: 0.9,
    tail: 40,
    doneToday: true,
  },
  {
    key: "gym",
    icon: "🏋️",
    color: "#D4537E",
    category: "Спорт",
    days: ["Вт", "Чт", "Сб"],
    rate: 0.6,
    tail: 0,
    doneToday: false,
  },
  {
    key: "sleep",
    icon: "😴",
    color: "#8b83e8",
    category: "Здоровье",
    days: [],
    rate: 0.45,
    tail: 0,
    doneToday: false,
  },
];

// «сегодня» в часовом поясе пользователя в формате YYYY-MM-DD (как хранится completion_date)
function todayIn(timeZone: string) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

// дата на offset дней раньше базовой + день недели.
// Считаем по календарю в UTC, чтобы не зависеть от часовых поясов и перехода на летнее время
function shiftDate(base: string, offset: number) {
  const [y, m, d] = base.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d - offset));
  return { iso: date.toISOString().slice(0, 10), weekday: date.getUTCDay() };
}

// выполнения одной привычки за DAYS_BACK дней
function buildCompletions(spec: DemoHabitSpec, habitId: string, today: string) {
  const rows: { habit_id: string; completion_date: string }[] = [];
  let scheduledSeen = 0; // сколько запланированных дней уже прошли (без сегодняшнего)

  for (let offset = 0; offset <= DAYS_BACK; offset++) {
    const { iso, weekday } = shiftDate(today, offset);

    // привычка по дням недели: незапланированные дни пропускаем
    if (
      spec.days.length &&
      !spec.days.some((d) => WEEKDAY_INDEX[d] === weekday)
    )
      continue;

    let done: boolean;
    if (offset === 0) {
      done = spec.doneToday; // сегодняшний день задаём явно
    } else {
      scheduledSeen++;
      // последние tail дней выполнены всегда (это даёт streak), остальные по вероятности
      done = scheduledSeen <= spec.tail || Math.random() < spec.rate;
    }

    if (done) rows.push({ habit_id: habitId, completion_date: iso });
  }

  return rows;
}

export async function clearDemoData() {
  const supabase = createClient();
  // выполнения удалятся каскадом (on delete cascade на habit_id).
  // RLS не даст затронуть чужие строки
  const { error } = await supabase.from("habits").delete().eq("is_demo", true);
  if (error) throw error;
}

export async function seedDemoData(params: {
  userId: string;
  timeZone: string;
  getName: (key: string) => string; // перевод названия на текущий язык
}) {
  const { userId, timeZone, getName } = params;
  const supabase = createClient();

  // 1. убираем прошлые демо-данные: повторный запуск не создаёт дубликатов
  await clearDemoData();

  const today = todayIn(timeZone);
  const createdAt = new Date(Date.now() - DAYS_BACK * 86_400_000).toISOString();

  // 2. создаём привычки; .select("id") возвращает вставленные строки с id
  const { data: habits, error: habitsError } = await supabase
    .from("habits")
    .insert(
      DEMO_HABITS.map((spec) => ({
        user_id: userId, // политика RLS на insert требует свой user_id
        name: getName(spec.key),
        description: "",
        icon: spec.icon,
        color: spec.color,
        category: spec.category,
        frequency: spec.days.length ? WEEKLY : DAILY,
        days: spec.days.length ? spec.days : null,
        is_demo: true,
        created_at: createdAt, // привычка «существует» уже 3 месяца
      })),
    )
    .select("id");

  if (habitsError) throw habitsError;
  if (!habits) throw new Error("Demo habits were not created");

  // 3. выполнения всех привычек: одним запросом (ids вернулись в порядке вставки)
  const completions = habits.flatMap((habit, i) =>
    buildCompletions(DEMO_HABITS[i], habit.id, today),
  );

  const { error: completionsError } = await supabase
    .from("habit_completions")
    .insert(completions);
  if (completionsError) throw completionsError;

  return { habits: habits.length, completions: completions.length };
}
