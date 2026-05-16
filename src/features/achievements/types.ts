export type AchievementCategory = "habit" | "pomodoro" | "daily" | "weekly" | "task" | "special";

export type AchievementCategoryFilter = AchievementCategory | "all";

export type AchievementConfig = {
  id: string;
  index: number;
  category: AchievementCategory;
  title: string;
  description: string;
  target: number;
  unit: string;
  points: number;
  unlockedIcon: string;
  lockedIcon: string;
};

export type AchievementItem = AchievementConfig & {
  current: number;
  unlocked: boolean;
  unlockedAt?: string;
};

export type AchievementStats = {
  streakDays: number;
  totalPomodoros: number;
  todayPomodoros: number;
  todayFocusMinutes: number;
  weeklyPomodoros: number;
  weeklyFocusMinutes: number;
  completedTasks: number;
  completedHighPriorityTasks: number;
  morningFocusCount: number;
  afternoonFocusCount: number;
  nightFocusCount: number;
  weekendFocusCount: number;
};

export type AchievementSummaryModel = {
  unlockedCount: number;
  totalCount: number;
  completionRate: number;
  achievementPoints: number;
  recentUnlocked?: AchievementItem;
  nearestAchievement?: AchievementItem;
};
