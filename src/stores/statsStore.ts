import { create } from "zustand";
import { persist } from "zustand/middleware";

import { STORAGE_KEYS } from "@/constants/storage";
import type { PomodoroSession } from "@/types/timer";

type StatsStore = {
  sessions: PomodoroSession[];
  addSession: (session: PomodoroSession) => void;
  clearSessions: () => void;
};

export const useStatsStore = create<StatsStore>()(
  persist(
    (set, get) => ({
      sessions: [],
      addSession: (session) => {
        const sessions = [session, ...get().sessions];
        set({ sessions });
      },
      clearSessions: () => {
        set({ sessions: [] });
      },
    }),
    {
      name: STORAGE_KEYS.SESSIONS,
      version: 1,
      partialize: ({ sessions }) => ({ sessions }),
      migrate: migrateLegacySessions,
    },
  ),
);

function migrateLegacySessions(
  persistedState: unknown,
): { sessions: PomodoroSession[] } {
  if (Array.isArray(persistedState)) {
    return { sessions: persistedState };
  }

  if (
    persistedState &&
    typeof persistedState === "object" &&
    "data" in persistedState
  ) {
    const data = (persistedState as { data: PomodoroSession[] }).data;
    return { sessions: Array.isArray(data) ? data : [] };
  }

  const data = persistedState as Partial<{ sessions: PomodoroSession[] }>;
  return { sessions: data?.sessions ?? [] };
}
