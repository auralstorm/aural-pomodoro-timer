import summaryAchievementMedal from "@/assets/achievements/drawer-icons/icon-summary-achievement-medal.svg";
import summaryNearestTarget from "@/assets/achievements/drawer-icons/icon-summary-nearest-target.svg";
import summaryPointsStar from "@/assets/achievements/drawer-icons/icon-summary-points-star.svg";
import summaryRecentCalendar from "@/assets/achievements/drawer-icons/icon-summary-recent-calendar.svg";
import tabAllGrid from "@/assets/achievements/drawer-icons/icon-tab-all-grid.svg";
import tabDailySun from "@/assets/achievements/drawer-icons/icon-tab-daily-sun.svg";
import tabHabitLeaf from "@/assets/achievements/drawer-icons/icon-tab-habit-leaf.svg";
import tabPomodoroTomato from "@/assets/achievements/drawer-icons/icon-tab-pomodoro-tomato.svg";
import tabSpecialStar from "@/assets/achievements/drawer-icons/icon-tab-special-star.svg";
import tabTaskClipboard from "@/assets/achievements/drawer-icons/icon-tab-task-clipboard.svg";
import tabWeeklyCalendar from "@/assets/achievements/drawer-icons/icon-tab-weekly-calendar.svg";
import tipsBackground from "@/assets/achievements/drawer-icons/tips-bg.png";

import type { AchievementCategoryFilter } from "../types";

export const drawerSummaryIcons = {
  unlocked: summaryAchievementMedal,
  points: summaryPointsStar,
  recent: summaryRecentCalendar,
  nearest: summaryNearestTarget,
} as const;

export const drawerCategoryIcons: Record<AchievementCategoryFilter, string> = {
  all: tabAllGrid,
  habit: tabHabitLeaf,
  pomodoro: tabPomodoroTomato,
  daily: tabDailySun,
  weekly: tabWeeklyCalendar,
  task: tabTaskClipboard,
  special: tabSpecialStar,
};

export const drawerTipsBackground = tipsBackground;
