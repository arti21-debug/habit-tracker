export interface Completion {
  id: string;
  habit_id: string;
  completion_date: string;
  completed_at: string;
  created_at: string;
}

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
  is_archived: boolean;
}
