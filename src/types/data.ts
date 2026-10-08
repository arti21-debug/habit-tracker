export interface Habit {
  name: string;
  description: string;
  icon: string;
  color: string;
  category: string;
  frequency: string;
  days?: string[];
}

export interface ServerHabit extends Habit {
  id: string;
  user_id: string;
  created_at: string;
}