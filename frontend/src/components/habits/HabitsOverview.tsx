import { Habit, HabitLog } from "../../services/habitsService";
import { TargetIcon, CheckCircleIcon, BoltIcon, ShootingStarIcon } from "../../icons";

interface HabitsOverviewProps {
  habits: Habit[];
  todayLogs: { [key: number]: HabitLog };
}

const HabitsOverview: React.FC<HabitsOverviewProps> = ({ habits, todayLogs }) => {
  const activeHabits = habits.filter((h) => h.is_active);
  const todayCompleted = Object.keys(todayLogs).length;
  const todayTotal = activeHabits.length;
  const completionRate = todayTotal > 0 ? Math.round((todayCompleted / todayTotal) * 100) : 0;
  
  const totalStreaks = activeHabits.reduce((sum, h) => sum + h.current_streak, 0);
  const longestStreak = Math.max(...activeHabits.map((h) => h.longest_streak), 0);
  const averageStreak = activeHabits.length > 0 ? Math.round(totalStreaks / activeHabits.length) : 0;

  const stats = [
    {
      label: "Active Habits",
      value: activeHabits.length,
      icon: TargetIcon,
      gradientFrom: "from-blue-50",
      gradientTo: "to-blue-100",
      borderColor: "border-blue-200 dark:border-gray-700",
      iconBg: "bg-blue-100 dark:bg-blue-500/20",
      iconColor: "text-blue-600 dark:text-blue-400",
      darkGradientFrom: "dark:from-blue-500/10",
      darkGradientTo: "dark:to-blue-500/5",
    },
    {
      label: "Today's Progress",
      value: `${todayCompleted}/${todayTotal}`,
      icon: CheckCircleIcon,
      gradientFrom: "from-green-50",
      gradientTo: "to-green-100",
      borderColor: "border-green-200 dark:border-gray-700",
      iconBg: "bg-green-100 dark:bg-green-500/20",
      iconColor: "text-green-600 dark:text-green-400",
      darkGradientFrom: "dark:from-green-500/10",
      darkGradientTo: "dark:to-green-500/5",
      subtitle: `${completionRate}% complete`,
    },
    {
      label: "Average Streak",
      value: `${averageStreak}`,
      icon: BoltIcon,
      gradientFrom: "from-orange-50",
      gradientTo: "to-orange-100",
      borderColor: "border-orange-200 dark:border-gray-700",
      iconBg: "bg-orange-100 dark:bg-orange-500/20",
      iconColor: "text-orange-600 dark:text-orange-400",
      darkGradientFrom: "dark:from-orange-500/10",
      darkGradientTo: "dark:to-orange-500/5",
      subtitle: "days",
    },
    {
      label: "Longest Streak",
      value: `${longestStreak}`,
      icon: ShootingStarIcon,
      gradientFrom: "from-yellow-50",
      gradientTo: "to-yellow-100",
      borderColor: "border-yellow-200 dark:border-gray-700",
      iconBg: "bg-yellow-100 dark:bg-yellow-500/20",
      iconColor: "text-yellow-600 dark:text-yellow-400",
      darkGradientFrom: "dark:from-yellow-500/10",
      darkGradientTo: "dark:to-yellow-500/5",
      subtitle: "days",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className={`rounded-xl border ${stat.borderColor} bg-gradient-to-br ${stat.gradientFrom} ${stat.gradientTo} ${stat.darkGradientFrom} ${stat.darkGradientTo} p-6 shadow-theme-xs`}
          >
            <div className="flex items-center gap-3">
              <div className={`rounded-lg ${stat.iconBg} p-2`}>
                <Icon className={`h-6 w-6 ${stat.iconColor}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                {stat.subtitle && (
                  <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-500">{stat.subtitle}</p>
                )}
              </div>
            </div>

            {/* Progress bar for today's progress */}
            {stat.label === "Today's Progress" && todayTotal > 0 && (
              <div className="mt-4">
                <div className="h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                  <div
                    className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-500"
                    style={{ width: `${completionRate}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default HabitsOverview;

