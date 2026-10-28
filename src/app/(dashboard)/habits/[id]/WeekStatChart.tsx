"use client";
import useChartStat from "@/hooks/habits/useChartStat";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

type Props = {
  habitId: string;
};

export default function WeekStatChart({ habitId }: Props) {
  const { weeksStat } = useChartStat(habitId);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;

    return (
      <div
        className="px-3 py-2 rounded-lg text-xs"
        style={{
          background: "var(--color-surface)",
          border: "1px solid var(--color-border)",
          color: "var(--color-text-primary)",
        }}
      >
        <p style={{ color: "var(--color-text-muted)" }}>
          Неделя {label.slice(-2)}
        </p>
        <p className="font-medium mt-0.5">{payload[0].value}% выполнено</p>
      </div>
    );
  };

  return (
    <div
      className="p-5 rounded-xl"
      style={{
        background: "var(--color-surface)",
        border: "1px solid var(--color-border)",
      }}
    >
      <h2
        className="text-sm font-medium mb-4"
        style={{ color: "var(--color-text-primary)" }}
      >
        Выполнение по неделям
      </h2>

      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={weeksStat} barCategoryGap="30%">
          <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.06)" />
          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 11, fill: "#7f7e78" }}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 11, fill: "#7f7e78" }}
            tickFormatter={(v) => `${v}%`}
            domain={[0, 100]}
            ticks={[0, 25, 50, 75, 100]}
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: "rgba(255,255,255,0.04)" }}
          />
          <Bar dataKey="percent" radius={[4, 4, 0, 0]}>
            {weeksStat.map((week) => (
              <Cell key={week.label} fill="#afa9ec" />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
