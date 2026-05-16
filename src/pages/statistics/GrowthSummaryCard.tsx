import illusGrowth from "@/assets/illustrations/illus-stats-growth.png";
import { AppCard } from "@/components/common/AppCard";
import { formatMinutesToChinese } from "@/utils/time";

import { getPeriodCopy } from "./statisticsModel";
import type { ActivePeriod } from "./types";

export function GrowthSummaryCard({
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
          <span className="font-black text-primary dark:text-[var(--color-warning)]">
            {formatMinutesToChinese(absDelta)}
          </span>
        </h2>
        <p className="mt-3 max-w-[220px] text-sm leading-6 text-muted-foreground dark:text-[color-mix(in_srgb,var(--foreground)_76%,transparent)]">
          继续保持，你正在建立稳定
          <br />
          的专注习惯！
        </p>
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-[linear-gradient(180deg,transparent_0%,color-mix(in_srgb,var(--primary)_10%,transparent)_100%)] dark:bg-[linear-gradient(180deg,transparent_0%,color-mix(in_srgb,var(--primary)_14%,transparent)_100%)]" />
      <img
        alt=""
        className="-mt-10 ml-auto h-48 object-contain right-0 relative z-[1]"
        src={illusGrowth}
      />
    </AppCard>
  );
}
