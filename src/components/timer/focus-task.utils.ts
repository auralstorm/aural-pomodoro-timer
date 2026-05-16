import type { Task } from "@/types/task";
import { PRIORITY_MAP } from "@/constants/task";

export function sortFocusQueueTasks(
  tasks: Task[],
  currentTaskId?: string,
  focusTaskId?: string,
): Task[] {
  return [...tasks].sort((left, right) => {
    const leftFocusRank = left.id === focusTaskId ? 0 : left.id === currentTaskId ? 1 : 2;
    const rightFocusRank = right.id === focusTaskId ? 0 : right.id === currentTaskId ? 1 : 2;

    if (leftFocusRank !== rightFocusRank) {
      return leftFocusRank - rightFocusRank;
    }

    const leftPriority = PRIORITY_MAP[left.priority].rank;
    const rightPriority = PRIORITY_MAP[right.priority].rank;

    if (leftPriority !== rightPriority) {
      return leftPriority - rightPriority;
    }

    const leftRemaining = Math.max(0, left.estimatedPomodoros - left.completedPomodoros);
    const rightRemaining = Math.max(0, right.estimatedPomodoros - right.completedPomodoros);

    if (leftRemaining !== rightRemaining) {
      return leftRemaining - rightRemaining;
    }

    return Date.parse(right.updatedAt) - Date.parse(left.updatedAt);
  });
}
