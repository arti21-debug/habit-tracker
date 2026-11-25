import { describe, expect, it } from "vitest";
import { getScheduledDates, isScheduledOn } from "./schedule";

const MWF = ["Пн", "Ср", "Пт"];

// 2026-11-09 — понедельник
describe("isScheduledOn", () => {
  it("пустой список или null означает ежедневную привычку", () => {
    expect(isScheduledOn([], "2026-11-10")).toBe(true);
    expect(isScheduledOn(null, "2026-11-10")).toBe(true);
    expect(isScheduledOn(undefined, "2026-11-10")).toBe(true);
  });

  it("учитывает дни недели", () => {
    expect(isScheduledOn(MWF, "2026-11-09")).toBe(true); // Пн
    expect(isScheduledOn(MWF, "2026-11-10")).toBe(false); // Вт
    expect(isScheduledOn(MWF, "2026-11-13")).toBe(true); // Пт
  });

  it("воскресенье определяется верно", () => {
    expect(isScheduledOn(["Вс"], "2026-11-15")).toBe(true);
    expect(isScheduledOn(MWF, "2026-11-15")).toBe(false);
  });
});

describe("getScheduledDates", () => {
  it("возвращает только запланированные даты промежутка", () => {
    expect(getScheduledDates(MWF, "2026-11-09", "2026-11-15")).toEqual([
      "2026-11-09",
      "2026-11-11",
      "2026-11-13",
    ]);
  });

  it("у ежедневной привычки возвращает все даты промежутка", () => {
    expect(getScheduledDates([], "2026-11-09", "2026-11-11")).toEqual([
      "2026-11-09",
      "2026-11-10",
      "2026-11-11",
    ]);
  });

  it("пустой промежуток даёт пустой список", () => {
    expect(getScheduledDates(MWF, "2026-11-12", "2026-11-10")).toEqual([]);
  });
});
