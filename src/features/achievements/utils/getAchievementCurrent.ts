import type { AchievementStats } from "../types";

export function getAchievementCurrent(id: string, stats: AchievementStats): number {
  switch (id) {
    case "streak-3-days":
    case "streak-7-days":
    case "streak-14-days":
    case "streak-30-days":
      return stats.streakDays;

    case "total-10-pomodoros":
    case "total-50-pomodoros":
    case "total-100-pomodoros":
    case "total-300-pomodoros":
      return stats.totalPomodoros;

    case "today-2-pomodoros":
    case "today-4-pomodoros":
    case "today-8-pomodoros":
      return stats.todayPomodoros;

    case "daily-4-hours":
      return stats.todayFocusMinutes;

    case "weekly-10-pomodoros":
    case "weekly-20-pomodoros":
    case "weekly-40-pomodoros":
      return stats.weeklyPomodoros;

    case "weekly-10-hours":
      return stats.weeklyFocusMinutes;

    case "first-task":
    case "total-10-tasks":
    case "total-50-tasks":
      return stats.completedTasks;

    case "high-priority-10-tasks":
      return stats.completedHighPriorityTasks;

    case "morning-focus":
      return stats.morningFocusCount;

    case "afternoon-restart":
      return stats.afternoonFocusCount;

    case "night-focus":
      return stats.nightFocusCount;

    case "weekend-focus":
      return stats.weekendFocusCount;

    default:
      return 0;
  }
}
