/**
 * Get emoji for mood
 */
export function getMoodEmoji(mood: string | null | undefined): string {
  const moodEmojis: Record<string, string> = {
    Happy: "😊",
    Calm: "😌",
    Grateful: "🙏",
    Excited: "🎉",
    Neutral: "😐",
    Stressed: "😰",
    Sad: "😢",
    Angry: "😠",
  };
  return moodEmojis[mood || ""] || "";
}

/**
 * Get emoji for weather
 */
export function getWeatherEmoji(weather: string | null | undefined): string {
  const weatherEmojis: Record<string, string> = {
    Sunny: "☀️",
    Cloudy: "☁️",
    Rainy: "🌧️",
    Windy: "💨",
    Stormy: "⛈️",
    Snowy: "❄️",
  };
  return weatherEmojis[weather || ""] || "";
}

/**
 * Default colors for journal cards
 */
export const JOURNAL_COLORS = [
  { name: "Blue", value: "#3B82F6", gradient: "from-blue-50 to-indigo-50 dark:from-blue-500/10 dark:to-indigo-500/10" },
  { name: "Purple", value: "#8B5CF6", gradient: "from-purple-50 to-violet-50 dark:from-purple-500/10 dark:to-violet-500/10" },
  { name: "Pink", value: "#EC4899", gradient: "from-pink-50 to-rose-50 dark:from-pink-500/10 dark:to-rose-500/10" },
  { name: "Green", value: "#10B981", gradient: "from-green-50 to-emerald-50 dark:from-green-500/10 dark:to-emerald-500/10" },
  { name: "Yellow", value: "#F59E0B", gradient: "from-yellow-50 to-amber-50 dark:from-yellow-500/10 dark:to-amber-500/10" },
  { name: "Orange", value: "#F97316", gradient: "from-orange-50 to-red-50 dark:from-orange-500/10 dark:to-red-500/10" },
  { name: "Red", value: "#EF4444", gradient: "from-red-50 to-rose-50 dark:from-red-500/10 dark:to-rose-500/10" },
  { name: "Indigo", value: "#6366F1", gradient: "from-indigo-50 to-purple-50 dark:from-indigo-500/10 dark:to-purple-500/10" },
];

/**
 * Get gradient classes for journal card based on color or mood
 */
export function getJournalCardGradient(journal: { color?: string | null; mood?: string | null }): string {
  if (journal.color) {
    const colorObj = JOURNAL_COLORS.find((c) => c.value === journal.color);
    if (colorObj) return colorObj.gradient;
  }

  // Fallback to mood-based colors
  const moodColors: Record<string, string> = {
    Happy: "from-blue-50 to-indigo-50 dark:from-blue-500/10 dark:to-indigo-500/10",
    Calm: "from-green-50 to-emerald-50 dark:from-green-500/10 dark:to-emerald-500/10",
    Grateful: "from-yellow-50 to-amber-50 dark:from-yellow-500/10 dark:to-amber-500/10",
    Excited: "from-orange-50 to-red-50 dark:from-orange-500/10 dark:to-red-500/10",
    Neutral: "from-gray-50 to-slate-50 dark:from-gray-500/10 dark:to-slate-500/10",
    Stressed: "from-red-50 to-rose-50 dark:from-red-500/10 dark:to-rose-500/10",
    Sad: "from-purple-50 to-violet-50 dark:from-purple-500/10 dark:to-violet-500/10",
    Angry: "from-red-50 to-pink-50 dark:from-red-500/10 dark:to-pink-500/10",
  };
  return moodColors[journal.mood || ""] || "from-indigo-50 to-purple-50 dark:from-indigo-500/10 dark:to-purple-500/10";
}

