"use client";
import { getHabits } from "@/lib/habits";
import { getUser, getUserTimezone } from "@/lib/profiles";
import { HabitWithCompletions } from "@/types/data";
import getBestHabitStreak from "@/utils/getBestHabitStreak";
import { useQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";

const daysMap: Record<string, number> = {
  Вс: 0,
  Пн: 1,
  Вт: 2,
  Ср: 3,
  Чт: 4,
  Пт: 5,
  Сб: 6,
};

export default function useDashboardStats() {
  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: getUser,
  });

  // получение часового пояса юзера
  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: getUserTimezone,
  });

  const { data: allHabits } = useQuery({
    queryKey: ["habits", user?.id],
    queryFn: getHabits,
  });

  const habits = allHabits?.filter((h) => !h.is_archived);

  const habitsWithCompletions = habits ?? [];
  const isActivityReady = !!habits;

  const locale = useLocale();

  // день недели
  const now = new Date();
  const weekDay = now.toLocaleDateString(locale, { weekday: "long" });
  const capitalizeWeekDay = weekDay[0].toUpperCase() + weekDay.slice(1);

  // сегодняшнее число, месяц, год
  const date = now.getDate();
  const month = now.toLocaleDateString(locale, { month: "long" });
  const year = now.getFullYear();

  const toISO = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

  // вычисляем общий процент выполнений привычек за текущий месяц
  function getCurrentMonthCompletionRate(habits: HabitWithCompletions[]) {
    const month = now.getMonth();
    const currentMonth = `${year}-${String(month + 1).padStart(2, "0")}`;

    let totalCompletions = 0; // количество выполнений за текущий месяц
    let totalEligibleDays = 0; // количество возможных выполнений привычек

    habits.forEach((habit) => {
      const eligibleDays = Array.from(
        { length: date },
        (_, i) => new Date(year, month, i + 1), // итерируем по длине текущего дня месяца, создаем даты
      ).filter((d) => {
        // проверка запланированной привычки на каждый день
        if (!habit.days || habit.days.length === 0) return true;

        // отфильтруем даты привычек когда ихнее выполнение не запланированно
        return habit.days.some((day) => daysMap[day] === d.getDay());
      });

      // суммируем подходящие даты для текущей привычки
      totalEligibleDays += eligibleDays.length;

      // оставляем только те даты у которых совпадает текущий месяц
      totalCompletions += habit.completions.filter((comp) =>
        comp.completion_date.startsWith(currentMonth),
      ).length;
    });

    // если есть хотя бы один запланированный день, вычисляем процент
    const completedPercent =
      totalEligibleDays > 0 ? (totalCompletions / totalEligibleDays) * 100 : 0;

    return completedPercent.toFixed(1);
  }

  // получаем лучшие streak каждой из привычек
  const allBestStreaks = habitsWithCompletions?.map((habit) =>
    getBestHabitStreak(habit.completions),
  );

  // находим лучшую streak
  const bestStreakOverall =
    allBestStreaks.length > 0 ? Math.max(...allBestStreaks) : 0;

  const day = new Date().getDay();
  const todayDate = toISO(new Date());

  // фильтруем привычки которые выполняются в текущий день недели
  const habitsToday = habitsWithCompletions?.filter(
    (habit) =>
      !habit.days?.length || habit.days.some((d) => daysMap[d] === day),
  );

  // находим сегодняшние привычки которые уже выполнены
  const habitsCompletedToday =
    habitsToday?.filter((habit) =>
      habit.completions.some((comp) => comp.completion_date === todayDate),
    ).length ?? 0;

  // вычислем процент выполненных привычек за сегодня
  const totalHabitsToday = habitsToday.length ?? 0;
  const completedPercentToday =
    totalHabitsToday > 0 ? (habitsCompletedToday / totalHabitsToday) * 100 : 0;

  // вычисление активности по дням за годовалый промежуток
  function lastYearActivityByDays() {
    const today = new Date();
    const yearAgo = new Date();

    // записываем дату - год назад
    yearAgo.setFullYear(yearAgo.getFullYear() - 1);

    // сбрасываем время чтобы цикл сравнивал на уровне календарных дней а не часов и минут
    today.setHours(0, 0, 0, 0);
    yearAgo.setHours(0, 0, 0, 0);

    const currDate = new Date(yearAgo); // текущая дата итерации, начинается с yearAgo

    const daysActivity: number[] = [];

    while (currDate <= today) {
      let currCompletions = 0; // счетчик выполненных привычек за текущий день
      habitsWithCompletions.forEach((comp) => {
        const habitComps = comp.completions.filter(
          (c) => c.completion_date === toISO(currDate),
        ); // у каждой привычки проходимся по completions и собираем совпавшие с текущей датой

        currCompletions += habitComps.length; // добавляем выполненные
      });

      // выполненные привычки за текущую дату пушатся в общий массив активности
      daysActivity.push(currCompletions);
      // обновляем текущую дату для следующей итерации
      currDate.setDate(currDate.getDate() + 1);
    }

    // вернем активность в обратном порядке
    return daysActivity.reverse();
  }

  return {
    user,
    profile,
    habits,
    bestStreakOverall,
    habitsToday,
    habitsCompletedToday,
    completedPercentToday,
    capitalizeWeekDay,
    date,
    month,
    year,
    habitsWithCompletions,
    getCurrentMonthCompletionRate,
    lastYearActivityByDays,
    isActivityReady,
  };
}
