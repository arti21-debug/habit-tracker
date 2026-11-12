"use client";
import { getHabitById } from "@/lib/habits";
import { getHabitCompletions } from "@/lib/completions";
import { getUser, getUserTimezone } from "@/lib/profiles";
import { ServerHabit } from "@/types/data";
import { useQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";
import useToggleCompletion from "./useToggleCompletion";
import { getToday, monthName } from "@/utils/date";

export default function useHabitDetail(id: string) {
  // получение юзера
  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: getUser,
  });

  // получение привычки
  const { data: habit, isLoading } = useQuery<ServerHabit>({
    queryKey: ["habits", id],
    queryFn: () => getHabitById(id),
  });

  // Отметить/отменить
  const { mutate, isPending } = useToggleCompletion();

  // Получение истории выполнений привычки
  const { data: completions } = useQuery({
    queryKey: ["completions", habit?.id, user?.id],
    queryFn: () => getHabitCompletions(habit!.id), // за счет enabled сообщаем ts что уверенны в существовании habit
    enabled: !!habit?.id && !!user?.id, // запрос не пойдет пока не прийдет habit и user
  });

  // получение часового пояса юзера
  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: getUserTimezone,
  });

  const locale = useLocale();

  const date = profile ? getToday(profile.time_zone) : undefined;

  // проверяем есть ли запись за сегодня
  const isDone = completions?.some(
    (completion) => completion.completion_date === date,
  );

  const today = new Date();
  const startDate = new Date(); // дата первой выполненной привычки внутри 3-мес промежутка

  // даты за 3-мес промежуток
  function getDates() {
    startDate.setMonth(startDate.getMonth() - 3); // запись - 3 месяца назад
    const days = Math.round(
      (Number(today) - Number(startDate)) / (1000 * 60 * 60 * 24),
    ); // количество дней в промежутке по полуночи

    // итерация по дням промежутка и реверс в нужной последовательности
    const dates = Array.from({ length: days + 1 }, (_, i) => {
      const date = new Date(startDate); // запись в date копии, для работы на каждой итерации
      date.setDate(startDate.getDate() + i); // запись date
      return {
        date,
        dateString: date.toLocaleDateString("en-CA"),
      };
    }).reverse();

    return dates;
  }

  const dates = getDates();

  // дата первого выполнения привычки (completions отсортированы от новых к старым)
  const firstIso = completions?.slice(-1)[0]?.completion_date;

  const startDay = firstIso ? Number(firstIso.slice(8)) : undefined;
  const capitalizedMonth = firstIso ? monthName(firstIso, locale) : undefined;
  const startYear = firstIso ? firstIso.slice(0, 4) : undefined;

  // месяцы и год отображаемого промежутка (dates идут от новых к старым)
  const newestIso = dates[0]?.dateString;
  const oldestIso = dates[dates.length - 1]?.dateString;

  const capitalizedMonthFrom = oldestIso ? monthName(oldestIso, locale) : "";
  const capitalizedMonthTo = newestIso ? monthName(newestIso, locale) : "";
  const yearTo = newestIso ? newestIso.slice(0, 4) : "";

  return {
    habit,
    isLoading,
    mutate,
    completions,
    date,
    isDone,
    dates,
    startDay,
    capitalizedMonth,
    startYear,
    capitalizedMonthFrom,
    capitalizedMonthTo,
    yearTo,
    startDate,
    profile,
    isPending,
  };
}
