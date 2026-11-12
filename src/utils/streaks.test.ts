import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { Completion } from "@/types/data";
import getBestHabitStreak from "./getBestHabitStreak";
import getCurrentHabitStreak from "./getCurrentHabitSreak";

const c = (completion_date: string) => ({ completion_date }) as Completion;

describe("getCurrentHabitStreak", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-11-12T12:00:00Z")); // «сегодня» = 2026-11-12
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  // массивы по контракту функции идут от новых дат к старым
  it("пустой список даёт 0", () => {
    expect(getCurrentHabitStreak([], "UTC")).toBe(0);
  });

  it("считает подряд идущие дни, включая сегодня", () => {
    const list = [c("2026-11-12"), c("2026-11-11"), c("2026-11-10")];
    expect(getCurrentHabitStreak(list, "UTC")).toBe(3);
  });

  it("серия не обрывается, если сегодня ещё не отмечено, но вчера было", () => {
    const list = [c("2026-11-11"), c("2026-11-10")];
    expect(getCurrentHabitStreak(list, "UTC")).toBe(2);
  });

  it("если последнее выполнение раньше вчерашнего, серии нет", () => {
    const list = [c("2026-11-10"), c("2026-11-09")];
    expect(getCurrentHabitStreak(list, "UTC")).toBe(0);
  });

  it("пропущенный день обрывает серию", () => {
    const list = [c("2026-11-12"), c("2026-11-10")];
    expect(getCurrentHabitStreak(list, "UTC")).toBe(1);
  });
});

describe("getBestHabitStreak", () => {
  it("пустой список даёт 0", () => {
    expect(getBestHabitStreak([])).toBe(0);
  });

  it("одна непрерывная серия", () => {
    const list = [c("2026-11-12"), c("2026-11-11"), c("2026-11-10")];
    expect(getBestHabitStreak(list)).toBe(3);
  });

  it("выбирает самую длинную из нескольких серий", () => {
    const list = [
      c("2026-11-12"),
      c("2026-11-11"), // серия 2
      c("2026-11-08"),
      c("2026-11-07"),
      c("2026-11-06"), // серия 3
    ];
    expect(getBestHabitStreak(list)).toBe(3);
  });

  it("если все дни разорваны, лучшая серия равна 1", () => {
    const list = [c("2026-11-10"), c("2026-11-08"), c("2026-11-06")];
    expect(getBestHabitStreak(list)).toBe(1);
  });
});
