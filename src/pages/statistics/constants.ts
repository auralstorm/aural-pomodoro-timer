import type { CSSProperties } from "react";

import type { SegmentedTabOption } from "@/components/common/SegmentedTabs";
import type { Period } from "./types";

export const PERIOD_OPTIONS: SegmentedTabOption<Period>[] = [
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
export const DURATION_DISTRIBUTION_CONTENT_CLASS = `grid ${BOTTOM_STATS_CONTENT_HEIGHT} grid-cols-[160px_1fr] items-center gap-4`;
export const FOCUS_EFFICIENCY_CONTENT_CLASS = `h-[220px]`;
export const DONUT_CENTER_CLASS =
  "pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-0 text-center";
export const DONUT_CENTER_VALUE_CLASS = "block leading-none";
export const DONUT_CENTER_LABEL_CLASS = "mt-0 block text-xs leading-none";

export const STATS_EMPTY_STATE_CLASS = "h-full w-full justify-center p-4";

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

export const WEEKDAY_LABELS = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
export const RESPONSIVE_CHART_INITIAL_DIMENSION = { height: 1, width: 1 };

export function getChartTooltipProps() {
  return {
    contentStyle: CHART_TOOLTIP_CONTENT_STYLE,
    itemStyle: CHART_TOOLTIP_ITEM_STYLE,
    labelStyle: CHART_TOOLTIP_LABEL_STYLE,
    wrapperStyle: CHART_TOOLTIP_WRAPPER_STYLE,
  };
}
