import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import emptyStats from "@/assets/empty/illus-empty-stats.png";
import { AppCard } from "@/components/common/AppCard";
import { EmptyState } from "@/components/common/EmptyState";
import { formatFocusHours } from "@/utils/time";

import {
  DONUT_CENTER_CLASS,
  DONUT_CENTER_LABEL_CLASS,
  DONUT_CENTER_VALUE_CLASS,
  DURATION_DISTRIBUTION_CARD_CLASS,
  BOTTOM_STATS_CONTENT_HEIGHT,
  RESPONSIVE_CHART_INITIAL_DIMENSION,
  STATS_EMPTY_STATE_CLASS,
  getChartTooltipProps,
} from "./constants";
import { LegendRow } from "./StatisticsHelpers";

export function DurationDistributionPanel({
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
                      return [`${formatFocusHours(Number(value))} (${percent}%)`, name];
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className={DONUT_CENTER_CLASS}>
                <strong className={`${DONUT_CENTER_VALUE_CLASS} text-xl font-black`}>
                  {formatFocusHours(totalMinutes)}
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
                  value={formatFocusHours(item.minutes)}
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
