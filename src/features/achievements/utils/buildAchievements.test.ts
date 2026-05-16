import { describe, expect, it } from "vitest";

import { achievementConfigs } from "../data/achievementConfigs";
import type { AchievementStats } from "../types";
import { buildAchievements } from "./buildAchievements";
import { formatAchievementProgress } from "./formatAchievementProgress";
import { getAchievementCurrent } from "./getAchievementCurrent";

const emptyStats: AchievementStats = {
  afternoonFocusCount: 0,
  completedHighPriorityTasks: 0,
  completedTasks: 0,
  morningFocusCount: 0,
  nightFocusCount: 0,
  streakDays: 0,
  todayFocusMinutes: 0,
  todayPomodoros: 0,
  totalPomodoros: 0,
  weekendFocusCount: 0,
  weeklyFocusMinutes: 0,
  weeklyPomodoros: 0,
};

describe("achievement utilities", () => {
  it("defines 24 achievements across the six business categories", () => {
    expect(achievementConfigs).toHaveLength(24);
    expect(countByCategory()).toEqual({
      daily: 4,
      habit: 4,
      pomodoro: 4,
      special: 4,
      task: 4,
      weekly: 4,
    });
  });

  it("maps each achievement id to the correct current progress source", () => {
    const stats: AchievementStats = {
      ...emptyStats,
      completedHighPriorityTasks: 8,
      completedTasks: 11,
      morningFocusCount: 1,
      streakDays: 7,
      todayFocusMinutes: 240,
      todayPomodoros: 4,
      totalPomodoros: 68,
      weeklyFocusMinutes: 600,
      weeklyPomodoros: 20,
    };

    expect(getAchievementCurrent("streak-30-days", stats)).toBe(7);
    expect(getAchievementCurrent("total-300-pomodoros", stats)).toBe(68);
    expect(getAchievementCurrent("today-4-pomodoros", stats)).toBe(4);
    expect(getAchievementCurrent("daily-4-hours", stats)).toBe(240);
    expect(getAchievementCurrent("weekly-20-pomodoros", stats)).toBe(20);
    expect(getAchievementCurrent("weekly-10-hours", stats)).toBe(600);
    expect(getAchievementCurrent("high-priority-10-tasks", stats)).toBe(8);
    expect(getAchievementCurrent("morning-focus", stats)).toBe(1);
  });

  it("keeps previously unlocked achievements unlocked even if current progress drops", () => {
    const achievements = buildAchievements(achievementConfigs, emptyStats, {
      "today-4-pomodoros": "2026-05-12T08:00:00.000Z",
    });

    const dailyAchievement = achievements.find((item) => item.id === "today-4-pomodoros");

    expect(dailyAchievement?.unlocked).toBe(true);
    expect(dailyAchievement?.current).toBe(dailyAchievement?.target);
    expect(dailyAchievement?.unlockedAt).toBe("2026-05-12T08:00:00.000Z");
  });

  it("formats minute achievements as hours for card progress", () => {
    expect(formatAchievementProgress(240, 600, "分钟")).toBe("4 / 10 小时");
    expect(formatAchievementProgress(8, 10, "个")).toBe("8 / 10 个");
  });
});

function countByCategory() {
  return achievementConfigs.reduce<Record<string, number>>((counts, achievement) => {
    counts[achievement.category] = (counts[achievement.category] ?? 0) + 1;
    return counts;
  }, {});
}
