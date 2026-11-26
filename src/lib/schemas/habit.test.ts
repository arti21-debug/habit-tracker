import { describe, expect, it } from "vitest";
import { habitInputSchema } from "./habit";

const valid = {
  name: "Бег",
  description: "",
  icon: "🏃",
  color: "#6c63ff",
  category: "sport",
  frequency: "daily",
};

describe("habitInputSchema", () => {
  it("принимает корректные данные", () => {
    expect(habitInputSchema.safeParse(valid).success).toBe(true);
  });

  it("отклоняет пустое имя из пробелов", () => {
    expect(habitInputSchema.safeParse({ ...valid, name: "   " }).success).toBe(
      false,
    );
  });

  it("отклоняет неизвестный день недели", () => {
    expect(habitInputSchema.safeParse({ ...valid, days: ["Xx"] }).success).toBe(
      false,
    );
  });
});
