import { useSettingsStore } from "@/stores/settingsStore";
import { useTaskStore } from "@/stores/taskStore";
import { useTimerStore } from "@/stores/timerStore";
import { minutesToSeconds } from "@/utils/time";

function getFocusTotalSeconds(): number {
  return minutesToSeconds(useSettingsStore.getState().focusMinutes);
}

function isActiveFocusSession() {
  const timer = useTimerStore.getState();
  return timer.mode === "focus" && (timer.status === "running" || timer.status === "paused");
}

function canSelectTask(taskId: string): boolean {
  const task = useTaskStore.getState().tasks.find((item) => item.id === taskId);
  return Boolean(task && task.status !== "completed");
}

export function selectCurrentTask(taskId: string): void {
  const timerState = useTimerStore.getState();

  if (!canSelectTask(taskId) || timerState.currentTaskId === taskId) {
    return;
  }

  useTaskStore.getState().setCurrentTask(taskId);
  useTimerStore.getState().setCurrentTask(taskId);

  if (isActiveFocusSession()) {
    useTimerStore.getState().resetTimer("focus", getFocusTotalSeconds());
  }
}

export function startFocusTask(taskId: string): void {
  if (!canSelectTask(taskId)) {
    return;
  }

  useTaskStore.getState().setCurrentTask(taskId);
  useTimerStore.getState().setCurrentTask(taskId);
  useTimerStore.getState().switchMode("focus", getFocusTotalSeconds());
  useTimerStore.getState().startTimer();
}
