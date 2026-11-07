"use client";
import { getHabitById } from "@/lib/habits";
import {
  completeHabit,
  getHabitCompletions,
  uncompleteHabit,
} from "@/lib/completions";
import { getUser, getUserTimezone } from "@/lib/profiles";
import { ServerHabit } from "@/types/data";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocale } from "next-intl";

type UpdateHabitStatus = {
  habitId: string;
  date: string;
  isDone: boolean;
};

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

  const queryClient = useQueryClient();

  // Отметить/отменить
  const { mutate, isPending } = useMutation({
    mutationFn: ({ habitId, date, isDone }: UpdateHabitStatus) =>
      isDone ? uncompleteHabit(habitId, date) : completeHabit(habitId, date),
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["completions"],
      });

      queryClient.invalidateQueries({
        queryKey: ["habits-with-completions"],
      });
    },
  });

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

  // форматирование time_zone в формат строчной даты
  const date = profile
    ? new Intl.DateTimeFormat("en-CA", {
        timeZone: profile.time_zone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(new Date())
    : undefined;

  // проверяем есть ли запись за сегодня
  const isDone = completions?.some(
    (completion) => completion.completion_date === date,
  );

  console.log(date);

  const today = new Date();
  const startDate = new Date(); // дата первой выполненной привычки внутри 3-мес промежутка

  // даты за 3-мес промежуток
  function getDates() {
    startDate.setMonth(startDate.getMonth() - 3); // запись - 3 месяца назад
    const days = Math.round(
      (Number(today) - Number(startDate)) / (1000 * 60 * 60 * 24),
    ); // количиество дней в промежутке по полуночи

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

  // переменные под отображение даты - первого выполнения привычки
  const firstTimeHabitComplete = new Date(
    completions?.slice(-1)[0]?.completion_date,
  );
  const startDay = firstTimeHabitComplete.getDate();
  const startMonth = firstTimeHabitComplete.toLocaleDateString(locale, {
    month: "long",
  });
  const capitalizedMonth = startMonth[0].toUpperCase() + startMonth.slice(1);
  const startYear = startDate.getFullYear();

  // месяца отображаемых привычек, от и до и год относительно последней
  const monthFrom = new Date(dates.slice(-1)[0]?.dateString).toLocaleDateString(
    locale,
    {
      month: "long",
    },
  );
  const monthTo = new Date(dates.slice(0)[0]?.dateString).toLocaleDateString(
    locale,
    {
      month: "long",
    },
  );

  const capitalizedMonthFrom = monthFrom[0].toUpperCase() + monthFrom.slice(1);
  const capitalizedMonthTo = monthTo[0].toUpperCase() + monthTo.slice(1);
  const yearTo = new Date(dates.slice(0)[0]?.dateString).getFullYear();

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
