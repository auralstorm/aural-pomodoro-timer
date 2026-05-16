import { useTimerStore } from "@/stores/timerStore";

export function clearTimerTaskBindingForTask(taskId?: string): boolean {
  if (!taskId) {
    return false;
  }

  const timerState = useTimerStore.getState();
  if (timerState.currentTaskId !== taskId) {
    return false;
  }

  useTimerStore.getState().setCurrentTask(undefined);
  return true;
}
