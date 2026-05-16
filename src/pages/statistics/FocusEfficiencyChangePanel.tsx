import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import emptyStats from "@/assets/empty/illus-empty-stats.png";
import { AppCard } from "@/components/common/AppCard";
import { EmptyState } from "@/components/common/EmptyState";

import {
  BOTTOM_STATS_CARD_MIN_HEIGHT,
  FOCUS_EFFICIENCY_CONTENT_CLASS,
  RESPONSIVE_CHART_INITIAL_DIMENSION,
  STATS_EMPTY_STATE_CLASS,
  getChartTooltipProps,
} from "./constants";
import { formatFocusEfficiencyTick, getFocusEfficiencyAxisConfig } from "./statisticsModel";
import type { FocusEfficiencyPoint } from "./types";

export function FocusEfficiencyChangePanel({
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

function TrendLegend({ label, tone }: { label: string; tone: "current" | "previous" }) {
  const colorClass =
    tone === "current" ? "bg-[var(--color-tomato-red)]" : "bg-[rgba(143,137,160,0.68)]";

  return (
    <span className="inline-flex items-center gap-1.5">
      <i className={`h-[2px] w-4 rounded-full ${colorClass}`} />
      <span>{label}</span>
    </span>
  );
}
