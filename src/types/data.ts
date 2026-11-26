import { Tables } from "./database";

export interface UserData {
  username: string;
  email: string;
}

// Только те поля, которые выбирает fetchHabits
export type Completion = Pick<
  Tables<"habit_completions">,
  "completion_date" | "completed_at"
>;

export type EditHabitFormData = Required<Habit> & { id: string };

export interface EditHabit {
  id?: string;
  name?: string;
  description?: string;
  icon?: string;
  color?: string;
  category?: string;
  frequency?: string;
  days?: string[];
}

export type HabitFormData = Required<Habit>;

export interface Habit {
  name: string;
  description: string;
  icon: string;
  color: string;
  category: string;
  frequency: string;
  days?: string[];
}

export interface HabitWithCompletions extends ServerHabit {
  completions: Completion[];
}

export interface ServerHabit extends Habit {
  id: string;
  user_id: string;
  created_at: string | null;
  is_archived: boolean;
}
