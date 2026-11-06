// value: что хранится в formData и в БД (не зависит от языка)
// key:   ключ перевода в messages/*.json
export const CATEGORIES = [
  { value: "Здоровье", key: "health" },
  { value: "Спорт", key: "sport" },
  { value: "Образование", key: "education" },
  { value: "Продуктивность", key: "productivity" },
] as const;

export const FREQUENCIES = [
  { value: "Ежедневно", key: "daily" },
  { value: "По дням недели", key: "weekly" },
] as const;

export const DAYS = [
  { value: "Пн", key: "mon" },
  { value: "Вт", key: "tue" },
  { value: "Ср", key: "wed" },
  { value: "Чт", key: "thu" },
  { value: "Пт", key: "fri" },
  { value: "Сб", key: "sat" },
  { value: "Вс", key: "sun" },
] as const;

export const DAILY = FREQUENCIES[0].value;
