import dayjs from "dayjs";

import { drawerSummaryIcons } from "../data/drawerIconAssets";
import type { AchievementSummaryModel } from "../types";
import { formatAchievementProgress } from "../utils/formatAchievementProgress";

type AchievementSummaryProps = {
  summary: AchievementSummaryModel;
};

export function AchievementSummary({ summary }: AchievementSummaryProps) {
  return (
    <div className="grid grid-cols-4 gap-4 max-lg:grid-cols-2">
      <SummaryCard
        iconSrc={drawerSummaryIcons.unlocked}
        label="已点亮成就"
        meta={`成就完成度 ${summary.completionRate}%`}
        value={`${summary.unlockedCount} / ${summary.totalCount}`}
      />
      <SummaryCard
        iconSrc={drawerSummaryIcons.points}
        label="总成就点数"
        meta="每一次专注都在积累成长"
        value={`${summary.achievementPoints}`}
      />
      <SummaryCard
        iconSrc={drawerSummaryIcons.recent}
        label="最近点亮"
        meta={
          summary.recentUnlocked?.unlockedAt
            ? dayjs(summary.recentUnlocked.unlockedAt).format("YYYY-MM-DD")
            : "继续完成目标来点亮"
        }
        value={summary.recentUnlocked?.title ?? "暂无"}
      />
      <SummaryCard
        iconSrc={drawerSummaryIcons.nearest}
        label="即将点亮"
        meta={
          summary.nearestAchievement
            ? formatAchievementProgress(
                summary.nearestAchievement.current,
                summary.nearestAchievement.target,
                summary.nearestAchievement.unit,
              )
            : "已全部点亮"
        }
        value={summary.nearestAchievement?.title ?? "全部完成"}
      />
    </div>
  );
}

function SummaryCard({
  iconSrc,
  label,
  meta,
  value,
}: {
  iconSrc: string;
  label: string;
  meta: string;
  value: string;
}) {
  return (
    <section className="rounded-[24px] border border-border bg-card p-5 shadow-[0_8px_24px_rgba(58,46,42,0.05)]">
      <div className="mb-3 inline-grid size-10 place-items-center rounded-[16px] bg-[var(--color-tomato-soft)]">
        <img alt="" className="size-7 object-contain" draggable={false} src={iconSrc} />
      </div>
      <p className="text-sm font-semibold text-muted-foreground">{label}</p>
      <strong className="mt-1 block text-2xl font-black text-foreground">{value}</strong>
      <p className="mt-3 text-xs leading-5 text-muted-foreground">{meta}</p>
    </section>
  );
}
