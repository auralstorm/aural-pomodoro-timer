/** 统计数据模型构建函数（纯函数，无 React 依赖） */

import dayjs from "dayjs";

import type { Task } from "@/types/task";
import type { PomodoroSession } from "@/types/timer";
import { calculateCompletionRate, calculateWeeklyTrend, getCurrentStreakDays } from "@/utils/stats";

import { FOCUS_TREND_Y_TICKS, WEEKDAY_LABELS } from "./constants";
import type {
  ActivePeriod,
  FocusEfficiencyPoint,
  PeriodRange,
  TrendCopyOptions,
  TrendInfo,
} from "./types";

export function buildFocusTrend(sessions: PomodoroSession[], period: ActivePeriod) {
  const focusSessions = sessions.filter((session) => session.mode === "focus" && session.completed);

  if (period === "today") {
    const today = dayjs().startOf("day");
    const buckets = [
      { label: "0时", start: 0, end: 4, minutes: 0 },
      { label: "4时", start: 4, end: 8, minutes: 0 },
      { label: "8时", start: 8, end: 12, minutes: 0 },
      { label: "12时", start: 12, end: 16, minutes: 0 },
      { label: "16时", start: 16, end: 20, minutes: 0 },
      { label: "20时", start: 20, end: 24, minutes: 0 },
    ];

    focusSessions
      .filter((session) => dayjs(session.endedAt).isSame(today, "day"))
      .forEach((session) => {
        const hour = dayjs(session.endedAt).hour();
        const bucket = buckets.find((item) => hour >= item.start && hour < item.end);
        if (bucket) bucket.minutes += session.durationMinutes;
      });

    return buckets.map(({ end: _end, start: _start, ...bucket }) => bucket);
  }

  if (period === "month") {
    const monthStart = dayjs().startOf("month");
    const today = dayjs().endOf("day");
    const weekCount = Math.ceil((today.date() + monthStart.day()) / 7);

    return Array.from({ length: weekCount }, (_, index) => {
      const start = monthStart.add(index * 7, "day").startOf("day");
      const weekEnd = start.add(6, "day").endOf("day");
      const end = weekEnd.isAfter(today) ? today : weekEnd;
      const minutes = focusSessions
        .filter((session) => {
          const endedAt = dayjs(session.endedAt);
          return isWithinRange(endedAt, start, end);
        })
        .reduce((sum, session) => sum + session.durationMinutes, 0);

      return {
        label: `第${index + 1}周`,
        minutes,
      };
    });
  }

  return calculateWeeklyTrend(sessions).map((point) => ({
    label: WEEKDAY_LABELS[dayjs(point.date).day()],
    minutes: point.minutes,
  }));
}

export function buildStatisticsModel(
  sessions: PomodoroSession[],
  tasks: Task[],
  period: ActivePeriod,
) {
  const range = getPeriodRange(period);
  const copy = getPeriodCopy(period);
  const focusSessions = sessions.filter((session) => session.mode === "focus" && session.completed);
  const periodFocusSessions = filterSessionsForRange(
    focusSessions,
    range.currentStart,
    range.currentEnd,
  );
  const previousPeriodFocusSessions = filterSessionsForRange(
    focusSessions,
    range.previousStart,
    range.previousEnd,
  );
  const periodTasks = filterTasksForRange(tasks, range.currentStart, range.currentEnd);
  const weekTrend = calculateWeeklyTrend(sessions).map((point) => ({
    ...point,
    label: WEEKDAY_LABELS[dayjs(point.date).day()],
    hoursLabel: `${(point.minutes / 60).toFixed(1)}h`,
  }));
  const previousCompletedTasks = tasks.filter(
    (task) =>
      task.status === "completed" &&
      task.completedAt &&
      isWithinRange(dayjs(task.completedAt), range.previousStart, range.previousEnd),
  ).length;
  const completedTasks = periodTasks.filter(
    (task) =>
      task.status === "completed" &&
      task.completedAt &&
      isWithinRange(dayjs(task.completedAt), range.currentStart, range.currentEnd),
  ).length;
  const currentStreak = getCurrentStreakDays(sessions);
  const totalPomodoros = periodFocusSessions.length;
  const previousPeriodPomodoros = previousPeriodFocusSessions.length;
  const totalMinutes = periodFocusSessions.reduce(
    (sum, session) => sum + session.durationMinutes,
    0,
  );
  const previousPeriodMinutes = previousPeriodFocusSessions.reduce(
    (sum, session) => sum + session.durationMinutes,
    0,
  );

  return {
    comparisonLabel: copy.comparisonLabel,
    comparisonTarget: copy.comparisonTarget,
    completedTasks,
    completionRate: calculateCompletionRate(periodTasks),
    currentPeriodLabel: copy.currentPeriodLabel,
    currentStreak,
    durationDistribution: buildDurationDistribution(periodFocusSessions),
    efficientBuckets: buildEfficientBuckets(periodFocusSessions),
    focusEfficiencyTrend: buildFocusEfficiencyTrend(focusSessions, period),
    highPriorityCompleted: periodTasks.filter(
      (task) => task.status === "completed" && task.priority !== "normal",
    ).length,
    periodFocusSessions,
    periodMinutes: totalMinutes,
    periodTasks,
    previousCompletedTasks,
    previousPeriodMinutes,
    previousPeriodPomodoros,
    taskBreakdown: buildTaskBreakdown(periodTasks),
    totalMinutes,
    totalPomodoros,
    weekTrend,
  };
}

export function getPeriodRange(period: ActivePeriod): PeriodRange {
  const now = dayjs();

  if (period === "today") {
    const currentStart = now.startOf("day");
    const currentEnd = now.endOf("day");
    return {
      currentEnd,
      currentStart,
      previousEnd: currentEnd.subtract(1, "day"),
      previousStart: currentStart.subtract(1, "day"),
    };
  }

  if (period === "month") {
    const currentStart = now.startOf("month");
    const currentEnd = now.endOf("day");
    const previousStart = now.subtract(1, "month").startOf("month");
    return {
      currentEnd,
      currentStart,
      previousEnd: previousStart.endOf("month"),
      previousStart,
    };
  }

  const currentStart = now.startOf("day").subtract(6, "day");
  const currentEnd = now.endOf("day");
  return {
    currentEnd,
    currentStart,
    previousEnd: currentEnd.subtract(7, "day"),
    previousStart: currentStart.subtract(7, "day"),
  };
}

export function getPeriodCopy(period: ActivePeriod) {
  if (period === "today") {
    return {
      comparisonLabel: "较昨天",
      comparisonTarget: "昨天",
      currentPeriodLabel: "今天",
      growthCurrent: "今天",
      growthPrevious: "昨天",
      trendTitle: "今日专注趋势",
    };
  }

  if (period === "month") {
    return {
      comparisonLabel: "较上月",
      comparisonTarget: "上月",
      currentPeriodLabel: "本月",
      growthCurrent: "本月",
      growthPrevious: "上月",
      trendTitle: "本月专注趋势",
    };
  }

  return {
    comparisonLabel: "较上周",
    comparisonTarget: "上周",
    currentPeriodLabel: "本周",
    growthCurrent: "这周",
    growthPrevious: "上周",
    trendTitle: "本周专注趋势",
  };
}

export function filterSessionsForRange(
  sessions: PomodoroSession[],
  start: dayjs.Dayjs,
  end: dayjs.Dayjs,
) {
  return sessions.filter((session) => isWithinRange(dayjs(session.endedAt), start, end));
}

export function filterTasksForRange(tasks: Task[], start: dayjs.Dayjs, end: dayjs.Dayjs) {
  return tasks.filter((task) =>
    [task.createdAt, task.updatedAt, task.completedAt]
      .filter(Boolean)
      .some((date) => isWithinRange(dayjs(date), start, end)),
  );
}

export function isWithinRange(value: dayjs.Dayjs, start: dayjs.Dayjs, end: dayjs.Dayjs) {
  return value.isSame(start) || value.isSame(end) || (value.isAfter(start) && value.isBefore(end));
}

export function buildTaskBreakdown(tasks: Task[]) {
  const completed = tasks.filter((task) => task.status === "completed").length;
  const pending = tasks.filter((task) => task.status === "pending").length;
  const inProgress = tasks.filter((task) => task.status === "inProgress").length;

  return [
    { color: "var(--color-success)", name: "已完成任务数", value: completed },
    { color: "var(--color-warning)", name: "待开始任务数", value: pending },
    { color: "var(--color-tomato-red)", name: "进行中任务数", value: inProgress },
  ].filter((item) => item.value > 0);
}

export function buildEfficientBuckets(sessions: PomodoroSession[]) {
  const buckets = [
    { label: "上午 09:00 - 11:00", minutes: 0 },
    { label: "下午 14:00 - 16:00", minutes: 0 },
    { label: "晚上 20:00 - 22:00", minutes: 0 },
    { label: "其他时段", minutes: 0 },
  ];

  sessions.forEach((session) => {
    const hour = dayjs(session.endedAt).hour();
    if (hour >= 9 && hour < 11) buckets[0].minutes += session.durationMinutes;
    else if (hour >= 14 && hour < 16) buckets[1].minutes += session.durationMinutes;
    else if (hour >= 20 && hour < 22) buckets[2].minutes += session.durationMinutes;
    else buckets[3].minutes += session.durationMinutes;
  });

  const best = Math.max(...buckets.map((bucket) => bucket.minutes));
  return buckets.map((bucket) => ({ ...bucket, star: best > 0 && bucket.minutes === best }));
}

export function buildDurationDistribution(sessions: PomodoroSession[]) {
  const buckets = [
    { color: "var(--color-tomato-red)", minutes: 0, name: "25 分钟专注" },
    { color: "var(--color-warning)", minutes: 0, name: "50 分钟专注" },
    { color: "var(--color-success)", minutes: 0, name: "其他时长" },
  ];

  sessions.forEach((session) => {
    if (session.durationMinutes <= 30) buckets[0].minutes += session.durationMinutes;
    else if (session.durationMinutes <= 55) buckets[1].minutes += session.durationMinutes;
    else buckets[2].minutes += session.durationMinutes;
  });

  const total = buckets.reduce((sum, bucket) => sum + bucket.minutes, 0);
  return buckets.map((bucket) => ({
    ...bucket,
    percent: total > 0 ? Math.round((bucket.minutes / total) * 100) : 0,
  }));
}

export function buildFocusEfficiencyTrend(
  sessions: PomodoroSession[],
  period: ActivePeriod,
): FocusEfficiencyPoint[] {
  const range = getPeriodRange(period);

  if (period === "today") {
    const currentBuckets = buildHourlyBuckets(
      filterSessionsForRange(sessions, range.currentStart, range.currentEnd),
    );
    const previousBuckets = buildHourlyBuckets(
      filterSessionsForRange(sessions, range.previousStart, range.previousEnd),
    );

    return currentBuckets.map((bucket, index) => ({
      currentMinutes: bucket.minutes,
      label: bucket.label,
      previousMinutes: previousBuckets[index]?.minutes ?? 0,
    }));
  }

  if (period === "month") {
    const currentBuckets = buildMonthlyBuckets(sessions, range.currentStart, range.currentEnd);
    const previousBuckets = buildMonthlyBuckets(
      sessions,
      range.previousStart,
      range.previousEnd,
      currentBuckets.length,
    );

    return currentBuckets.map((bucket, index) => ({
      currentMinutes: bucket.minutes,
      label: bucket.label,
      previousMinutes: previousBuckets[index]?.minutes ?? 0,
    }));
  }

  const currentBuckets = buildDailyBuckets(sessions, range.currentStart, 7);
  const previousBuckets = buildDailyBuckets(sessions, range.previousStart, 7);

  return currentBuckets.map((bucket, index) => ({
    currentMinutes: bucket.minutes,
    label: bucket.label,
    previousMinutes: previousBuckets[index]?.minutes ?? 0,
  }));
}

function buildHourlyBuckets(sessions: PomodoroSession[]) {
  const buckets = [
    { end: 4, label: "0时", minutes: 0, start: 0 },
    { end: 8, label: "4时", minutes: 0, start: 4 },
    { end: 12, label: "8时", minutes: 0, start: 8 },
    { end: 16, label: "12时", minutes: 0, start: 12 },
    { end: 20, label: "16时", minutes: 0, start: 16 },
    { end: 24, label: "20时", minutes: 0, start: 20 },
  ];

  sessions.forEach((session) => {
    const hour = dayjs(session.endedAt).hour();
    const bucket = buckets.find((item) => hour >= item.start && hour < item.end);
    if (bucket) {
      bucket.minutes += session.durationMinutes;
    }
  });

  return buckets.map(({ end: _end, start: _start, ...bucket }) => bucket);
}

function buildDailyBuckets(sessions: PomodoroSession[], start: dayjs.Dayjs, days: number) {
  return Array.from({ length: days }, (_, index) => {
    const date = start.add(index, "day");
    const minutes = sessions
      .filter((session) => dayjs(session.endedAt).isSame(date, "day"))
      .reduce((sum, session) => sum + session.durationMinutes, 0);

    return {
      label: WEEKDAY_LABELS[date.day()],
      minutes,
    };
  });
}

function buildMonthlyBuckets(
  sessions: PomodoroSession[],
  monthStart: dayjs.Dayjs,
  monthEnd: dayjs.Dayjs,
  bucketCount?: number,
) {
  const todayEnd = monthEnd.endOf("day");
  const totalBuckets = bucketCount ?? Math.ceil((todayEnd.date() + monthStart.day()) / 7);

  return Array.from({ length: totalBuckets }, (_, index) => {
    const start = monthStart.add(index * 7, "day").startOf("day");
    const end = start.add(6, "day").endOf("day");
    const boundedEnd = end.isAfter(todayEnd) ? todayEnd : end;
    const minutes = start.isAfter(todayEnd)
      ? 0
      : sessions
          .filter((session) => isWithinRange(dayjs(session.endedAt), start, boundedEnd))
          .reduce((sum, session) => sum + session.durationMinutes, 0);

    return {
      label: `第${index + 1}周`,
      minutes,
    };
  });
}

export function getFocusEfficiencyAxisConfig(trend: FocusEfficiencyPoint[]) {
  const maxMinutes = Math.max(
    0,
    ...trend.flatMap((point) => [point.currentMinutes, point.previousMinutes]),
  );

  if (maxMinutes <= 60) {
    return { max: 60, ticks: [0, 20, 40, 60] };
  }

  if (maxMinutes <= 120) {
    return { max: 120, ticks: [0, 30, 60, 90, 120] };
  }

  if (maxMinutes <= 240) {
    return { max: 240, ticks: [0, 60, 120, 180, 240] };
  }

  return { max: 360, ticks: FOCUS_TREND_Y_TICKS };
}

export function formatFocusEfficiencyTick(value: number) {
  if (value === 0) {
    return "0";
  }

  if (value < 60) {
    return `${value}m`;
  }

  const hours = value / 60;
  return Number.isInteger(hours) ? `${hours}h` : `${hours.toFixed(1)}h`;
}

export function formatCountDelta(value: number) {
  return `${value} 个`;
}

export function formatMetricTrend(
  current: number,
  previous: number,
  options: TrendCopyOptions & { comparisonLabel: string },
): TrendInfo {
  const delta = current - previous;

  if (current === 0 && previous === 0) {
    return {
      text: `${options.currentPeriodLabel}还没有${options.emptyNoun}`,
      tone: "neutral",
    };
  }

  if (delta === 0) {
    return {
      text: `与${options.comparisonTarget}持平`,
      tone: "neutral",
    };
  }

  if (previous === 0) {
    const absoluteDelta = options.formatAbsoluteDelta?.(current) ?? `${current}`;
    return {
      text: `${options.comparisonLabel}新增 ${absoluteDelta}`,
      tone: "positive",
    };
  }

  if (current === 0) {
    const absoluteDelta = options.formatAbsoluteDelta?.(Math.abs(delta)) ?? `${Math.abs(delta)}`;
    return {
      text: `${options.comparisonLabel}少 ${absoluteDelta}`,
      tone: "negative",
    };
  }

  if (delta < 0 && options.negativeDisplay === "absolute") {
    const absoluteDelta = options.formatAbsoluteDelta?.(Math.abs(delta)) ?? `${Math.abs(delta)}`;
    return {
      text: `${options.comparisonLabel}少 ${absoluteDelta}`,
      tone: "negative",
    };
  }

  const percent = Math.round((Math.abs(delta) / previous) * 100);
  return {
    text: `${options.comparisonLabel} ${delta > 0 ? "+" : "-"}${percent}% ${delta > 0 ? "↑" : "↓"}`,
    tone: delta > 0 ? "positive" : "negative",
  };
}

export function formatStreakTrend(currentStreak: number): TrendInfo {
  if (currentStreak === 0) {
    return {
      text: "今天开始建立连续记录",
      tone: "neutral",
    };
  }

  if (currentStreak === 1) {
    return {
      text: "已开始连续记录",
      tone: "positive",
    };
  }

  return {
    text: "继续保持",
    tone: "positive",
  };
}
