import { safeEmit } from "@/desktop/event";

import { DEFAULT_SETTINGS } from "@/constants/settings";
import { notifyBreakComplete, notifyFocusComplete } from "@/desktop/notification";
import { playReminderTone, stopWhiteNoise } from "@/features/audio/audioController";
import { AssistantEvent } from "@/constants/assistant";
import { achievementConfigs } from "@/features/achievements/data/achievementConfigs";
import { useAchievementStore } from "@/features/achievements/stores/achievementStore";
import { buildAchievements } from "@/features/achievements/utils/buildAchievements";
import { buildAchievementStats } from "@/features/achievements/utils/buildAchievementStats";
import { useModalStore } from "@/stores/modalStore";
import { useSettingsStore } from "@/stores/settingsStore";
import { useStatsStore } from "@/stores/statsStore";
import { useTaskStore } from "@/stores/taskStore";
import { useTimerStore } from "@/stores/timerStore";
import type { ModalPayload, ModalType } from "@/types/modal";
import type { Task } from "@/types/task";
import type { TimerMode } from "@/types/timer";
import { createId } from "@/utils/id";
import { minutesToSeconds, secondsToMinutes } from "@/utils/time";

export function getModeTotalSeconds(mode: TimerMode): number {
  const settings = useSettingsStore.getState();
  if (mode === "shortBreak") return minutesToSeconds(settings.shortBreakMinutes);
  if (mode === "longBreak") return minutesToSeconds(settings.longBreakMinutes);
  return minutesToSeconds(settings.focusMinutes);
}

/** 切换模式时停止不相关的音频 */
export function startModeAudio(mode: TimerMode): void {
  if (mode !== "focus") {
    stopWhiteNoise();
  }
}

function getNextBreakMode(completedCycleCount: number): TimerMode {
  const interval =
    useSettingsStore.getState().longBreakInterval || DEFAULT_SETTINGS.longBreakInterval;
  return completedCycleCount > 0 && completedCycleCount % interval === 0
    ? "longBreak"
    : "shortBreak";
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
    const allTasksCompleted =
      tasks.length > 0 && tasks.every((task) => task.status === "completed");

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

/**
 * 完成当前计时模式：记录会话、处理成就/任务/弹窗、切换到下一模式。
 * 无 hook 依赖，可作为普通函数调用。
 */
export function completeCurrentMode(): void {
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
    handleFocusComplete(state, settingsState, endedAt);
  } else {
    handleBreakComplete(state.mode as BreakMode, settingsState);
  }
}

function handleFocusComplete(
  state: ReturnType<typeof useTimerStore.getState>,
  settingsState: ReturnType<typeof useSettingsStore.getState>,
  endedAt: string,
): void {
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
    void safeEmit(AssistantEvent.TaskComplete);
  } else if (modalDecision?.type === "allTasksComplete") {
    void safeEmit(AssistantEvent.AllTasksComplete);
  } else if (modalDecision?.type === "achievementUnlocked") {
    void safeEmit(AssistantEvent.Achievement);
  } else {
    void safeEmit(AssistantEvent.FocusComplete);
  }
  void safeEmit(AssistantEvent.BreakStart);

  void notifyFocusComplete({
    enabled: settingsState.focusCompleteReminderEnabled && settingsState.desktopNotificationEnabled,
  });

  if (settingsState.autoStartBreak) {
    useTimerStore.getState().startTimer();
    startModeAudio(nextMode);
  }
}

type BreakMode = "shortBreak" | "longBreak";

function handleBreakComplete(
  completedBreakMode: BreakMode,
  settingsState: ReturnType<typeof useSettingsStore.getState>,
): void {
  if (settingsState.breakCompleteReminderEnabled) {
    playCompletionReminder();
  }

  if (completedBreakMode === "longBreak") {
    useTimerStore.getState().setCompletedPomodorosInCycle(0);
  }

  useTimerStore.getState().switchMode("focus", getModeTotalSeconds("focus"));
  void safeEmit(AssistantEvent.BreakComplete);
  void notifyBreakComplete({
    enabled: settingsState.breakCompleteReminderEnabled && settingsState.desktopNotificationEnabled,
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
}
