import type dayjs from "dayjs";

import type { StatCardTrendTone } from "@/components/stats/StatCard";

export type Period = "today" | "week" | "month" | "custom";
export type ActivePeriod = Exclude<Period, "custom">;

export type TrendCopyOptions = {
  comparisonTarget: string;
  currentPeriodLabel: string;
  emptyNoun: string;
  formatAbsoluteDelta?: (value: number) => string;
  negativeDisplay?: "absolute" | "percent";
};

export type TrendInfo = {
  text: string;
  tone: StatCardTrendTone;
};

export type FocusEfficiencyPoint = {
  currentMinutes: number;
  label: string;
  previousMinutes: number;
};

export type PeriodRange = {
  currentStart: dayjs.Dayjs;
  currentEnd: dayjs.Dayjs;
  previousStart: dayjs.Dayjs;
  previousEnd: dayjs.Dayjs;
};
