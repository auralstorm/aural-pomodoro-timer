import { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";

import { AppButton } from "@/components/common/AppButton";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

import type {
  AchievementCategoryFilter,
  AchievementItem,
  AchievementSummaryModel,
} from "../types";
import { AchievementCategoryTabs } from "./AchievementCategoryTabs";
import { AchievementGrid } from "./AchievementGrid";
import { AchievementSummary } from "./AchievementSummary";
import { AchievementTipBar } from "./AchievementTipBar";

type AchievementDrawerProps = {
  open: boolean;
  onClose: () => void;
  achievements: AchievementItem[];
  summary: AchievementSummaryModel;
};

export function AchievementDrawer({
  open,
  onClose,
  achievements,
  summary,
}: AchievementDrawerProps) {
  const [activeCategory, setActiveCategory] =
    useState<AchievementCategoryFilter>("all");

  useEffect(() => {
    if (open) {
      setActiveCategory("all");
    }
  }, [open]);

  const filteredAchievements = useMemo(
    () =>
      activeCategory === "all"
        ? achievements
        : achievements.filter((item) => item.category === activeCategory),
    [achievements, activeCategory],
  );

  return (
    <Drawer
      direction="right"
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          onClose();
        }
      }}
      open={open}
    >
      <DrawerContent className="!h-dvh !w-[min(860px,72vw)] !max-w-none overflow-hidden rounded-l-[10px]! border-l border-border bg-[#FFF8F3] p-0 shadow-2xl max-lg:!w-[min(760px,92vw)]">
        <div className="flex h-full flex-col">
          <DrawerHeader className="flex-row items-start justify-between border-b border-border px-8 py-6 text-left">
            <div>
              <DrawerTitle className="text-2xl font-black text-foreground">
                成就中心
              </DrawerTitle>
              <DrawerDescription className="mt-1 text-sm text-muted-foreground">
                每一颗番茄，都是成长的记录
              </DrawerDescription>
            </div>
            <DrawerClose asChild>
              <AppButton
                aria-label="关闭成就中心"
                className="rounded-full bg-white shadow-[0_8px_24px_rgba(58,46,42,0.08)]"
                size="icon"
                variant="ghost"
              >
                <X className="size-5" />
              </AppButton>
            </DrawerClose>
          </DrawerHeader>

          <main className="flex-1 overflow-y-auto px-8 py-6">
            <div className="flex flex-col gap-5">
              <AchievementSummary summary={summary} />
              <AchievementCategoryTabs
                onChange={setActiveCategory}
                value={activeCategory}
              />
              <AchievementGrid achievements={filteredAchievements} />
              <AchievementTipBar />
            </div>
          </main>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
