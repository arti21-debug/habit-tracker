// src/features/habits/hooks/useHabitLabels.ts
import { useTranslations } from "next-intl";
import { CATEGORIES, FREQUENCIES, DAYS } from "@/features/habits/constants";

// обертки под значения, которые в базе лежат на русском и не поменяют локаль при смене языка
export function useHabitLabels() {
  const t = useTranslations("CreateHabit");

  return {
    category: (value: string) => {
      const key = CATEGORIES.find((c) => c.value === value)?.key;
      return key ? t(`categories.${key}`) : value;
    },
    frequency: (value: string) => {
      const key = FREQUENCIES.find((f) => f.value === value)?.key;
      return key ? t(key) : value;
    },
    day: (value: string) => {
      const key = DAYS.find((d) => d.value === value)?.key;
      return key ? t(`days.${key}`) : value;
    },
  };
}
