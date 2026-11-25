import { describe, expect, it } from "vitest";
import { getLastMonthRate } from "./getLastMonthRate";
import { getScheduledDates } from "./schedule";

const c = (completion_date: string) => ({ completion_date });

describe("getLastMonthRate", () => {
  const today = "2026-11-12"; // окно: 2026-10-14 … 2026-11-12 (30 дней)

  it("без выполнений даёт 0.0", () => {
    expect(getLastMonthRate([], today)).toBe("0.0");
  });

  it("3 выполнения из 30 дней дают 10.0", () => {
    const completions = [c("2026-11-12"), c("2026-11-11"), c("2026-11-10")];
    expect(getLastMonthRate(completions, today)).toBe("10.0");
  });

  it("границы окна включительно: 14 октября считается, 13 октября нет", () => {
    const completions = [c("2026-10-14"), c("2026-10-13")];
    expect(getLastMonthRate(completions, today)).toBe("3.3"); // 1/30
  });

  it("даты из будущего не учитываются", () => {
    expect(getLastMonthRate([c("2026-11-13")], today)).toBe("0.0");
  });

  it("если сегодня ещё неизвестно (профиль не загружен), даёт 0.0", () => {
    expect(getLastMonthRate([c("2026-11-12")], undefined)).toBe("0.0");
  });

  it("привычка по дням недели при полном выполнении даёт 100%", () => {
    const MWF = ["Пн", "Ср", "Пт"];
    const done = getScheduledDates(MWF, "2026-10-14", today).map(c);
    expect(getLastMonthRate(done, today, MWF)).toBe("100.0");
  });

  it("отметка в незапланированный день не учитывается", () => {
    const MWF = ["Пн", "Ср", "Пт"];
    // 10 ноября — вторник
    expect(getLastMonthRate([c("2026-11-10")], today, MWF)).toBe("0.0");
  });
});
