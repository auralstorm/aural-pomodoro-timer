import { useMemo, useState, type CSSProperties } from "react";
import dayjs from "dayjs";
import {
  CalendarDays,
  Info,
  Star,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import iconCalendarStreak from "@/assets/icons/icon-calendar-streak.svg";
import iconClockFocus from "@/assets/icons/icon-clock-focus.svg";
import iconTaskComplete from "@/assets/icons/icon-task-complete.svg";
import iconTomatoCount from "@/assets/icons/icon-tomato-count.svg";
import emptyStats from "@/assets/empty/illus-empty-stats.png";
import illusGrowth from "@/assets/illustrations/illus-stats-growth.png";
import { AppButton } from "@/components/common/AppButton";
import { AppCard } from "@/components/common/AppCard";
import { EmptyState } from "@/components/common/EmptyState";
import { RollingNumber } from "@/components/common/RollingNumber";
import {
  SegmentedTabs,
  type SegmentedTabOption,
} from "@/components/common/SegmentedTabs";
import { PageLayout } from "@/components/layout/PageLayout";
import { StatCard, type StatCardTrendTone } from "@/components/stats/StatCard";
import { AchievementDrawer } from "@/features/achievements/components/AchievementDrawer";
import { useAchievements } from "@/features/achievements/hooks/useAchievements";
import type { AchievementItem } from "@/features/achievements/types";
import { useStatsStore } from "@/stores/statsStore";
import { useTaskStore } from "@/stores/taskStore";
import type { Task } from "@/types/task";
import type { PomodoroSession } from "@/types/timer";
import {
  calculateCompletionRate,
  calculateWeeklyTrend,
  getCurrentStreakDays,
} from "@/utils/stats";

type Period = "today" | "week" | "month" | "custom";
type ActivePeriod = Exclude<Period, "custom">;
type TrendCopyOptions = {
  comparisonTarget: string;
  currentPeriodLabel: string;
  emptyNoun: string;
  formatAbsoluteDelta?: (value: number) => string;
  negativeDisplay?: "absolute" | "percent";
};
type TrendInfo = {
  text: string;
  tone: StatCardTrendTone;
};
type FocusEfficiencyPoint = {
  currentMinutes: number;
  label: string;
  previousMinutes: number;
};

const PERIOD_OPTIONS: SegmentedTabOption<Period>[] = [
  { value: "today", label: "今日" },
  { value: "week", label: "本周" },
  { value: "month", label: "本月" },
  { value: "custom", label: "自定义", disabled: true },
];

export const FOCUS_TREND_Y_TICKS = [0, 120, 240, 360];
export const FOCUS_TREND_CHART_MARGIN = { bottom: 12, left: -18, right: 8, top: 18 };
export const FOCUS_TREND_X_AXIS_HEIGHT = 34;
export const FOCUS_TREND_X_AXIS_TICK_MARGIN = 12;
export const TOP_STATS_CARD_MIN_HEIGHT = "min-h-[320px]";
export const TOP_STATS_CONTENT_HEIGHT = "h-[230px]";
export const BOTTOM_STATS_CARD_MIN_HEIGHT = "min-h-[300px]";
export const BOTTOM_STATS_CONTENT_HEIGHT = "h-[220px]";
export const EFFICIENT_TIME_ROW_CLASS =
  "grid grid-cols-[160px_minmax(0,1fr)_36px_14px] items-center gap-2";
export const DURATION_DISTRIBUTION_CARD_CLASS = BOTTOM_STATS_CARD_MIN_HEIGHT;
export const EFFICIENT_TIME_CONTENT_CLASS = `flex ${BOTTOM_STATS_CONTENT_HEIGHT} flex-col justify-center gap-7`;
export const DURATION_DISTRIBUTION_CONTENT_CLASS =
  `grid ${BOTTOM_STATS_CONTENT_HEIGHT} grid-cols-[160px_1fr] items-center gap-4`;
export const FOCUS_EFFICIENCY_CONTENT_CLASS = `h-[220px]`;
export const DONUT_CENTER_CLASS =
  "pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-0 text-center";
export const DONUT_CENTER_VALUE_CLASS = "block leading-none";
export const DONUT_CENTER_LABEL_CLASS = "mt-0 block text-xs leading-none";

const STATS_EMPTY_STATE_CLASS = "h-full w-full justify-center p-4";
const CHART_TOOLTIP_WRAPPER_STYLE: CSSProperties = {
  outline: "none",
  zIndex: 20,
};
const CHART_TOOLTIP_CONTENT_STYLE: CSSProperties = {
  background: "var(--color-card-bg)",
  border: "1px solid var(--color-tomato-light)",
  borderRadius: 12,
  boxShadow: "0 16px 36px rgba(255, 107, 107, 0.16)",
  padding: "10px 12px",
};
const CHART_TOOLTIP_LABEL_STYLE: CSSProperties = {
  color: "var(--color-muted-foreground)",
  fontSize: 12,
  fontWeight: 600,
  marginBottom: 4,
};
const CHART_TOOLTIP_ITEM_STYLE: CSSProperties = {
  color: "var(--color-foreground)",
  fontSize: 12,
  fontWeight: 700,
  padding: 0,
};

const WEEKDAY_LABELS = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
const RESPONSIVE_CHART_INITIAL_DIMENSION = { height: 1, width: 1 };

function getChartTooltipProps() {
  return {
    contentStyle: CHART_TOOLTIP_CONTENT_STYLE,
    itemStyle: CHART_TOOLTIP_ITEM_STYLE,
    labelStyle: CHART_TOOLTIP_LABEL_STYLE,
    wrapperStyle: CHART_TOOLTIP_WRAPPER_STYLE,
  };
}

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
    formatAbsoluteDelta: formatMinutesDelta,
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

          {/* <StatisticsDataGuide hasPeriodData={stats.periodFocusSessions.length > 0} /> */}
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

      {/* <TipBar>稳定的专注习惯，比偶尔的高强度冲刺更重要。</TipBar> */}
      <AchievementDrawer
        achievements={achievementCenter.achievements}
        onClose={() => setAchievementDrawerOpen(false)}
        open={achievementDrawerOpen}
        summary={achievementCenter.summary}
      />
    </PageLayout>
  );
}

function StatCardIcon({ src }: { src: string }) {
  return <img alt="" className={`size-16 object-contain`} draggable={false} src={src} />;
}

function AnimatedStatValue({
  value,
  unit,
  decimalPlaces,
}: {
  value: number | string;
  unit: string;
  decimalPlaces?: number;
}) {
  return (
    <span className="inline-flex gap-1 leading-none">
      <RollingNumber
        aria-label={`${value}${unit}`}
        className="leading-none"
        decimalPlaces={decimalPlaces}
        value={value}
      />
      <span className="leading-none">{unit}</span>
    </span>
  );
}

function FocusTrendPanel({
  period,
  sessions,
}: {
  period: ActivePeriod;
  sessions: PomodoroSession[];
}) {
  const trend = useMemo(() => buildFocusTrend(sessions, period), [period, sessions]);
  const hasData = trend.some((point) => point.minutes > 0);

  return (
    <AppCard className={TOP_STATS_CARD_MIN_HEIGHT}>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-black">{getPeriodCopy(period).trendTitle}</h2>
      </div>
      <div className={TOP_STATS_CONTENT_HEIGHT}>
        {hasData ? (
          <ResponsiveContainer
            height="100%"
            initialDimension={RESPONSIVE_CHART_INITIAL_DIMENSION}
            minHeight={1}
            minWidth={1}
            width="100%"
          >
            <AreaChart data={trend} margin={FOCUS_TREND_CHART_MARGIN}>
              <defs>
                <linearGradient id="focusTrendFill" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-tomato-red)" stopOpacity={0.24} />
                  <stop offset="100%" stopColor="var(--color-tomato-red)" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="var(--color-divider)" strokeDasharray="4 8" vertical={false} />
              <XAxis
                axisLine={false}
                dataKey="label"
                height={FOCUS_TREND_X_AXIS_HEIGHT}
                tickLine={false}
                tickMargin={FOCUS_TREND_X_AXIS_TICK_MARGIN}
              />
              <YAxis
                axisLine={false}
                domain={[0, 360]}
                tickFormatter={(value) => `${value / 60}h`}
                ticks={FOCUS_TREND_Y_TICKS}
                tickLine={false}
              />
              <Tooltip
                {...getChartTooltipProps()}
                formatter={(value) => [`${Number(value)} 分钟`, "专注时长"]}
              />
              <Area
                activeDot={{ r: 6, strokeWidth: 3 }}
                dataKey="minutes"
                dot={{
                  fill: "white",
                  r: 4,
                  stroke: "var(--color-tomato-red)",
                  strokeWidth: 2,
                }}
                fill="url(#focusTrendFill)"
                stroke="var(--color-tomato-red)"
                strokeWidth={3}
                type="monotone"
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <EmptyState
            className={STATS_EMPTY_STATE_CLASS}
            description="开始第一轮专注后，这里会展示你的趋势。"
            image={emptyStats}
            title="暂无统计数据"
          />
        )}
      </div>
    </AppCard>
  );
}

function TaskCompletionPanel({
  completionRate,
  hasData,
  highPriorityCompleted,
  taskBreakdown,
  taskTotal,
}: {
  completionRate: number;
  hasData: boolean;
  highPriorityCompleted: number;
  taskBreakdown: Array<{ name: string; value: number; color: string }>;
  taskTotal: number;
}) {
  const completed = taskBreakdown.find((item) => item.name === "已完成任务数")?.value ?? 0;
  const unfinished = Math.max(0, taskTotal - completed);

  return (
    <AppCard className={TOP_STATS_CARD_MIN_HEIGHT}>
      <h2 className="mb-4 text-lg font-black">任务完成分析</h2>
      <div className={TOP_STATS_CONTENT_HEIGHT}>
        {hasData ? (
        <div className="grid h-full grid-cols-[160px_1fr] items-center gap-4">
          <div className="relative h-36">
            <ResponsiveContainer
              height="100%"
              initialDimension={RESPONSIVE_CHART_INITIAL_DIMENSION}
              minHeight={1}
              minWidth={1}
              width="100%"
            >
              <PieChart>
                <Pie
                  cornerRadius={8}
                  data={taskBreakdown}
                  dataKey="value"
                  innerRadius={48}
                  outerRadius={70}
                  paddingAngle={3}
                >
                  {taskBreakdown.map((entry) => (
                    <Cell fill={entry.color} key={entry.name} />
                  ))}
                </Pie>
                <Tooltip
                  {...getChartTooltipProps()}
                  formatter={(value, name) => [`${Number(value)} 个`, name]}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className={DONUT_CENTER_CLASS}>
              <strong className={`${DONUT_CENTER_VALUE_CLASS} text-3xl font-black text-[var(--color-success)]`}>
                {completionRate}%
              </strong>
              <span className={`${DONUT_CENTER_LABEL_CLASS} font-semibold text-muted-foreground`}>
                任务完成率
              </span>
            </div>
          </div>
          <div className="space-y-4 text-sm">
            <LegendRow color="var(--color-success)" label="已完成任务数" value={`${completed} 个`} />
            <LegendRow color="var(--color-warning)" label="未完成任务数" value={`${unfinished} 个`} />
            <LegendRow color="var(--color-tomato-red)" label="高优先级完成数" value={`${highPriorityCompleted} 个`} />
            <div className="pt-1 text-muted-foreground">
              较上周 <span className="font-bold text-[var(--color-success)]">+{completionRate}% </span>
            </div>
          </div>
        </div>
        ) : (
          <EmptyState
            className={STATS_EMPTY_STATE_CLASS}
            description="创建并完成任务后，这里会展示你的完成率。"
            image={emptyStats}
            title="暂无任务完成数据"
          />
        )}
      </div>
    </AppCard>
  );
}

function EfficientTimePanel({
  buckets,
  hasData,
}: {
  buckets: Array<{ label: string; minutes: number; star?: boolean }>;
  hasData: boolean;
}) {
  const max = Math.max(...buckets.map((bucket) => bucket.minutes), 1);

  return (
    <AppCard className={BOTTOM_STATS_CARD_MIN_HEIGHT}>
      <div className="mb-4 flex items-center gap-2">
        <h2 className="text-lg font-black">高效时段</h2>
        <Info className="size-4 text-muted-foreground" />
        {hasData ? (
          <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-[var(--color-tomato-soft)] px-3 py-1 text-xs font-bold text-primary">
            <Star className="size-3 fill-current" />
            最佳时段
          </span>
        ) : null}
      </div>
      <div className={EFFICIENT_TIME_CONTENT_CLASS}>
        {hasData ? (
          buckets.map((bucket) => (
            <div className={EFFICIENT_TIME_ROW_CLASS} key={bucket.label}>
              <span className="whitespace-nowrap text-sm font-medium text-foreground">{bucket.label}</span>
              <div className="h-3 overflow-hidden rounded-full bg-[var(--color-divider)]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[var(--color-tomato-red)] to-[var(--color-danger)]"
                  style={{ width: `${Math.max(0, (bucket.minutes / max) * 100)}%` }}
                />
              </div>
              <span className="text-right text-sm font-semibold text-muted-foreground">
                {formatHours(bucket.minutes)}
              </span>
              {bucket.star ? <Star className="size-4 fill-[var(--color-warning)] text-[var(--color-warning)]" /> : <span />}
            </div>
          ))
        ) : (
          <EmptyState
            className={STATS_EMPTY_STATE_CLASS}
            description="完成专注后，这里会展示你的最佳专注时间。"
            image={emptyStats}
            title="暂无高效时段数据"
          />
        )}
      </div>
    </AppCard>
  );
}

function DurationDistributionPanel({
  distribution,
  hasData,
  totalMinutes,
}: {
  distribution: Array<{ name: string; minutes: number; color: string; percent: number }>;
  hasData: boolean;
  totalMinutes: number;
}) {
  return (
    <AppCard className={DURATION_DISTRIBUTION_CARD_CLASS}>
      <h2 className="mb-2 text-lg font-black">专注时长分布</h2>
      <div className={BOTTOM_STATS_CONTENT_HEIGHT}>
        {hasData ? (
        <div className="grid h-full grid-cols-[160px_1fr] items-center gap-4">
          <div className="relative h-36">
            <ResponsiveContainer
              height="100%"
              initialDimension={RESPONSIVE_CHART_INITIAL_DIMENSION}
              minHeight={1}
              minWidth={1}
              width="100%"
            >
              <PieChart>
                <Pie
                  data={distribution}
                  dataKey="minutes"
                  innerRadius={48}
                  outerRadius={70}
                  paddingAngle={2}
                >
                  {distribution.map((entry) => (
                    <Cell fill={entry.color} key={entry.name} />
                  ))}
                </Pie>
                <Tooltip
                  {...getChartTooltipProps()}
                  formatter={(value, name, item) => {
                    const payload = item?.payload as { percent?: number } | undefined;
                    const percent = payload?.percent ?? 0;
                    return [`${formatHours(Number(value))} (${percent}%)`, name];
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className={DONUT_CENTER_CLASS}>
              <strong className={`${DONUT_CENTER_VALUE_CLASS} text-xl font-black`}>
                {formatHours(totalMinutes)}
              </strong>
              <span className={`${DONUT_CENTER_LABEL_CLASS} text-muted-foreground`}>总时长</span>
            </div>
          </div>
          <div className="flex h-full flex-col justify-center gap-4">
            {distribution.map((item) => (
              <LegendRow
                color={item.color}
                key={item.name}
                label={item.name}
                value={formatHours(item.minutes)}
              />
            ))}
          </div>
        </div>
        ) : (
          <EmptyState
            className={STATS_EMPTY_STATE_CLASS}
            description="完成专注后，这里会展示不同番茄长度的占比。"
            image={emptyStats}
            title="暂无时长分布"
          />
        )}
      </div>
    </AppCard>
  );
}

function FocusEfficiencyChangePanel({
  currentLabel,
  comparisonLabel,
  trend,
}: {
  currentLabel: string;
  comparisonLabel: string;
  trend: FocusEfficiencyPoint[];
}) {
  const hasData = trend.some((point) => point.currentMinutes > 0 || point.previousMinutes > 0);
  const axisConfig = getFocusEfficiencyAxisConfig(trend);

  return (
    <AppCard className={BOTTOM_STATS_CARD_MIN_HEIGHT}>
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-lg font-black">专注效率变化</h2>
        <div className="flex items-center gap-3 text-xs font-semibold text-muted-foreground">
          <TrendLegend label={currentLabel} tone="current" />
          <TrendLegend label={comparisonLabel} tone="previous" />
        </div>
      </div>
      <div className={FOCUS_EFFICIENCY_CONTENT_CLASS}>
        {hasData ? (
          <ResponsiveContainer
            height="100%"
            initialDimension={RESPONSIVE_CHART_INITIAL_DIMENSION}
            minHeight={1}
            minWidth={1}
            width="100%"
          >
            <LineChart data={trend} margin={{ bottom: 10, left: -20, right: 6, top: 8 }}>
              <CartesianGrid stroke="var(--color-divider)" strokeDasharray="4 8" vertical={false} />
              <XAxis
                axisLine={false}
                dataKey="label"
                height={28}
                interval={0}
                tickLine={false}
                tick={{ fontSize: 10 }}
                tickMargin={8}
              />
              <YAxis
                axisLine={false}
                domain={[0, axisConfig.max]}
                tick={{ fontSize: 10 }}
                tickFormatter={formatFocusEfficiencyTick}
                ticks={axisConfig.ticks}
                tickLine={false}
              />
              <Tooltip
                {...getChartTooltipProps()}
                formatter={(value, name) => [
                  `${Number(value)} 分钟`,
                  name === "currentMinutes" ? currentLabel : comparisonLabel,
                ]}
              />
              <Line
                activeDot={{ r: 5, strokeWidth: 2 }}
                dataKey="previousMinutes"
                dot={{ r: 3, strokeWidth: 2 }}
                name="previousMinutes"
                stroke="rgba(143, 137, 160, 0.68)"
                strokeWidth={2}
                type="monotone"
              />
              <Line
                activeDot={{ r: 5, strokeWidth: 2 }}
                dataKey="currentMinutes"
                dot={{ r: 3, strokeWidth: 2 }}
                name="currentMinutes"
                stroke="var(--color-tomato-red)"
                strokeWidth={2.5}
                type="monotone"
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <EmptyState
            className={STATS_EMPTY_STATE_CLASS}
            description={`完成专注后，这里会展示${currentLabel}和${comparisonLabel}的效率变化。`}
            image={emptyStats}
            title="暂无效率变化数据"
          />
        )}
      </div>
    </AppCard>
  );
}

function TrendLegend({
  label,
  tone,
}: {
  label: string;
  tone: "current" | "previous";
}) {
  const colorClass =
    tone === "current" ? "bg-[var(--color-tomato-red)]" : "bg-[rgba(143,137,160,0.68)]";

  return (
    <span className="inline-flex items-center gap-1.5">
      <i className={`h-[2px] w-4 rounded-full ${colorClass}`} />
      <span>{label}</span>
    </span>
  );
}

function AchievementPanel({
  achievements,
  onViewAll,
}: {
  achievements: AchievementItem[];
  onViewAll: () => void;
}) {
  return (
    <AppCard className="min-h-[430px]">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-black">我的成就</h2>
        <button
          className="text-sm font-semibold text-muted-foreground transition hover:text-primary"
          onClick={onViewAll}
          type="button"
        >
          查看全部
        </button>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {achievements.map((achievement) => (
          <div
            className={[
              "flex min-h-32 flex-col items-center justify-center rounded-[var(--radius-lg)] border p-4 text-center transition",
                achievement.unlocked
                  ? "border-[var(--color-tomato-light)] bg-[var(--color-tomato-soft)]"
                  : "border-border bg-muted/55 text-muted-foreground grayscale",
            ].join(" ")}
            key={achievement.id}
          >
            <div
              className={[
                "mb-2 grid size-14 place-items-center rounded-[18px]",
                achievement.unlocked
                  ? "bg-[var(--color-tomato-soft)]"
                  : "bg-muted",
              ].join(" ")}
            >
              <img
                alt=""
                className="size-12 object-contain"
                src={achievement.unlocked ? achievement.unlockedIcon : achievement.lockedIcon}
              />
            </div>
            <strong className="text-sm font-black text-foreground">{achievement.title}</strong>
            <span className="mt-1 text-xs text-muted-foreground">
              {achievement.unlocked ? "已解锁" : "未解锁"}
            </span>
          </div>
        ))}
      </div>
    </AppCard>
  );
}

function GrowthSummaryCard({
  deltaMinutes,
  period,
}: {
  deltaMinutes: number;
  period: ActivePeriod;
}) {
  const absDelta = Math.abs(deltaMinutes);
  const isPositive = deltaMinutes >= 0;
  const copy = getPeriodCopy(period);

  return (
    <AppCard className="relative h-[240px] overflow-hidden border-[color-mix(in_srgb,var(--primary)_18%,var(--border))] bg-[linear-gradient(145deg,color-mix(in_srgb,var(--color-tomato-soft)_72%,var(--card))_0%,color-mix(in_srgb,var(--card)_88%,var(--color-cream-orange))_100%)] p-0 dark:border-[color-mix(in_srgb,var(--primary)_22%,var(--border))] dark:bg-[linear-gradient(145deg,color-mix(in_srgb,var(--card)_88%,var(--color-tomato-soft))_0%,color-mix(in_srgb,var(--card)_78%,black)_100%)]">
      <div className="px-6 pt-6">
        <h2 className="text-xl font-black">
          {copy.growthCurrent}比{copy.growthPrevious}
          {isPositive ? "多" : "少"}专注了
          <span className="font-black text-primary dark:text-[var(--color-warning)]">{formatMinutesDelta(absDelta)}</span>
        </h2>
        <p className="mt-3 max-w-[220px] text-sm leading-6 text-muted-foreground dark:text-[color-mix(in_srgb,var(--foreground)_76%,transparent)]">
          继续保持，你正在建立稳定<br/>
          的专注习惯！
        </p>
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-[linear-gradient(180deg,transparent_0%,color-mix(in_srgb,var(--primary)_10%,transparent)_100%)] dark:bg-[linear-gradient(180deg,transparent_0%,color-mix(in_srgb,var(--primary)_14%,transparent)_100%)]" />
      <img alt="" className="-mt-10 ml-auto h-48 object-contain right-0 relative z-[1]" src={illusGrowth} />
    </AppCard>
  );
}

function LegendRow({
  color,
  label,
  value,
}: {
  color: string;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3 text-sm">
      <span className="inline-flex min-w-0 items-center gap-2 text-foreground">
        <i className="size-2.5 rounded-full" style={{ backgroundColor: color }} />
        <span className="truncate">{label}</span>
      </span>
      <strong className="shrink-0 font-bold text-foreground">{value}</strong>
    </div>
  );
}

function buildFocusTrend(sessions: PomodoroSession[], period: ActivePeriod) {
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

function buildStatisticsModel(
  sessions: PomodoroSession[],
  tasks: Task[],
  period: ActivePeriod,
) {
  const range = getPeriodRange(period);
  const copy = getPeriodCopy(period);
  const focusSessions = sessions.filter((session) => session.mode === "focus" && session.completed);
  const periodFocusSessions = filterSessionsForRange(focusSessions, range.currentStart, range.currentEnd);
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
  const totalMinutes = periodFocusSessions.reduce((sum, session) => sum + session.durationMinutes, 0);
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

type PeriodRange = {
  currentStart: dayjs.Dayjs;
  currentEnd: dayjs.Dayjs;
  previousStart: dayjs.Dayjs;
  previousEnd: dayjs.Dayjs;
};

function getPeriodRange(period: ActivePeriod): PeriodRange {
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

function getPeriodCopy(period: ActivePeriod) {
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

function filterSessionsForRange(
  sessions: PomodoroSession[],
  start: dayjs.Dayjs,
  end: dayjs.Dayjs,
) {
  return sessions.filter((session) => isWithinRange(dayjs(session.endedAt), start, end));
}

function filterTasksForRange(tasks: Task[], start: dayjs.Dayjs, end: dayjs.Dayjs) {
  return tasks.filter((task) =>
    [task.createdAt, task.updatedAt, task.completedAt]
      .filter(Boolean)
      .some((date) => isWithinRange(dayjs(date), start, end)),
  );
}

function isWithinRange(value: dayjs.Dayjs, start: dayjs.Dayjs, end: dayjs.Dayjs) {
  return (
    value.isSame(start) ||
    value.isSame(end) ||
    (value.isAfter(start) && value.isBefore(end))
  );
}

function buildTaskBreakdown(tasks: Task[]) {
  const completed = tasks.filter((task) => task.status === "completed").length;
  const pending = tasks.filter((task) => task.status === "pending").length;
  const inProgress = tasks.filter((task) => task.status === "inProgress").length;

  return [
    { color: "var(--color-success)", name: "已完成任务数", value: completed },
    { color: "var(--color-warning)", name: "待开始任务数", value: pending },
    { color: "var(--color-tomato-red)", name: "进行中任务数", value: inProgress },
  ].filter((item) => item.value > 0);
}

function buildEfficientBuckets(sessions: PomodoroSession[]) {
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

function buildDurationDistribution(sessions: PomodoroSession[]) {
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

function buildFocusEfficiencyTrend(
  sessions: PomodoroSession[],
  period: ActivePeriod,
): FocusEfficiencyPoint[] {
  const range = getPeriodRange(period);

  if (period === "today") {
    const currentBuckets = buildHourlyBuckets(filterSessionsForRange(sessions, range.currentStart, range.currentEnd));
    const previousBuckets = buildHourlyBuckets(filterSessionsForRange(sessions, range.previousStart, range.previousEnd));

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

function getFocusEfficiencyAxisConfig(trend: FocusEfficiencyPoint[]) {
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

function formatFocusEfficiencyTick(value: number) {
  if (value === 0) {
    return "0";
  }

  if (value < 60) {
    return `${value}m`;
  }

  const hours = value / 60;
  return Number.isInteger(hours) ? `${hours}h` : `${hours.toFixed(1)}h`;
}

function formatHours(minutes: number) {
  if (minutes <= 0) return "0h";
  return `${(minutes / 60).toFixed(1)}h`;
}

function formatMinutesDelta(minutes: number) {
  if (minutes >= 60) {
    return `${(minutes / 60).toFixed(1)} 小时`;
  }
  return `${minutes} 分钟`;
}

function formatCountDelta(value: number) {
  return `${value} 个`;
}

function formatMetricTrend(
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

function formatStreakTrend(currentStreak: number): TrendInfo {
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
