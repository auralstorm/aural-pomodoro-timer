import { useMemo, useState } from "react";

import { CalendarDays } from "lucide-react";

import iconCalendarStreak from "@/assets/icons/icon-calendar-streak.svg";
import iconClockFocus from "@/assets/icons/icon-clock-focus.svg";
import iconTaskComplete from "@/assets/icons/icon-task-complete.svg";
import iconTomatoCount from "@/assets/icons/icon-tomato-count.svg";
import { AppButton } from "@/components/common/AppButton";
import { SegmentedTabs } from "@/components/common/SegmentedTabs";
import { PageLayout } from "@/components/layout/PageLayout";
import { StatCard } from "@/components/stats/StatCard";
import { AchievementDrawer } from "@/features/achievements/components/AchievementDrawer";
import { useAchievements } from "@/features/achievements/hooks/useAchievements";
import { useStatsStore } from "@/stores/statsStore";
import { useTaskStore } from "@/stores/taskStore";
import { formatMinutesToChinese } from "@/utils/time";

import { AchievementPanel } from "./AchievementPanel";
import { PERIOD_OPTIONS } from "./constants";
import { DurationDistributionPanel } from "./DurationDistributionPanel";
import { EfficientTimePanel } from "./EfficientTimePanel";
import { FocusEfficiencyChangePanel } from "./FocusEfficiencyChangePanel";
import { FocusTrendPanel } from "./FocusTrendPanel";
import { GrowthSummaryCard } from "./GrowthSummaryCard";
import {
  buildStatisticsModel,
  formatCountDelta,
  formatMetricTrend,
  formatStreakTrend,
} from "./statisticsModel";
import { AnimatedStatValue, StatCardIcon } from "./StatisticsHelpers";
import { TaskCompletionPanel } from "./TaskCompletionPanel";
import type { ActivePeriod } from "./types";

export function StatisticsDashboard() {
  const [period, setPeriod] = useState<ActivePeriod>("today");
  const [achievementDrawerOpen, setAchievementDrawerOpen] = useState(false);
  const sessions = useStatsStore((state) => state.sessions);
  const tasks = useTaskStore((state) => state.tasks);
  const achievementCenter = useAchievements();

  const stats = useMemo(
    () => buildStatisticsModel(sessions, tasks, period),
    [period, sessions, tasks],
  );
  const totalFocusTrend = formatMetricTrend(stats.periodMinutes, stats.previousPeriodMinutes, {
    comparisonLabel: stats.comparisonLabel,
    comparisonTarget: stats.comparisonTarget,
    currentPeriodLabel: stats.currentPeriodLabel,
    emptyNoun: "专注记录",
    formatAbsoluteDelta: formatMinutesToChinese,
  });
  const totalPomodorosTrend = formatMetricTrend(
    stats.totalPomodoros,
    stats.previousPeriodPomodoros,
    {
      comparisonLabel: stats.comparisonLabel,
      comparisonTarget: stats.comparisonTarget,
      currentPeriodLabel: stats.currentPeriodLabel,
      emptyNoun: "完成番茄",
      formatAbsoluteDelta: formatCountDelta,
    },
  );
  const completedTasksTrend = formatMetricTrend(
    stats.completedTasks,
    stats.previousCompletedTasks,
    {
      comparisonLabel: stats.comparisonLabel,
      comparisonTarget: stats.comparisonTarget,
      currentPeriodLabel: stats.currentPeriodLabel,
      emptyNoun: "完成任务",
      formatAbsoluteDelta: formatCountDelta,
      negativeDisplay: "absolute",
    },
  );
  const streakTrend = formatStreakTrend(stats.currentStreak);

  return (
    <PageLayout
      action={
        <div className="flex items-center gap-3">
          <SegmentedTabs
            className="shadow-[0_8px_22px_rgba(58,46,42,0.04)]"
            onChange={(value) => {
              if (value !== "custom") {
                setPeriod(value);
              }
            }}
            options={PERIOD_OPTIONS}
            value={period}
          />
          <AppButton aria-label="选择日期" disabled size="icon" variant="ghost">
            <CalendarDays className="size-5" />
          </AppButton>
        </div>
      }
      subtitle="每一颗番茄，都是成长的记录"
      title="专注统计"
    >
      <div className="grid grid-cols-[minmax(0,1fr)_330px] gap-6 max-xl:grid-cols-1">
        <div className="flex min-w-0 flex-col gap-5">
          <div className="grid grid-cols-4 gap-5 max-lg:grid-cols-2 max-sm:grid-cols-1">
            <StatCard
              icon={<StatCardIcon src={iconClockFocus} />}
              label="总专注时长"
              trend={totalFocusTrend.text}
              trendTone={totalFocusTrend.tone}
              value={
                <AnimatedStatValue
                  decimalPlaces={stats.totalMinutes > 0 ? 1 : undefined}
                  unit="h"
                  value={stats.totalMinutes > 0 ? stats.totalMinutes / 60 : 0}
                />
              }
            />
            <StatCard
              icon={<StatCardIcon src={iconTomatoCount} />}
              label="完成番茄数"
              trend={totalPomodorosTrend.text}
              trendTone={totalPomodorosTrend.tone}
              value={<AnimatedStatValue unit="个" value={stats.totalPomodoros} />}
            />
            <StatCard
              icon={<StatCardIcon src={iconTaskComplete} />}
              label="完成任务数"
              tone="success"
              trend={completedTasksTrend.text}
              trendTone={completedTasksTrend.tone}
              value={<AnimatedStatValue unit="个" value={stats.completedTasks} />}
            />
            <StatCard
              icon={<StatCardIcon src={iconCalendarStreak} />}
              label="连续打卡天数"
              tone="warning"
              trend={streakTrend.text}
              trendTone={streakTrend.tone}
              value={<AnimatedStatValue unit="天" value={stats.currentStreak} />}
            />
          </div>

          <div className="grid grid-cols-[1.25fr_0.75fr] gap-5 max-lg:grid-cols-1">
            <FocusTrendPanel period={period} sessions={sessions} />
            <TaskCompletionPanel
              completionRate={stats.completionRate}
              hasData={stats.periodTasks.length > 0}
              highPriorityCompleted={stats.highPriorityCompleted}
              taskBreakdown={stats.taskBreakdown}
              taskTotal={stats.periodTasks.length}
            />
          </div>

          <div className="grid grid-cols-[1.2fr_0.7fr_1.3fr] gap-5 max-[1500px]:grid-cols-[1.2fr_0.9fr] max-lg:grid-cols-1">
            <EfficientTimePanel
              buckets={stats.efficientBuckets}
              hasData={stats.periodFocusSessions.length > 0}
            />
            <DurationDistributionPanel
              distribution={stats.durationDistribution}
              hasData={stats.periodFocusSessions.length > 0}
              totalMinutes={stats.totalMinutes}
            />
            <FocusEfficiencyChangePanel
              currentLabel={stats.currentPeriodLabel}
              comparisonLabel={stats.comparisonTarget}
              trend={stats.focusEfficiencyTrend}
            />
          </div>
        </div>

        <aside className="flex min-w-0 flex-col gap-5">
          <AchievementPanel
            achievements={achievementCenter.achievements.slice(0, 6)}
            onViewAll={() => setAchievementDrawerOpen(true)}
          />
          <GrowthSummaryCard
            deltaMinutes={stats.periodMinutes - stats.previousPeriodMinutes}
            period={period}
          />
        </aside>
      </div>

      <AchievementDrawer
        achievements={achievementCenter.achievements}
        onClose={() => setAchievementDrawerOpen(false)}
        open={achievementDrawerOpen}
        summary={achievementCenter.summary}
      />
    </PageLayout>
  );
}
