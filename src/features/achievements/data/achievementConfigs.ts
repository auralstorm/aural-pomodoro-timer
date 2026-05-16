import type { AchievementCategory, AchievementConfig } from "../types";

type AchievementBaseConfig = Omit<AchievementConfig, "lockedIcon" | "unlockedIcon">;

const achievementIconModules = import.meta.glob(
  "../../../assets/achievements/**/*.png",
  {
    eager: true,
    import: "default",
    query: "?url",
  },
) as Record<string, string>;

const achievementBaseConfigs: AchievementBaseConfig[] = [
  createConfig("streak-3-days", 1, "habit", "连续专注 3 天", "连续 3 天每天至少完成 1 个番茄", 3, "天", 20),
  createConfig("streak-7-days", 2, "habit", "连续专注 7 天", "连续 7 天每天至少完成 1 个番茄", 7, "天", 40),
  createConfig("streak-14-days", 3, "habit", "连续专注 14 天", "连续 14 天每天至少完成 1 个番茄", 14, "天", 60),
  createConfig("streak-30-days", 4, "habit", "连续专注 30 天", "连续 30 天每天至少完成 1 个番茄", 30, "天", 100),
  createConfig("total-10-pomodoros", 5, "pomodoro", "累计 10 个番茄", "累计完成 10 个番茄专注", 10, "个", 20),
  createConfig("total-50-pomodoros", 6, "pomodoro", "累计 50 个番茄", "累计完成 50 个番茄专注", 50, "个", 40),
  createConfig("total-100-pomodoros", 7, "pomodoro", "累计 100 个番茄", "累计完成 100 个番茄专注", 100, "个", 60),
  createConfig("total-300-pomodoros", 8, "pomodoro", "累计 300 个番茄", "累计完成 300 个番茄专注", 300, "个", 100),
  createConfig("today-2-pomodoros", 9, "daily", "今日完成 2 个番茄", "今天完成 2 个番茄专注", 2, "个", 20),
  createConfig("today-4-pomodoros", 10, "daily", "今日完成 4 个番茄", "今天完成 4 个番茄专注", 4, "个", 40),
  createConfig("today-8-pomodoros", 11, "daily", "今日完成 8 个番茄", "今天完成 8 个番茄专注", 8, "个", 80),
  createConfig("daily-4-hours", 12, "daily", "单日专注 4 小时", "一天内累计专注 4 小时", 240, "分钟", 80),
  createConfig("weekly-10-pomodoros", 13, "weekly", "本周 10 番茄", "本周累计完成 10 个番茄", 10, "个", 30),
  createConfig("weekly-20-pomodoros", 14, "weekly", "本周 20 番茄", "本周累计完成 20 个番茄", 20, "个", 60),
  createConfig("weekly-40-pomodoros", 15, "weekly", "本周 40 番茄", "本周累计完成 40 个番茄", 40, "个", 100),
  createConfig("weekly-10-hours", 16, "weekly", "本周专注 10 小时", "本周累计专注 10 小时", 600, "分钟", 100),
  createConfig("first-task", 17, "task", "完成第 1 个任务", "完成你的第一个专注任务", 1, "个", 20),
  createConfig("total-10-tasks", 18, "task", "累计完成 10 个任务", "累计完成 10 个专注任务", 10, "个", 40),
  createConfig("total-50-tasks", 19, "task", "累计完成 50 个任务", "累计完成 50 个专注任务", 50, "个", 80),
  createConfig("high-priority-10-tasks", 20, "task", "完成 10 个高优先级任务", "累计完成 10 个高优先级任务", 10, "个", 100),
  createConfig("morning-focus", 21, "special", "早晨专注者", "上午 9 点前完成 1 个番茄", 1, "次", 30),
  createConfig("afternoon-restart", 22, "special", "午后重启", "下午完成 1 个番茄，重新进入专注节奏", 1, "次", 30),
  createConfig("night-focus", 23, "special", "夜间专注者", "晚上 20 点后完成 1 个番茄", 1, "次", 30),
  createConfig("weekend-focus", 24, "special", "周末也专注", "周末完成 1 个番茄，保持轻松节奏", 1, "次", 30),
];

export const achievementConfigs: AchievementConfig[] = achievementBaseConfigs.map(
  (config) => ({
    ...config,
    lockedIcon: getAchievementIcon(config, "locked"),
    unlockedIcon: getAchievementIcon(config, "unlocked"),
  }),
);

function createConfig(
  id: string,
  index: number,
  category: AchievementCategory,
  title: string,
  description: string,
  target: number,
  unit: string,
  points: number,
): AchievementBaseConfig {
  return { category, description, id, index, points, target, title, unit };
}

function getAchievementIcon(
  config: AchievementBaseConfig,
  state: "locked" | "unlocked",
) {
  const paddedIndex = String(config.index).padStart(2, "0");
  const key = `../../../assets/achievements/${state}/achievement-${paddedIndex}-${config.id}-${state}.png`;
  const icon = achievementIconModules[key];

  if (!icon) {
    throw new Error(`Missing achievement icon: ${key}`);
  }

  return icon;
}
