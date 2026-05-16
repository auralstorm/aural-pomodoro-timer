import { useCallback, useEffect, useMemo, useState } from "react";

import { safeEmit } from "@/desktop/event";
import { stopWhiteNoise } from "@/features/audio/audioController";
import { AssistantEvent } from "@/constants/assistant";
import { useTaskStore } from "@/stores/taskStore";
import { useTimerStore } from "@/stores/timerStore";
import type { TimerMode } from "@/types/timer";
import { calculateRemainingSeconds } from "@/utils/time";
import { completeCurrentMode, getModeTotalSeconds, startModeAudio } from "./timer/timerCompletion";

export function usePomodoroTimer() {
  const timer = useTimerStore();
  const tasks = useTaskStore((state) => state.tasks);
  const currentTaskId = useTaskStore((state) => state.currentTaskId);
  const currentTask = useMemo(
    () => tasks.find((task) => task.id === currentTaskId && task.status !== "completed"),
    [currentTaskId, tasks],
  );

  // ── 倒计时 ──────────────────────────────────────
  const [now, setNow] = useState(() => new Date());

  const remainingSeconds = useMemo(
    () =>
      calculateRemainingSeconds({
        totalSeconds: timer.totalSeconds,
        startedAt: timer.startedAt,
        pausedAt: timer.pausedAt,
        now,
        pausedAccumulatedMs: timer.pausedAccumulatedMs,
      }),
    [now, timer.pausedAccumulatedMs, timer.pausedAt, timer.startedAt, timer.totalSeconds],
  );

  useEffect(() => {
    if (timer.status !== "running") {
      return undefined;
    }

    const interval = window.setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => window.clearInterval(interval);
  }, [timer.status]);

  useEffect(() => {
    if (timer.status === "running" && remainingSeconds <= 0) {
      completeCurrentMode();
    }
  }, [remainingSeconds, timer.status]);

  // ── 任务绑定同步 ─────────────────────────────────
  useEffect(() => {
    if (!currentTaskId) return;

    const boundTask = tasks.find((task) => task.id === currentTaskId);
    if (!boundTask || boundTask.status === "completed") {
      useTaskStore.getState().releaseCurrentTask(currentTaskId);
    }
  }, [currentTaskId, tasks]);

  // ── 操作 ────────────────────────────────────────
  const start = useCallback(() => {
    const taskStore = useTaskStore.getState();
    const timerTaskId = useTimerStore.getState().currentTaskId;

    if (timerTaskId) {
      const timerTask = taskStore.tasks.find((task) => task.id === timerTaskId);
      if (!timerTask || timerTask.status === "completed") {
        taskStore.releaseCurrentTask(timerTaskId);
      }
    }

    const mode = useTimerStore.getState().mode;
    const wasRunning = useTimerStore.getState().status === "paused";
    useTimerStore.getState().startTimer();
    startModeAudio(mode);
    if (mode === "focus") {
      void safeEmit(wasRunning ? AssistantEvent.TimerResume : AssistantEvent.FocusStart);
    } else {
      void safeEmit(wasRunning ? AssistantEvent.TimerResume : AssistantEvent.BreakStart);
    }
  }, []);

  const pause = useCallback(() => {
    useTimerStore.getState().pauseTimer();
    stopWhiteNoise();
    void safeEmit(AssistantEvent.TimerPause);
  }, []);

  const reset = useCallback(() => {
    const mode = useTimerStore.getState().mode;
    stopWhiteNoise();
    useTimerStore.getState().resetTimer(mode, getModeTotalSeconds(mode));
    void safeEmit(AssistantEvent.TimerReset);
  }, []);

  const skip = useCallback(() => completeCurrentMode(), []);

  const switchMode = useCallback((mode: TimerMode) => {
    stopWhiteNoise();
    useTimerStore.getState().switchMode(mode, getModeTotalSeconds(mode));
  }, []);

  return {
    ...timer,
    currentTask,
    remainingSeconds,
    start,
    pause,
    reset,
    skip,
    switchMode,
  };
}
