import type { Task, TaskPriority } from "@/types/task";

type PriorityMeta = {
  label?: string;
  dotClassName?: string;
  rank: number;
};

const priorityMetaMap: Record<TaskPriority, PriorityMeta> = {
  normal: {
    rank: 2,
  },
  important: {
    label: "重要",
    dotClassName: "bg-[var(--color-warning)]",
    rank: 1,
  },
  urgent: {
    label: "高优先级",
    dotClassName: "bg-destructive",
    rank: 0,
  },
};

export function getTaskPriorityMeta(priority: TaskPriority): PriorityMeta {
  return priorityMetaMap[priority];
}

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

    const leftPriority = getTaskPriorityMeta(left.priority).rank;
    const rightPriority = getTaskPriorityMeta(right.priority).rank;

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
