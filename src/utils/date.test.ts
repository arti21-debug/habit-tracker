import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { addDaysIso, getToday } from "./date";

describe("getToday", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    // фиксируем «сейчас»: 12 ноября 2026, 22:30 по UTC
    vi.setSystemTime(new Date("2026-11-12T22:30:00Z"));
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it("возвращает дату в формате YYYY-MM-DD", () => {
    expect(getToday("UTC")).toBe("2026-11-12");
  });

  it("в Киеве (UTC+2) уже наступил следующий день", () => {
    expect(getToday("Europe/Kiev")).toBe("2026-11-13");
  });

  it("в Лос-Анджелесе (UTC-8) ещё тот же день", () => {
    expect(getToday("America/Los_Angeles")).toBe("2026-11-12");
  });
});

describe("addDaysIso", () => {
  it("уходит в предыдущий месяц", () => {
    expect(addDaysIso("2026-03-01", -1)).toBe("2026-02-28");
  });

  it("переходит через границу года", () => {
    expect(addDaysIso("2026-12-31", 1)).toBe("2027-01-01");
  });

  it("учитывает високосный год", () => {
    expect(addDaysIso("2028-03-01", -1)).toBe("2028-02-29");
  });

  it("-29 дней от сегодняшней даты даёт начало 30-дневного окна", () => {
    expect(addDaysIso("2026-11-12", -29)).toBe("2026-10-14");
  });
});
