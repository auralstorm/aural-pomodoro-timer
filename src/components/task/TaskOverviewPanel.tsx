import iconCalendarStreak from "@/assets/icons/icon-calendar-streak.svg";
import iconTaskComplete from "@/assets/icons/icon-task-complete.svg";
import iconTomatoCount from "@/assets/icons/icon-tomato-count.svg";
import { AppCard } from "@/components/common/AppCard";
import { ProgressRing } from "@/components/common/ProgressRing";
import { RollingNumber } from "@/components/common/RollingNumber";
import { cn } from "@/lib/utils";

import { clampPercent, formatMinutesToChinese } from "./task-overview.utils";

type TaskOverviewPanelProps = {
  totalTasks: number;
  completedCount: number;
  completionRate: number;
  completionRateDelta?: number;
  totalEstimatedPomodoros: number;
  estimatedFocusMinutes: number;
  estimatedPomodoroDelta?: number;
  totalCompletedPomodoros: number;
  totalCompletedFocusMinutes: number;
  completedPomodoroDelta?: number;
  remainingCount: number;
  remainingCountDelta?: number;
};

export function TaskOverviewPanel({
  totalTasks,
  completedCount,
  completionRate,
  completionRateDelta,
  totalEstimatedPomodoros,
  estimatedFocusMinutes,
  estimatedPomodoroDelta,
  totalCompletedPomodoros,
  totalCompletedFocusMinutes,
  completedPomodoroDelta,
  remainingCount,
  remainingCountDelta,
}: TaskOverviewPanelProps) {
  return (
    <aside>
      <AppCard className="flex flex-col gap-4 p-5">
        <header className="flex items-center gap-3">
         
            <img alt="" className="size-10 object-contain" src={iconTomatoCount} />
          
          <h3 className="text-[20px] font-black tracking-tight">任务概览</h3>
        </header>

        <div className="flex flex-col gap-4">
          <CompletionOverviewCard
            completedCount={completedCount}
            completionRate={completionRate}
            delta={completionRateDelta}
            totalTasks={totalTasks}
          />

          <StatOverviewCard
            description={`预计专注时间 ${formatMinutesToChinese(estimatedFocusMinutes)}`}
            delta={estimatedPomodoroDelta}
            iconSrc={iconTomatoCount}
            title="今日预计番茄数"
            unit="个"
            value={totalEstimatedPomodoros}
          />

          <StatOverviewCard
            description={`专注时长 ${formatMinutesToChinese(totalCompletedFocusMinutes)}`}
            delta={completedPomodoroDelta}
            iconSrc={iconTaskComplete}
            title="已完成番茄数"
            unit="个"
            value={totalCompletedPomodoros}
          />

          <StatOverviewCard
            description="继续加油，完成更多小目标！"
            delta={remainingCountDelta}
            deltaDirection="down"
            iconSrc={iconCalendarStreak}
            title="剩余任务数"
            unit="个"
            value={remainingCount}
          />
        </div>
      </AppCard>
    </aside>
  );
}

function CompletionOverviewCard({
  completionRate,
  completedCount,
  totalTasks,
  delta,
}: {
  completionRate: number;
  completedCount: number;
  totalTasks: number;
  delta?: number;
}) {
  return (
    <div className="rounded-[28px] border border-border bg-background px-5 py-4 shadow-[0_10px_26px_rgba(255,107,107,0.04)]">
      <div className="grid grid-cols-[100px_minmax(0,1fr)] items-center gap-4">
        <ProgressRing className="justify-self-start" size={80} strokeWidth={10} value={completionRate}>
          <div className="space-y-0.5">
            <div className="flex items-center justify-center text-[18px] font-black leading-none text-primary">
              <RollingNumber
                className="text-[18px] font-black leading-none"
                value={clampPercent(completionRate)}
              />
              <span className="leading-none">%</span>
            </div>
          </div>
        </ProgressRing>

        <div className="min-w-0">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-sm font-bold text-foreground">今日任务完成率</h3>
            <DeltaText delta={delta} suffix="%" />
          </div>

          <div className="mt-2 h-2 overflow-hidden rounded-full bg-[rgba(107,203,119,0.12)]">
            <div
              className="h-full rounded-full bg-[linear-gradient(90deg,#6BCB77_0%,#6BCB77_64%,#4DB565_100%)] transition-[width] duration-500"
              style={{ width: `${clampPercent(completionRate)}%` }}
            />
          </div>

          <p className="mt-3 text-sm font-medium text-muted-foreground">
            {completedCount} / {totalTasks} 个任务已完成
          </p>
        </div>
      </div>
    </div>
  );
}

function StatOverviewCard({
  iconSrc,
  title,
  value,
  unit,
  description,
  delta,
  deltaDirection = "up",
}: {
  iconSrc: string;
  title: string;
  value: number | string;
  unit?: string;
  description: string;
  delta?: number;
  deltaDirection?: "up" | "down";
}) {
  return (
    <div className="rounded-[28px] border border-border bg-background px-5 py-4 shadow-[0_10px_26px_rgba(255,107,107,0.04)]">
      <div className="grid grid-cols-[84px_minmax(0,1fr)] items-center gap-4">
        <div className="grid size-[76px] place-items-center rounded-full bg-[var(--color-tomato-soft)]">
          <img alt="" className="size-14 object-contain" src={iconSrc} />
        </div>

        <div className="min-w-0">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-sm font-bold text-foreground">{title}</h3>
            <DeltaText delta={delta} direction={deltaDirection} />
          </div>

          <div className="mt-3 flex items-center gap-1 text-primary">
            <RollingNumber className="text-[30px] font-black leading-none" value={value} />
            {unit ? <span className="text-[30px] font-black leading-none">{unit}</span> : null}
          </div>
          <p className="mt-2 text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
    </div>
  );
}

function DeltaText({
  delta,
  suffix = "",
  direction = "up",
}: {
  delta?: number;
  suffix?: string;
  direction?: "up" | "down";
}) {
  if (delta === undefined) {
    return null;
  }

  const positive = delta >= 0;
  const arrow = direction === "down" ? (positive ? "↓" : "↑") : positive ? "↑" : "↓";
  const value = Math.abs(delta);

  return (
    <div className="shrink-0 text-right">
      <div className="text-sm text-muted-foreground">比昨天</div>
      <div
        className={cn(
          "mt-1 text-sm font-semibold",
          positive ? "text-[var(--color-success)]" : "text-[var(--color-tomato-red)]",
        )}
      >
        {arrow} {value}
        {suffix}
      </div>
    </div>
  );
}
