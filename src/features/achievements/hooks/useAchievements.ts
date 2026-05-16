import { useEffect, useMemo } from "react";

import { useStatsStore } from "@/stores/statsStore";
import { useTaskStore } from "@/stores/taskStore";

import { achievementConfigs } from "../data/achievementConfigs";
import { useAchievementStore } from "../stores/achievementStore";
import { buildAchievements, buildAchievementSummary } from "../utils/buildAchievements";
import { buildAchievementStats } from "../utils/buildAchievementStats";

export function useAchievements() {
  const sessions = useStatsStore((state) => state.sessions);
  const tasks = useTaskStore((state) => state.tasks);
  const unlockedMap = useAchievementStore((state) => state.unlockedMap);
  const recordUnlocked = useAchievementStore((state) => state.recordUnlocked);

  const stats = useMemo(() => buildAchievementStats(sessions, tasks), [sessions, tasks]);
  const achievements = useMemo(
    () => buildAchievements(achievementConfigs, stats, unlockedMap),
    [stats, unlockedMap],
  );
  const summary = useMemo(() => buildAchievementSummary(achievements), [achievements]);
  const newlyUnlockedIds = useMemo(
    () =>
      achievements
        .filter((achievement) => achievement.unlocked && !achievement.unlockedAt)
        .map((achievement) => achievement.id),
    [achievements],
  );

  useEffect(() => {
    recordUnlocked(newlyUnlockedIds);
  }, [newlyUnlockedIds, recordUnlocked]);

  return {
    achievements,
    summary,
  };
}
