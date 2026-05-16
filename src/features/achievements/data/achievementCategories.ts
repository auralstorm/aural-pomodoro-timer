import type { AchievementCategoryFilter } from "../types";

export const achievementCategories: Array<{
  label: string;
  value: AchievementCategoryFilter;
}> = [
  { label: "全部", value: "all" },
  { label: "习惯", value: "habit" },
  { label: "番茄", value: "pomodoro" },
  { label: "今日", value: "daily" },
  { label: "本周", value: "weekly" },
  { label: "任务", value: "task" },
  { label: "特殊", value: "special" },
];
