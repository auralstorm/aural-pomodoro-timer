import type { ReactNode } from "react";

import { AppCard } from "@/components/common/AppCard";
import { cn } from "@/lib/utils";

type StatCardTone = "tomato" | "success" | "warning";
export type StatCardTrendTone = "positive" | "neutral" | "negative";

type StatCardProps = {
  icon: ReactNode;
  label: string;
  trendTone?: StatCardTrendTone;
  value: ReactNode;
  trend?: string;
  tone?: StatCardTone;
};

const STAT_CARD_TONE_CLASS: Record<StatCardTone, { icon: string; value: string }> = {
  success: {
    icon: "bg-[color-mix(in_srgb,var(--color-success)_15%,white)]",
    value: "text-[var(--color-success)]",
  },
  tomato: {
    icon: "bg-[var(--color-tomato-soft)]",
    value: "text-primary",
  },
  warning: {
    icon: "bg-[color-mix(in_srgb,var(--color-warning)_18%,white)]",
    value: "text-[var(--color-warning)]",
  },
};

const STAT_CARD_TREND_CLASS: Record<StatCardTrendTone, string> = {
  negative: "text-primary",
  neutral: "text-muted-foreground",
  positive: "text-[var(--color-success)]",
};

export function StatCard({
  icon,
  label,
  trendTone = "positive",
  value,
  trend,
  tone = "tomato",
}: StatCardProps) {
  const toneClass = STAT_CARD_TONE_CLASS[tone];
  const trendClass = STAT_CARD_TREND_CLASS[trendTone];

  return (
    <AppCard className="flex items-center gap-4">
      <div className={cn("grid size-16 place-items-center rounded-full", toneClass.icon)}>
        {icon}
      </div>
      <div>
        <p className="text-sm font-semibold text-muted-foreground">{label}</p>
        <strong className={cn("mt-1 block text-3xl font-black", toneClass.value)}>{value}</strong>
        {trend ? <span className={cn("text-sm", trendClass)}>{trend}</span> : null}
      </div>
    </AppCard>
  );
}
