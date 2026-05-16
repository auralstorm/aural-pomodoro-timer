import { Info, Star } from "lucide-react";

import emptyStats from "@/assets/empty/illus-empty-stats.png";
import { AppCard } from "@/components/common/AppCard";
import { EmptyState } from "@/components/common/EmptyState";
import { formatFocusHours } from "@/utils/time";

import {
  BOTTOM_STATS_CARD_MIN_HEIGHT,
  EFFICIENT_TIME_CONTENT_CLASS,
  EFFICIENT_TIME_ROW_CLASS,
  STATS_EMPTY_STATE_CLASS,
} from "./constants";

export function EfficientTimePanel({
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
              <span className="whitespace-nowrap text-sm font-medium text-foreground">
                {bucket.label}
              </span>
              <div className="h-3 overflow-hidden rounded-full bg-[var(--color-divider)]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[var(--color-tomato-red)] to-[var(--color-danger)]"
                  style={{ width: `${Math.max(0, (bucket.minutes / max) * 100)}%` }}
                />
              </div>
              <span className="text-right text-sm font-semibold text-muted-foreground">
                {formatFocusHours(bucket.minutes)}
              </span>
              {bucket.star ? (
                <Star className="size-4 fill-[var(--color-warning)] text-[var(--color-warning)]" />
              ) : (
                <span />
              )}
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
