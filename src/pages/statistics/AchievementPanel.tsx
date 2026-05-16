import { AppCard } from "@/components/common/AppCard";
import type { AchievementItem } from "@/features/achievements/types";

export function AchievementPanel({
  achievements,
  onViewAll,
}: {
  achievements: AchievementItem[];
  onViewAll: () => void;
}) {
  return (
    <AppCard className="min-h-[430px]">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-black">我的成就</h2>
        <button
          className="text-sm font-semibold text-muted-foreground transition hover:text-primary"
          onClick={onViewAll}
          type="button"
        >
          查看全部
        </button>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {achievements.map((achievement) => (
          <div
            className={[
              "flex min-h-32 flex-col items-center justify-center rounded-[var(--radius-lg)] border p-4 text-center transition",
              achievement.unlocked
                ? "border-[var(--color-tomato-light)] bg-[var(--color-tomato-soft)]"
                : "border-border bg-muted/55 text-muted-foreground grayscale",
            ].join(" ")}
            key={achievement.id}
          >
            <div
              className={[
                "mb-2 grid size-14 place-items-center rounded-[18px]",
                achievement.unlocked ? "bg-[var(--color-tomato-soft)]" : "bg-muted",
              ].join(" ")}
            >
              <img
                alt=""
                className="size-12 object-contain"
                src={achievement.unlocked ? achievement.unlockedIcon : achievement.lockedIcon}
              />
            </div>
            <strong className="text-sm font-black text-foreground">{achievement.title}</strong>
            <span className="mt-1 text-xs text-muted-foreground">
              {achievement.unlocked ? "已解锁" : "未解锁"}
            </span>
          </div>
        ))}
      </div>
    </AppCard>
  );
}
