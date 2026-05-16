import "@testing-library/jest-dom/vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { achievementConfigs } from "../data/achievementConfigs";
import type { AchievementStats } from "../types";
import { buildAchievements, buildAchievementSummary } from "../utils/buildAchievements";
import { AchievementDrawer } from "./AchievementDrawer";

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

const achievements = buildAchievements(achievementConfigs, emptyStats, {});
const summary = buildAchievementSummary(achievements);

describe("AchievementDrawer", () => {
  it("resets the category to all whenever it opens", () => {
    const onClose = vi.fn();
    const { rerender } = render(
      <AchievementDrawer
        achievements={achievements}
        onClose={onClose}
        open
        summary={summary}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "番茄" }));
    expect(screen.getAllByTestId("achievement-card")).toHaveLength(4);

    rerender(
      <AchievementDrawer
        achievements={achievements}
        onClose={onClose}
        open={false}
        summary={summary}
      />,
    );
    rerender(
      <AchievementDrawer
        achievements={achievements}
        onClose={onClose}
        open
        summary={summary}
      />,
    );

    expect(screen.getAllByTestId("achievement-card")).toHaveLength(24);
  });
});
