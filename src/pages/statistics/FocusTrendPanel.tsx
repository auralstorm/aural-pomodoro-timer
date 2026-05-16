import { useMemo } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import emptyStats from "@/assets/empty/illus-empty-stats.png";
import { AppCard } from "@/components/common/AppCard";
import { EmptyState } from "@/components/common/EmptyState";
import type { PomodoroSession } from "@/types/timer";

import {
  FOCUS_TREND_CHART_MARGIN,
  FOCUS_TREND_X_AXIS_HEIGHT,
  FOCUS_TREND_X_AXIS_TICK_MARGIN,
  FOCUS_TREND_Y_TICKS,
  RESPONSIVE_CHART_INITIAL_DIMENSION,
  STATS_EMPTY_STATE_CLASS,
  TOP_STATS_CARD_MIN_HEIGHT,
  TOP_STATS_CONTENT_HEIGHT,
  getChartTooltipProps,
} from "./constants";
import { buildFocusTrend, getPeriodCopy } from "./statisticsModel";
import type { ActivePeriod } from "./types";

export function FocusTrendPanel({
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
