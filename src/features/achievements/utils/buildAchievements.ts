import type {
  AchievementConfig,
  AchievementItem,
  AchievementStats,
  AchievementSummaryModel,
} from "../types";
import { getAchievementCurrent } from "./getAchievementCurrent";

export function buildAchievements(
  configs: AchievementConfig[],
  stats: AchievementStats,
  unlockedMap: Record<string, string | undefined>,
): AchievementItem[] {
  return configs.map((config) => {
    const rawCurrent = getAchievementCurrent(config.id, stats);
    const unlockedAt = unlockedMap[config.id];
    const unlocked = Boolean(unlockedAt) || rawCurrent >= config.target;
    const current = unlocked
      ? config.target
      : Math.min(rawCurrent, config.target);

    return {
      ...config,
      current,
      unlocked,
      unlockedAt,
    };
  });
}

export function buildAchievementSummary(
  achievements: AchievementItem[],
): AchievementSummaryModel {
  const unlockedAchievements = achievements.filter((item) => item.unlocked);
  const lockedAchievements = achievements.filter((item) => !item.unlocked);
  const unlockedCount = unlockedAchievements.length;
  const totalCount = achievements.length;
  const completionRate =
    totalCount > 0 ? Math.round((unlockedCount / totalCount) * 100) : 0;
  const achievementPoints = unlockedAchievements.reduce(
    (sum, item) => sum + item.points,
    0,
  );
  const recentUnlocked = unlockedAchievements
    .filter((item) => item.unlockedAt)
    .sort(
      (a, b) =>
        new Date(b.unlockedAt ?? 0).getTime() -
        new Date(a.unlockedAt ?? 0).getTime(),
    )[0];
  const nearestAchievement = lockedAchievements
    .slice()
    .sort(
      (a, b) =>
        b.current / Math.max(b.target, 1) - a.current / Math.max(a.target, 1),
    )[0];

  return {
    achievementPoints,
    completionRate,
    nearestAchievement,
    recentUnlocked,
    totalCount,
    unlockedCount,
  };
}
