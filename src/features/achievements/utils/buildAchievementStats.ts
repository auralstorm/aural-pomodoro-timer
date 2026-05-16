import dayjs from "dayjs";

import type { Task } from "@/types/task";
import type { PomodoroSession } from "@/types/timer";
import { getCurrentStreakDays } from "@/utils/stats";

import type { AchievementStats } from "../types";

export function buildAchievementStats(
  sessions: PomodoroSession[],
  tasks: Task[],
  now = new Date(),
): AchievementStats {
  const focusSessions = sessions.filter((session) => session.mode === "focus" && session.completed);
  const today = dayjs(now);
  const weekStart = today.startOf("week");
  const weekEnd = today.endOf("week");
  const todaySessions = focusSessions.filter((session) =>
    dayjs(session.endedAt).isSame(today, "day"),
  );
  const weeklySessions = focusSessions.filter((session) => {
    const endedAt = dayjs(session.endedAt);
    return (
      endedAt.isSame(weekStart) ||
      endedAt.isSame(weekEnd) ||
      (endedAt.isAfter(weekStart) && endedAt.isBefore(weekEnd))
    );
  });
  const completedTasks = tasks.filter((task) => task.status === "completed");

  return {
    afternoonFocusCount: countSessionsByHour(focusSessions, 13, 18),
    completedHighPriorityTasks: completedTasks.filter((task) => task.priority !== "normal").length,
    completedTasks: completedTasks.length,
    morningFocusCount: focusSessions.filter((session) => dayjs(session.endedAt).hour() < 9).length,
    nightFocusCount: focusSessions.filter((session) => dayjs(session.endedAt).hour() >= 20).length,
    streakDays: getCurrentStreakDays(sessions, now),
    todayFocusMinutes: sumMinutes(todaySessions),
    todayPomodoros: todaySessions.length,
    totalPomodoros: focusSessions.length,
    weekendFocusCount: focusSessions.filter((session) => {
      const day = dayjs(session.endedAt).day();
      return day === 0 || day === 6;
    }).length,
    weeklyFocusMinutes: sumMinutes(weeklySessions),
    weeklyPomodoros: weeklySessions.length,
  };
}

function countSessionsByHour(sessions: PomodoroSession[], startHour: number, endHour: number) {
  return sessions.filter((session) => {
    const hour = dayjs(session.endedAt).hour();
    return hour >= startHour && hour < endHour;
  }).length;
}

function sumMinutes(sessions: PomodoroSession[]) {
  return sessions.reduce((sum, session) => sum + session.durationMinutes, 0);
}
