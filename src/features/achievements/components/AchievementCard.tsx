import dayjs from "dayjs";

import { cn } from "@/lib/utils";

import type { AchievementItem } from "../types";
import { formatAchievementProgress } from "../utils/formatAchievementProgress";

type AchievementCardProps = {
  achievement: AchievementItem;
};

export function AchievementCard({ achievement }: AchievementCardProps) {
  const progress = Math.min(100, Math.round((achievement.current / achievement.target) * 100));
  const icon = achievement.unlocked ? achievement.unlockedIcon : achievement.lockedIcon;

  return (
    <article
      className={cn(
        "rounded-[24px] border bg-card p-4 shadow-[0_8px_24px_rgba(58,46,42,0.05)] transition hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(58,46,42,0.08)]",
        achievement.unlocked ? "border-[var(--color-tomato-light)]" : "border-border",
      )}
      data-testid="achievement-card"
    >
      <div className="flex gap-4">
        <img
          alt={achievement.title}
          className="size-24 shrink-0 object-contain"
          draggable={false}
          src={icon}
        />

        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex items-start justify-between gap-2">
            <h3 className="min-w-0 text-base font-black leading-6 text-foreground">
              {achievement.title}
            </h3>
            <span
              className={cn(
                "shrink-0 rounded-full px-2.5 py-1 text-xs font-bold",
                achievement.unlocked
                  ? "bg-[var(--color-tomato-soft)] text-primary"
                  : "bg-muted text-muted-foreground",
              )}
            >
              {achievement.unlocked ? "已点亮" : "未点亮"}
            </span>
          </div>

          <p className="mt-1 line-clamp-2 text-sm leading-5 text-muted-foreground">
            {achievement.description}
          </p>

          <div className="mt-auto pt-4">
            <div className="h-2 overflow-hidden rounded-full bg-[var(--color-divider)]">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="mt-2 flex items-center justify-between gap-3 text-xs text-muted-foreground">
              <span>
                {achievement.unlocked
                  ? formatUnlockedAt(achievement.unlockedAt)
                  : formatAchievementProgress(
                      achievement.current,
                      achievement.target,
                      achievement.unit,
                    )}
              </span>
              <span className="font-bold">{progress}%</span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

function formatUnlockedAt(unlockedAt?: string) {
  if (!unlockedAt) {
    return "已点亮";
  }

  return `已点亮 · ${dayjs(unlockedAt).format("YYYY-MM-DD")}`;
}
