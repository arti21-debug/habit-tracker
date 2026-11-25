import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import getBestHabitStreak from "./getBestHabitStreak";
import getCurrentHabitStreak from "./getCurrentHabitSreak";

const c = (completion_date: string) => ({ completion_date });

describe("getCurrentHabitStreak", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-11-12T12:00:00Z")); // «сегодня» = 2026-11-12
  });
  afterEach(() => {
    vi.useRealTimers();
  });

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

  it("отметки из будущего серию не создают", () => {
    expect(getCurrentHabitStreak([c("2026-11-20")], "UTC")).toBe(0);
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

  it("порядок входного массива не важен", () => {
    const list = [
      c("2026-11-12"),
      c("2026-11-06"),
      c("2026-11-11"),
      c("2026-11-07"),
    ];
    expect(getBestHabitStreak(list)).toBe(2);
  });
});

describe("серии с расписанием Пн/Ср/Пт", () => {
  const MWF = ["Пн", "Ср", "Пт"];
  afterEach(() => {
    vi.useRealTimers();
  });

  it("незапланированные дни не обрывают текущую серию", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-11-12T12:00:00Z")); // четверг
    const list = [c("2026-11-11"), c("2026-11-09"), c("2026-11-06")]; // Ср, Пн, Пт
    expect(getCurrentHabitStreak(list, "UTC", MWF)).toBe(3);
  });

  it("пропуск запланированного дня обрывает серию", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-11-12T12:00:00Z"));
    const list = [c("2026-11-11"), c("2026-11-06")]; // понедельник 9-го пропущен
    expect(getCurrentHabitStreak(list, "UTC", MWF)).toBe(1);
  });

  it("пропущенная среда обрывает серию до нуля", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-11-12T12:00:00Z"));
    const list = [c("2026-11-09"), c("2026-11-06")]; // среда 11-го пропущена
    expect(getCurrentHabitStreak(list, "UTC", MWF)).toBe(0);
  });

  it("сегодняшний запланированный день ещё не отмечен: серия сохраняется", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-11-13T12:00:00Z")); // пятница
    const list = [c("2026-11-11"), c("2026-11-09")];
    expect(getCurrentHabitStreak(list, "UTC", MWF)).toBe(2);
  });

  it("отметка сегодня увеличивает серию", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-11-13T12:00:00Z"));
    const list = [c("2026-11-13"), c("2026-11-11"), c("2026-11-09")];
    expect(getCurrentHabitStreak(list, "UTC", MWF)).toBe(3);
  });

  it("лучшая серия учитывает расписание", () => {
    const list = [
      c("2026-11-04"),
      c("2026-11-06"),
      c("2026-11-09"),
      c("2026-11-11"),
    ];
    expect(getBestHabitStreak(list, MWF)).toBe(4);
  });

  it("лучшая серия разрывается пропущенным запланированным днём", () => {
    const list = [
      c("2026-11-02"),
      c("2026-11-04"),
      c("2026-11-06"),
      c("2026-11-11"),
    ];
    expect(getBestHabitStreak(list, MWF)).toBe(3); // 9 ноября пропущено
  });
});
