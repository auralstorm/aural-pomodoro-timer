import dayjs from "dayjs";

import type { Task } from "@/types/task";
import type { PomodoroSession } from "@/types/timer";

export type TodayStats = {
  focusMinutes: number;
  completedPomodoros: number;
};

export type TrendPoint = {
  date: string;
  label: string;
  minutes: number;
  pomodoros: number;
};

function isCompletedFocusSession(session: PomodoroSession): boolean {
  return session.mode === "focus" && session.completed;
}

export function calculateTodayStats(sessions: PomodoroSession[], now = new Date()): TodayStats {
  const today = dayjs(now);

  return sessions.reduce<TodayStats>(
    (stats, session) => {
      if (isCompletedFocusSession(session) && dayjs(session.endedAt).isSame(today, "day")) {
        stats.focusMinutes += session.durationMinutes;
        stats.completedPomodoros += 1;
      }

      return stats;
    },
    { focusMinutes: 0, completedPomodoros: 0 },
  );
}

export function calculateWeeklyTrend(sessions: PomodoroSession[], now = new Date()): TrendPoint[] {
  const end = dayjs(now).startOf("day");

  return Array.from({ length: 7 }, (_, index) => {
    const date = end.subtract(6 - index, "day");
    const daySessions = sessions.filter(
      (session) => isCompletedFocusSession(session) && dayjs(session.endedAt).isSame(date, "day"),
    );

    return {
      date: date.format("YYYY-MM-DD"),
      label: date.format("MM/DD"),
      minutes: daySessions.reduce((sum, session) => sum + session.durationMinutes, 0),
      pomodoros: daySessions.length,
    };
  });
}

export function calculateCompletionRate(tasks: Task[]): number {
  if (tasks.length === 0) {
    return 0;
  }

  const completed = tasks.filter((task) => task.status === "completed").length;

  return Math.round((completed / tasks.length) * 100);
}

export function getCurrentStreakDays(sessions: PomodoroSession[], now = new Date()): number {
  const focusedDays = new Set(
    sessions
      .filter(isCompletedFocusSession)
      .map((session) => dayjs(session.endedAt).format("YYYY-MM-DD")),
  );

  let cursor = dayjs(now).startOf("day");
  let streak = 0;

  while (focusedDays.has(cursor.format("YYYY-MM-DD"))) {
    streak += 1;
    cursor = cursor.subtract(1, "day");
  }

  return streak;
}

export function getTotalFocusMinutes(sessions: PomodoroSession[]): number {
  return sessions
    .filter(isCompletedFocusSession)
    .reduce((sum, session) => sum + session.durationMinutes, 0);
}
