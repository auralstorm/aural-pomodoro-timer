import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import emptyStats from "@/assets/empty/illus-empty-stats.png";
import { AppCard } from "@/components/common/AppCard";
import { EmptyState } from "@/components/common/EmptyState";

import {
  DONUT_CENTER_CLASS,
  DONUT_CENTER_LABEL_CLASS,
  DONUT_CENTER_VALUE_CLASS,
  RESPONSIVE_CHART_INITIAL_DIMENSION,
  STATS_EMPTY_STATE_CLASS,
  TOP_STATS_CARD_MIN_HEIGHT,
  TOP_STATS_CONTENT_HEIGHT,
  getChartTooltipProps,
} from "./constants";
import { LegendRow } from "./StatisticsHelpers";

export function TaskCompletionPanel({
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
                <strong
                  className={`${DONUT_CENTER_VALUE_CLASS} text-3xl font-black text-[var(--color-success)]`}
                >
                  {completionRate}%
                </strong>
                <span className={`${DONUT_CENTER_LABEL_CLASS} font-semibold text-muted-foreground`}>
                  任务完成率
                </span>
              </div>
            </div>
            <div className="space-y-4 text-sm">
              <LegendRow
                color="var(--color-success)"
                label="已完成任务数"
                value={`${completed} 个`}
              />
              <LegendRow
                color="var(--color-warning)"
                label="未完成任务数"
                value={`${unfinished} 个`}
              />
              <LegendRow
                color="var(--color-tomato-red)"
                label="高优先级完成数"
                value={`${highPriorityCompleted} 个`}
              />
              <div className="pt-1 text-muted-foreground">
                较上周{" "}
                <span className="font-bold text-[var(--color-success)]">+{completionRate}% </span>
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
