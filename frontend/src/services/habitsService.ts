import api from "./api";

export interface Habit {
  id: number;
  user_id: number;
  name: string;
  description?: string;
  target_days?: number;
  current_streak: number;
  longest_streak: number;
  start_date: string;
  is_active: boolean;
  color: string;
  icon: string;
  created_at: string;
  updated_at: string;
  logs?: HabitLog[];
}

export interface HabitLog {
  id: number;
  habit_id: number;
  date: string;
  completed: boolean;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateHabitData {
  name: string;
  description?: string;
  target_days?: number;
  start_date: string;
  is_active?: boolean;
  color?: string;
  icon?: string;
}

export interface UpdateHabitData {
  name?: string;
  description?: string;
  target_days?: number;
  start_date?: string;
  is_active?: boolean;
  color?: string;
  icon?: string;
  current_streak?: number;
  longest_streak?: number;
}

export interface CreateHabitLogData {
  date: string;
  completed?: boolean;
  notes?: string;
}

export interface HabitStats {
  totalHabits: number;
  activeHabits: number;
  totalStreaks: number;
  longestStreak: number;
  completionRate: number;
  todayCompleted: number;
  todayTotal: number;
}

export const habitsService = {
  // Habit CRUD
  async getAll(): Promise<Habit[]> {
    const response = await api.get("/habits");
    return response.data;
  },

  async getById(id: number): Promise<Habit> {
    const response = await api.get(`/habits/${id}`);
    return response.data;
  },

  async create(data: CreateHabitData): Promise<Habit> {
    const response = await api.post("/habits", data);
    return response.data;
  },

  async update(id: number, data: UpdateHabitData): Promise<Habit> {
    const response = await api.put(`/habits/${id}`, data);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/habits/${id}`);
  },

  // Habit Logs
  async getLogs(habitId: number, dateFrom?: string, dateTo?: string): Promise<HabitLog[]> {
    const params = new URLSearchParams();
    if (dateFrom) params.append("date_from", dateFrom);
    if (dateTo) params.append("date_to", dateTo);
    
    const response = await api.get(`/habits/${habitId}/logs?${params.toString()}`);
    return response.data;
  },

  async createLog(habitId: number, data: CreateHabitLogData): Promise<HabitLog> {
    const response = await api.post(`/habits/${habitId}/logs`, data);
    return response.data;
  },

  async updateLog(habitId: number, logId: number, data: CreateHabitLogData): Promise<HabitLog> {
    const response = await api.put(`/habits/${habitId}/logs/${logId}`, data);
    return response.data;
  },

  async deleteLog(habitId: number, logId: number): Promise<void> {
    await api.delete(`/habits/${habitId}/logs/${logId}`);
  },

  // Helper methods
  async toggleToday(habitId: number): Promise<HabitLog> {
    const today = new Date().toISOString().split("T")[0];
    return this.createLog(habitId, { date: today, completed: true });
  },

  async getStatistics(habits: Habit[]): Promise<HabitStats> {
    const activeHabits = habits.filter((h) => h.is_active);
    const totalStreaks = activeHabits.reduce((sum, h) => sum + h.current_streak, 0);
    const longestStreak = Math.max(...activeHabits.map((h) => h.longest_streak), 0);

    return {
      totalHabits: habits.length,
      activeHabits: activeHabits.length,
      totalStreaks,
      longestStreak,
      completionRate: 0, // Will be calculated with logs
      todayCompleted: 0, // Will be calculated with logs
      todayTotal: activeHabits.length,
    };
  },
};

