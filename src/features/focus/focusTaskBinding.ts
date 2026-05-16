import { useTaskStore } from "@/stores/taskStore";
import { useTimerStore } from "@/stores/timerStore";

// 响应式同步：taskStore 变更时自动清理失效的计时器绑定，
// 使 taskStore 无需直接依赖 timerStore。
useTaskStore.subscribe((state) => {
  const timerTaskId = useTimerStore.getState().currentTaskId;
  if (!timerTaskId) return;

  const task = state.tasks.find((t) => t.id === timerTaskId);
  if (!task || task.status !== "inProgress") {
    useTimerStore.getState().setCurrentTask(undefined);
  }
});
