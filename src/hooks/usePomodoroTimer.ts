import { useCallback, useEffect, useMemo, useState } from "react";

import { emit } from "@tauri-apps/api/event";
import { DEFAULT_SETTINGS } from "@/constants/settings";
import { notifyBreakComplete, notifyFocusComplete } from "@/desktop/notification";
import {
  playReminderTone,
  stopWhiteNoise,
} from "@/features/audio/audioController";
import { AssistantEvent } from "@/types/assistant";
import { achievementConfigs } from "@/features/achievements/data/achievementConfigs";
import { useAchievementStore } from "@/features/achievements/stores/achievementStore";
import { buildAchievements } from "@/features/achievements/utils/buildAchievements";
import { buildAchievementStats } from "@/features/achievements/utils/buildAchievementStats";
import { clearTimerTaskBindingForTask } from "@/features/focus/focusTaskBinding";
import { useModalStore } from "@/stores/modalStore";
import { useSettingsStore } from "@/stores/settingsStore";
import { useStatsStore } from "@/stores/statsStore";
import { useTaskStore } from "@/stores/taskStore";
import { useTimerStore } from "@/stores/timerStore";
import type { ModalPayload, ModalType } from "@/types/modal";
import type { Task } from "@/types/task";
import type { TimerMode } from "@/types/timer";
import { createId } from "@/utils/id";
import {
  calculateRemainingSeconds,
  minutesToSeconds,
  secondsToMinutes,
} from "@/utils/time";

function getModeTotalSeconds(mode: TimerMode): number {
  const settings = useSettingsStore.getState();
  if (mode === "shortBreak") return minutesToSeconds(settings.shortBreakMinutes);
  if (mode === "longBreak") return minutesToSeconds(settings.longBreakMinutes);
  return minutesToSeconds(settings.focusMinutes);
}

function getNextBreakMode(completedCycleCount: number): TimerMode {
  const interval = useSettingsStore.getState().longBreakInterval || DEFAULT_SETTINGS.longBreakInterval;
  return completedCycleCount > 0 && completedCycleCount % interval === 0
    ? "longBreak"
    : "shortBreak";
}

function startModeAudio(mode: TimerMode): void {
  if (mode !== "focus") {
    stopWhiteNoise();
  }
}

function playCompletionReminder(): void {
  const settings = useSettingsStore.getState();
  if (!settings.soundEnabled) {
    return;
  }

  void playReminderTone(settings.reminderTonePreset, settings.volume);
}

function getNewAchievementPayload(tasks: Task[], endedAt: string): ModalPayload | null {
  const unlockedMap = useAchievementStore.getState().unlockedMap;
  const achievements = buildAchievements(
    achievementConfigs,
    buildAchievementStats(useStatsStore.getState().sessions, tasks, new Date(endedAt)),
    unlockedMap,
  );
  const newlyUnlocked = achievements.filter(
    (achievement) => achievement.unlocked && !achievement.unlockedAt,
  );

  if (newlyUnlocked.length === 0) {
    return null;
  }

  const achievementIds = newlyUnlocked.map((achievement) => achievement.id);
  useAchievementStore.getState().recordUnlocked(achievementIds, endedAt);

  return {
    achievementIds,
    achievementTitle: newlyUnlocked[0]?.title,
  };
}

function resolveFocusCompleteModal(
  updatedTask: Task | undefined,
  nextMode: TimerMode,
  nextCycleCount: number,
  endedAt: string,
  settingsState: ReturnType<typeof useSettingsStore.getState>,
): { type: ModalType; payload: ModalPayload } | null {
  const tasks = useTaskStore.getState().tasks;
  const achievementPayload = getNewAchievementPayload(tasks, endedAt);
  if (achievementPayload) {
    return { type: "achievementUnlocked", payload: achievementPayload };
  }

  if (updatedTask?.status === "completed") {
    const allTasksCompleted = tasks.length > 0 && tasks.every((task) => task.status === "completed");

    return {
      type: allTasksCompleted ? "allTasksComplete" : "taskComplete",
      payload: {
        taskId: updatedTask.id,
        taskTitle: updatedTask.title,
        pomodoros: updatedTask.completedPomodoros,
      },
    };
  }

  if (nextMode === "longBreak") {
    return {
      type: "longBreakReward",
      payload: {
        pomodoros: nextCycleCount,
        minutes: settingsState.longBreakMinutes,
      },
    };
  }

  return {
    type: "focusComplete",
    payload: {
      taskTitle: updatedTask?.title,
      minutes: settingsState.focusMinutes,
    },
  };
}

export function usePomodoroTimer() {
  const timer = useTimerStore();
  const tasks = useTaskStore((state) => state.tasks);
  const currentTaskId = useTaskStore((state) => state.currentTaskId);
  const currentTask = useMemo(
    () =>
      tasks.find(
        (task) => task.id === currentTaskId && task.status !== "completed",
      ),
    [currentTaskId, tasks],
  );
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

  const completeCurrentMode = useCallback(() => {
    const state = useTimerStore.getState();
    const settingsState = useSettingsStore.getState();
    if (state.status === "completed") return;

    const endedAt = new Date().toISOString();
    const startedAt = state.startedAt ?? endedAt;
    const durationMinutes = secondsToMinutes(state.totalSeconds);

    useStatsStore.getState().addSession({
      id: createId("session"),
      taskId: state.currentTaskId,
      mode: state.mode,
      startedAt,
      endedAt,
      durationMinutes,
      completed: true,
    });

    stopWhiteNoise();
    useTimerStore.getState().completeTimer();

    if (state.mode === "focus") {
      if (settingsState.focusCompleteReminderEnabled) {
        playCompletionReminder();
      }
      const updatedTask = state.currentTaskId
        ? useTaskStore.getState().incrementTaskPomodoro(state.currentTaskId)
        : undefined;
      const nextCycleCount = state.completedPomodorosInCycle + 1;
      const nextMode = getNextBreakMode(nextCycleCount);
      const modalDecision = resolveFocusCompleteModal(
        updatedTask,
        nextMode,
        nextCycleCount,
        endedAt,
        settingsState,
      );

      useTimerStore.getState().setCompletedPomodorosInCycle(nextCycleCount);
      useTimerStore.getState().switchMode(nextMode, getModeTotalSeconds(nextMode));

      if (modalDecision) {
        useModalStore.getState().openModal(modalDecision.type, modalDecision.payload);
      }

      if (modalDecision?.type === "taskComplete") {
        void emit(AssistantEvent.TaskComplete);
      } else if (modalDecision?.type === "allTasksComplete") {
        void emit(AssistantEvent.AllTasksComplete);
      } else if (modalDecision?.type === "achievementUnlocked") {
        void emit(AssistantEvent.Achievement);
      } else {
        void emit(AssistantEvent.FocusComplete);
      }
      void emit(AssistantEvent.BreakStart);

      void notifyFocusComplete({
        enabled:
          settingsState.focusCompleteReminderEnabled &&
          settingsState.desktopNotificationEnabled,
      });

      if (settingsState.autoStartBreak) {
        useTimerStore.getState().startTimer();
        startModeAudio(nextMode);
      }
      return;
    }

    const completedBreakMode = state.mode;

    if (settingsState.breakCompleteReminderEnabled) {
      playCompletionReminder();
    }

    if (completedBreakMode === "longBreak") {
      useTimerStore.getState().setCompletedPomodorosInCycle(0);
    }

    useTimerStore.getState().switchMode("focus", getModeTotalSeconds("focus"));
    void emit(AssistantEvent.BreakComplete);
    void notifyBreakComplete({
      enabled:
        settingsState.breakCompleteReminderEnabled &&
        settingsState.desktopNotificationEnabled,
    });

    if (settingsState.autoStartNextRound) {
      useTimerStore.getState().startTimer();
      startModeAudio("focus");
    } else {
      useModalStore.getState().openModal("breakComplete", {
        breakMode: completedBreakMode,
        minutes:
          completedBreakMode === "longBreak"
            ? settingsState.longBreakMinutes
            : settingsState.shortBreakMinutes,
      });
    }
  }, []);

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
  }, [completeCurrentMode, remainingSeconds, timer.status]);

  useEffect(() => {
    if (currentTaskId) {
      const boundTask = tasks.find((task) => task.id === currentTaskId);
      if (!boundTask || boundTask.status === "completed") {
        useTaskStore.getState().releaseCurrentTask(currentTaskId);
      }
    }

    const timerTaskId = timer.currentTaskId;
    if (!timerTaskId) {
      return;
    }

    const timerTask = tasks.find((task) => task.id === timerTaskId);
    if (!timerTask || timerTask.status === "completed") {
      clearTimerTaskBindingForTask(timerTaskId);
    }
  }, [currentTaskId, tasks, timer.currentTaskId]);

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
      void emit(wasRunning ? AssistantEvent.TimerResume : AssistantEvent.FocusStart);
    } else {
      void emit(wasRunning ? AssistantEvent.TimerResume : AssistantEvent.BreakStart);
    }
  }, []);
  const pause = useCallback(() => {
    useTimerStore.getState().pauseTimer();
    stopWhiteNoise();
    void emit(AssistantEvent.TimerPause);
  }, []);
  const reset = useCallback(() => {
    const mode = useTimerStore.getState().mode;
    stopWhiteNoise();
    useTimerStore.getState().resetTimer(mode, getModeTotalSeconds(mode));
    void emit(AssistantEvent.TimerReset);
  }, []);
  const skip = useCallback(() => completeCurrentMode(), [completeCurrentMode]);
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
