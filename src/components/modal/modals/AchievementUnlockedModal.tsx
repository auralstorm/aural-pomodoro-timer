import { Sparkles, Trophy } from "lucide-react";

import { AppDialog } from "@/components/common/AppDialog";
import { achievementConfigs } from "@/features/achievements/data/achievementConfigs";
import { useAchievementStore } from "@/features/achievements/stores/achievementStore";

import { ModalActionRow } from "../ModalActionRow";

type AchievementUnlockedModalProps = {
  open: boolean;
  achievementIds?: string[];
  achievementTitle?: string;
  onViewAchievements: () => void;
  onContinueFocus: () => void;
  onOpenChange: (open: boolean) => void;
};

export function AchievementUnlockedModal({
  open,
  achievementIds,
  achievementTitle,
  onViewAchievements,
  onContinueFocus,
  onOpenChange,
}: AchievementUnlockedModalProps) {
  const unlockedMap = useAchievementStore((state) => state.unlockedMap);
  const achievement = achievementIds?.length
    ? achievementConfigs.find((item) => item.id === achievementIds[0])
    : undefined;
  const title = achievementTitle ?? achievement?.title ?? "新的专注成就";
  const icon = achievement ? achievement.unlockedIcon : undefined;
  const unlockedAt =
    achievementIds?.length && unlockedMap[achievementIds[0]]
      ? new Date(unlockedMap[achievementIds[0]]!).toLocaleDateString("zh-CN")
      : undefined;

  return (
    <AppDialog
      description="你已经稳定坚持了一段时间，正在养成很棒的好习惯。"
      onOpenChange={onOpenChange}
      open={open}
      size="md"
      title="解锁新成就！"
    >
      <div className="mt-3 flex flex-col items-center text-center">
        {icon ? (
          <img alt={title} className="h-48 w-48 object-contain" src={icon} />
        ) : (
          <div className="flex size-32 items-center justify-center rounded-full bg-[var(--color-tomato-soft)] text-primary">
            <Trophy className="size-14" />
          </div>
        )}
        <p className="mt-3 text-xl font-black text-foreground">{title}</p>
        <p className="mt-1 text-sm text-muted-foreground">
          {achievement?.description ?? "每一次专注都在积累长期成长。"}
        </p>
        {unlockedAt ? (
          <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-[var(--color-tomato-soft)] px-4 py-2 text-sm font-semibold text-primary">
            <Sparkles className="size-4" />
            已解锁于 {unlockedAt}
          </p>
        ) : null}
      </div>
      <ModalActionRow
        primary={{
          label: "查看成就",
          onClick: onViewAchievements,
          icon: <Trophy className="size-4" />,
        }}
        secondary={{ label: "继续专注", onClick: onContinueFocus }}
      />
    </AppDialog>
  );
}
