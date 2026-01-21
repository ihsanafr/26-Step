import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { Habit, HabitLog, habitsService } from "../services/habitsService";
import { formatLocalDate } from "../utils/date";

interface HabitsContextType {
  habits: Habit[];
  todayLogs: { [key: number]: HabitLog };
  loading: boolean;
  refreshHabits: () => Promise<void>;
  refreshTodayLogs: () => Promise<void>;
  updateHabit: (habit: Habit) => void;
  updateTodayLog: (habitId: number, log: HabitLog | null) => void;
}

const HabitsContext = createContext<HabitsContextType | undefined>(undefined);

export const HabitsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [todayLogs, setTodayLogs] = useState<{ [key: number]: HabitLog }>({});
  const [loading, setLoading] = useState(true);
  const [todayLogsCache, setTodayLogsCache] = useState<{ date: string; logs: { [key: number]: HabitLog } } | null>(null);

  const refreshHabits = useCallback(async () => {
    try {
      const data = await habitsService.getAll();
      setHabits(data);
    } catch (error) {
      console.error("Error loading habits:", error);
    }
  }, []);

  const refreshTodayLogs = useCallback(async () => {
    const today = formatLocalDate(new Date());
    
    // Check cache - only reload if date changed
    if (todayLogsCache && todayLogsCache.date === today) {
      setTodayLogs(todayLogsCache.logs);
      return;
    }

    try {
      const logsMap: { [key: number]: HabitLog } = {};
      
      // Batch load all today's logs in parallel
      await Promise.all(
        habits.map(async (habit) => {
          try {
            const logs = await habitsService.getLogs(habit.id, today, today);
            if (logs.length > 0 && logs[0].completed) {
              logsMap[habit.id] = logs[0];
            }
          } catch (error) {
            console.error(`Error loading logs for habit ${habit.id}:`, error);
          }
        })
      );
      
      setTodayLogs(logsMap);
      setTodayLogsCache({ date: today, logs: logsMap });
    } catch (error) {
      console.error("Error loading today logs:", error);
    }
  }, [habits, todayLogsCache]);

  const updateHabit = useCallback((habit: Habit) => {
    setHabits((prev) => prev.map((h) => (h.id === habit.id ? habit : h)));
  }, []);

  const updateTodayLog = useCallback((habitId: number, log: HabitLog | null) => {
    setTodayLogs((prev) => {
      if (log) {
        return { ...prev, [habitId]: log };
      } else {
        const newLogs = { ...prev };
        delete newLogs[habitId];
        return newLogs;
      }
    });
    
    // Update cache
    const today = formatLocalDate(new Date());
    if (todayLogsCache && todayLogsCache.date === today) {
      setTodayLogsCache((prev) => {
        if (!prev) return prev;
        const newLogs = { ...prev.logs };
        if (log) {
          newLogs[habitId] = log;
        } else {
          delete newLogs[habitId];
        }
        return { ...prev, logs: newLogs };
      });
    }
  }, [todayLogsCache]);

  // Initial load
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await refreshHabits();
      setLoading(false);
    };
    loadData();
  }, [refreshHabits]);

  // Load today logs when habits are loaded
  useEffect(() => {
    if (habits.length > 0) {
      refreshTodayLogs();
    }
  }, [habits.length, refreshTodayLogs]);

  const value: HabitsContextType = {
    habits,
    todayLogs,
    loading,
    refreshHabits,
    refreshTodayLogs,
    updateHabit,
    updateTodayLog,
  };

  return <HabitsContext.Provider value={value}>{children}</HabitsContext.Provider>;
};

export const useHabits = (): HabitsContextType => {
  const context = useContext(HabitsContext);
  if (context === undefined) {
    throw new Error("useHabits must be used within a HabitsProvider");
  }
  return context;
};
