import { create } from "zustand";
import { persist } from "zustand/middleware";

import { STORAGE_KEYS } from "@/constants/storage";

type AchievementStoreData = {
  unlockedMap: Record<string, string | undefined>;
};

type AchievementStore = AchievementStoreData & {
  recordUnlocked: (achievementIds: string[], unlockedAt?: string) => void;
  clearAchievements: () => void;
};

export const useAchievementStore = create<AchievementStore>()(
  persist(
    (set, get) => ({
      unlockedMap: {},
      clearAchievements: () => {
        set({ unlockedMap: {} });
      },
      recordUnlocked: (achievementIds, unlockedAt = new Date().toISOString()) => {
        if (achievementIds.length === 0) {
          return;
        }

        const unlockedMap = { ...get().unlockedMap };

        achievementIds.forEach((achievementId) => {
          if (!unlockedMap[achievementId]) {
            unlockedMap[achievementId] = unlockedAt;
          }
        });

        set({ unlockedMap });
      },
    }),
    {
      name: STORAGE_KEYS.ACHIEVEMENTS,
      partialize: ({ unlockedMap }) => ({ unlockedMap }),
      version: 1,
    },
  ),
);
