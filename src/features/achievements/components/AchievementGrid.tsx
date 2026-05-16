import type { AchievementItem } from "../types";
import { AchievementCard } from "./AchievementCard";

type AchievementGridProps = {
  achievements: AchievementItem[];
};

export function AchievementGrid({ achievements }: AchievementGridProps) {
  if (achievements.length === 0) {
    return (
      <div className="rounded-[24px] border border-dashed border-border bg-card p-8 text-center">
        <p className="text-base font-black text-foreground">这里暂时没有成就</p>
        <p className="mt-2 text-sm text-muted-foreground">
          换个分类看看，或者先开始一次专注吧。
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 max-md:grid-cols-1">
      {achievements.map((achievement) => (
        <AchievementCard achievement={achievement} key={achievement.id} />
      ))}
    </div>
  );
}
