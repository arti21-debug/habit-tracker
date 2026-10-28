"use client";
import useDashboardStats from "@/hooks/dashboard/useDashboardStats";
import DashboardHabit from "./DashboardHabit";

const activityColors: Record<number, string> = {
  0: "var(--color-surface-muted)",
  1: "#4a4580",
  2: "#6560b8",
  3: "#8b83e8",
  4: "#afa9ec",
};

export default function Dashboard() {
  const {
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
  } = useDashboardStats();

  const monthRate = getCurrentMonthCompletionRate(habitsWithCompletions);
  const activity = lastYearActivityByDays();

  return (
    <div
      className="p-6 flex flex-col gap-6"
      style={{ background: "var(--color-bg)", minHeight: "100vh" }}
    >
      {/* Greeting */}
      <div>
        <h1
          className="text-xl font-medium"
          style={{ color: "var(--color-text-primary)" }}
        >
          {user ? (
            `Привет, ${user?.user_metadata.username} 👋`
          ) : (
            <span className="inline-block w-40 h-6 rounded-md animate-pulse bg-surface-muted" />
          )}
        </h1>
        <p
          className="text-sm mt-1"
          style={{ color: "var(--color-text-muted)" }}
        >
          {`${capitalizeWeekDay}, ${date} ${month} ${year}`}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          {
            label: "Всего привычек",
            value: `${habits?.length}`,
            sub: "активных",
          },
          {
            label: "Выполнено сегодня",
            value: `${habitsCompletedToday}/${habitsToday?.length}`,
            sub: `${completedPercentToday.toFixed(0)}%`,
          },
          {
            label: "Лучший streak",
            value: `🔥 ${bestStreakOverall}`,
            sub: "дней подряд",
          },
          { label: "За месяц", value: `${monthRate}%`, sub: "выполнение" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="p-4 rounded-xl flex flex-col gap-1"
            style={{
              background: "var(--color-surface)",
              border: "1px solid var(--color-border)",
            }}
          >
            <span
              className="text-xs"
              style={{ color: "var(--color-text-muted)" }}
            >
              {stat.label}
            </span>
            <span
              className="text-2xl font-medium"
              style={{ color: "var(--color-text-primary)" }}
            >
              {habits ? (
                stat.value
              ) : (
                <span className="inline-block w-40 h-6 rounded-md animate-pulse bg-surface-muted" />
              )}
            </span>
            <span
              className="text-xs"
              style={{ color: "var(--color-text-muted)" }}
            >
              {stat.sub}
            </span>
          </div>
        ))}
      </div>

      {/* Today list */}
      <div
        className="p-5 rounded-xl flex flex-col gap-4"
        style={{
          background: "var(--color-surface)",
          border: "1px solid var(--color-border)",
        }}
      >
        <div className="flex items-center justify-between">
          <h2
            className="text-sm font-medium"
            style={{ color: "var(--color-text-primary)" }}
          >
            Сегодня
          </h2>
          <span
            className="text-xs"
            style={{ color: "var(--color-text-muted)" }}
          >
            {`${habitsCompletedToday} из ${habitsToday.length}`}
          </span>
        </div>

        <div
          className="w-full h-1.5 rounded-full overflow-hidden"
          style={{ background: "var(--color-surface-muted)" }}
        >
          <div
            className="h-full rounded-full"
            style={{
              width: `${completedPercentToday}%`,
              background: "var(--color-primary)",
            }}
          />
        </div>

        <div className="flex flex-col gap-2">
          {habitsToday?.map((habit) => (
            <DashboardHabit
              key={habit.id}
              habit={habit}
              timeZone={profile?.time_zone}
            />
          ))}
        </div>
      </div>

      {/* Activity grid */}
      <div
        className="p-5 rounded-xl flex flex-col gap-3"
        style={{
          background: "var(--color-surface)",
          border: "1px solid var(--color-border)",
        }}
      >
        <div className="flex items-center justify-between">
          <h2
            className="text-sm font-medium"
            style={{ color: "var(--color-text-primary)" }}
          >
            Активность за год
          </h2>
          <div className="flex items-center gap-1.5">
            <span
              className="text-xs"
              style={{ color: "var(--color-text-muted)" }}
            >
              меньше
            </span>
            {[0, 1, 2, 3, 4].map((level) => (
              <div
                key={level}
                className="w-2.5 h-2.5 rounded-sm"
                style={{
                  background: activityColors[level],
                  border:
                    level === 0 ? "1px solid var(--color-border)" : "none",
                }}
              />
            ))}
            <span
              className="text-xs"
              style={{ color: "var(--color-text-muted)" }}
            >
              больше
            </span>
          </div>
        </div>

        <div
          className="grid gap-1"
          style={{ gridTemplateColumns: "repeat(52, minmax(0, 1fr))" }}
        >
          {activity.map((level, i) => (
            <div
              key={i}
              className="rounded-sm"
              style={{
                aspectRatio: "1",
                background: activityColors[level] ?? activityColors[4],
                border: level === 0 ? "1px solid var(--color-border)" : "none",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
