import { create } from "zustand";
import { persist } from "zustand/middleware";

import { STORAGE_KEYS } from "@/constants/storage";
import type { TimerMode, TimerStateSnapshot, TimerStatus } from "@/types/timer";

type TimerStore = TimerStateSnapshot & {
  startTimer: () => void;
  pauseTimer: () => void;
  completeTimer: () => void;
  resetTimer: (mode?: TimerMode, totalSeconds?: number) => void;
  switchMode: (mode: TimerMode, totalSeconds: number) => void;
  setCurrentTask: (taskId?: string) => void;
  setCompletedPomodorosInCycle: (count: number) => void;
};

const DEFAULT_TIMER: TimerStateSnapshot = {
  mode: "focus",
  status: "idle",
  totalSeconds: 1500,
  pausedAccumulatedMs: 0,
  completedPomodorosInCycle: 0,
};

function snapshot(state: TimerStore): TimerStateSnapshot {
  const {
    startTimer: _startTimer,
    pauseTimer: _pauseTimer,
    completeTimer: _completeTimer,
    resetTimer: _resetTimer,
    switchMode: _switchMode,
    setCurrentTask: _setCurrentTask,
    setCompletedPomodorosInCycle: _setCompletedPomodorosInCycle,
    ...data
  } = state;
  return data;
}

function updateState(
  get: () => TimerStore,
  set: (state: Partial<TimerStore>) => void,
  next: Partial<TimerStateSnapshot>,
): void {
  const data = { ...snapshot(get()), ...next };
  set(data);
}

export const useTimerStore = create<TimerStore>()(
  persist(
    (set, get) => ({
      ...DEFAULT_TIMER,
      startTimer: () => {
        const state = get();
        const now = new Date().toISOString();
        const pausedAccumulatedMs =
          state.status === "paused" && state.pausedAt
            ? state.pausedAccumulatedMs + (Date.parse(now) - Date.parse(state.pausedAt))
            : state.pausedAccumulatedMs;

        updateState(get, set, {
          status: "running" as TimerStatus,
          startedAt: state.startedAt ?? now,
          pausedAt: undefined,
          pausedAccumulatedMs,
        });
      },
      pauseTimer: () => {
        if (get().status !== "running") return;
        updateState(get, set, {
          status: "paused",
          pausedAt: new Date().toISOString(),
        });
      },
      completeTimer: () => {
        updateState(get, set, {
          status: "completed",
          pausedAt: undefined,
        });
      },
      resetTimer: (mode = get().mode, totalSeconds = get().totalSeconds) => {
        updateState(get, set, {
          mode,
          status: "idle",
          totalSeconds,
          startedAt: undefined,
          pausedAt: undefined,
          pausedAccumulatedMs: 0,
        });
      },
      switchMode: (mode, totalSeconds) => {
        updateState(get, set, {
          mode,
          status: "idle",
          totalSeconds,
          startedAt: undefined,
          pausedAt: undefined,
          pausedAccumulatedMs: 0,
        });
      },
      setCurrentTask: (taskId) => {
        updateState(get, set, { currentTaskId: taskId });
      },
      setCompletedPomodorosInCycle: (count) => {
        updateState(get, set, { completedPomodorosInCycle: Math.max(0, count) });
      },
    }),
    {
      name: STORAGE_KEYS.TIMER,
      version: 1,
      partialize: snapshot,
      migrate: migrateLegacyTimer,
    },
  ),
);

function migrateLegacyTimer(persistedState: unknown): TimerStateSnapshot {
  if (persistedState && typeof persistedState === "object" && "data" in persistedState) {
    return {
      ...DEFAULT_TIMER,
      ...(persistedState as { data: Partial<TimerStateSnapshot> }).data,
    };
  }

  return {
    ...DEFAULT_TIMER,
    ...(persistedState as Partial<TimerStateSnapshot>),
  };
}
