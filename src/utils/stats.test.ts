import { describe, expect, it } from "vitest";

import {
  calculateCompletionRate,
  calculateTodayStats,
  calculateWeeklyTrend,
  getCurrentStreakDays,
} from "./stats";
import type { PomodoroSession } from "@/types/timer";
import type { Task } from "@/types/task";

const sessions: PomodoroSession[] = [
  {
    id: "s1",
    taskId: "t1",
    mode: "focus",
    startedAt: "2026-05-13T01:00:00.000Z",
    endedAt: "2026-05-13T01:25:00.000Z",
    durationMinutes: 25,
    completed: true,
  },
  {
    id: "s2",
    taskId: "t2",
    mode: "focus",
    startedAt: "2026-05-12T01:00:00.000Z",
    endedAt: "2026-05-12T01:25:00.000Z",
    durationMinutes: 25,
    completed: true,
  },
  {
    id: "s3",
    mode: "shortBreak",
    startedAt: "2026-05-13T02:00:00.000Z",
    endedAt: "2026-05-13T02:05:00.000Z",
    durationMinutes: 5,
    completed: true,
  },
];

describe("stats utilities", () => {
  it("calculates today's completed focus stats only", () => {
    expect(calculateTodayStats(sessions, new Date("2026-05-13T10:00:00.000Z"))).toEqual({
      focusMinutes: 25,
      completedPomodoros: 1,
    });
  });

  it("calculates a seven-day weekly trend", () => {
    const trend = calculateWeeklyTrend(
      sessions,
      new Date("2026-05-13T10:00:00.000Z"),
    );

    expect(trend).toHaveLength(7);
    expect(trend[trend.length - 1]).toMatchObject({ minutes: 25, pomodoros: 1 });
  });

  it("calculates task completion rate", () => {
    const tasks: Task[] = [
      {
        id: "t1",
        title: "done",
        priority: "normal",
        status: "completed",
        estimatedPomodoros: 1,
        completedPomodoros: 1,
        createdAt: "2026-05-13T00:00:00.000Z",
        updatedAt: "2026-05-13T00:00:00.000Z",
      },
      {
        id: "t2",
        title: "pending",
        priority: "important",
        status: "pending",
        estimatedPomodoros: 2,
        completedPomodoros: 0,
        createdAt: "2026-05-13T00:00:00.000Z",
        updatedAt: "2026-05-13T00:00:00.000Z",
      },
    ];

    expect(calculateCompletionRate(tasks)).toBe(50);
  });

  it("calculates current focus streak days", () => {
    expect(
      getCurrentStreakDays(sessions, new Date("2026-05-13T10:00:00.000Z")),
    ).toBe(2);
  });
});
