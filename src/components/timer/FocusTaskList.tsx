import type { Task } from "@/types/task";

import { FocusTaskEmptyState } from "./FocusTaskEmptyState";
import { FocusTaskListItem } from "./FocusTaskListItem";

type FocusTaskListProps = {
  tasks: Task[];
  currentTaskId?: string | null;
  focusTaskId?: string | null;
  focusStatus?: "idle" | "running" | "paused" | "completed";
  onCreateTask?: () => void;
  onToggleComplete?: (taskId: string) => void;
  onSetCurrent?: (taskId: string) => void;
  onStart?: (taskId: string) => void;
  onEdit?: (task: Task) => void;
  onDelete?: (task: Task) => void;
};

export function FocusTaskList({
  tasks,
  currentTaskId,
  focusTaskId,
  focusStatus,
  onToggleComplete,
  onSetCurrent,
  onStart,
  onEdit,
  onDelete,
}: FocusTaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="flex h-full min-h-[212px] flex-1 items-stretch">
        <FocusTaskEmptyState />
      </div>
    );
  }

  const previewTasks = tasks.slice(0, 4);

  return (
    <section className="space-y-3 w-full">
      {previewTasks.map((task) => (
        <FocusTaskListItem
          focusStatus={task.id === focusTaskId ? focusStatus : undefined}
          isCurrent={task.id === currentTaskId}
          key={task.id}
          onDelete={onDelete ?? (() => undefined)}
          onEdit={onEdit ?? (() => undefined)}
          onSetCurrent={onSetCurrent ?? (() => undefined)}
          onStart={onStart ?? (() => undefined)}
          onToggleComplete={onToggleComplete ?? (() => undefined)}
          task={task}
        />
      ))}
    </section>
  );
}
