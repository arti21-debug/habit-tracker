import { z } from "zod";

const WEEKDAYS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"] as const;

export const habitInputSchema = z.object({
  name: z.string().trim().min(1).max(60),
  description: z.string().max(500),
  icon: z.string().max(16),
  color: z.string().max(32),
  category: z.string().max(40),
  frequency: z.string().max(40),
  days: z.array(z.enum(WEEKDAYS)).max(7).optional(),
});
