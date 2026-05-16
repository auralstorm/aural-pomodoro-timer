import { Check, Play } from "lucide-react";

import { AppButton } from "@/components/common/AppButton";
import { Tag } from "@/components/common/Tag";
import type { TimerStatus } from "@/types/timer";
import type { Task } from "@/types/task";
import { cn } from "@/lib/utils";

import { FocusTaskActionsMenu } from "./FocusTaskActionsMenu";
import { PRIORITY_MAP, TASK_STATUS_LABEL } from "@/constants/task";

import IconTomato from "@/assets/icons/icon-tomato-count.svg";

type FocusTaskListItemProps = {
  task: Task;
  isCurrent: boolean;
  focusStatus?: TimerStatus;
  onToggleComplete: (taskId: string) => void;
  onSetCurrent: (taskId: string) => void;
  onStart: (taskId: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
};

export function FocusTaskListItem({
  task,
  isCurrent,
  focusStatus,
  onToggleComplete,
  onSetCurrent,
  onStart,
  onEdit,
  onDelete,
}: FocusTaskListItemProps) {
  const isCompleted = task.status === "completed";
  const isFocusRunning = focusStatus === "running";
  const isFocusPaused = focusStatus === "paused";
  const priority = PRIORITY_MAP[task.priority];
  const PriorityIcon = priority.icon;

  const statusLabel = isCompleted
    ? TASK_STATUS_LABEL.completed
    : isFocusRunning
      ? "专注中"
      : isCurrent
        ? "当前专注"
        : TASK_STATUS_LABEL.pending;

  const handleSetCurrent = () => {
    if (!isCompleted) {
      onSetCurrent(task.id);
    }
  };

  return (
    <article
      aria-label={task.title}
      className={cn(
        "w-full grid grid-cols-[auto_minmax(0,1fr)_5rem_5rem_5rem_auto] items-center gap-x-3 rounded-[22px] border border-border bg-card px-3 py-2 transition",
        !isCompleted && "cursor-pointer hover:border-primary/60",
        isCurrent && "border-primary bg-[var(--color-tomato-soft)]",
        isCompleted &&
          "border-[color-mix(in_srgb,var(--color-success)_40%,white)] bg-[color-mix(in_srgb,var(--color-success)_10%,white)]",
      )}
      onClick={handleSetCurrent}
    >
      {/* 列1: 复选框 */}
      <button
        aria-label={isCompleted ? "任务已完成" : "完成任务"}
        className={cn(
          "grid size-6 place-items-center rounded-full border border-border text-muted-foreground transition",
          isCompleted && "border-[var(--color-success)] bg-[var(--color-success)] text-white",
        )}
        disabled={isCompleted}
        onClick={(event) => {
          event.stopPropagation();
          onToggleComplete(task.id);
        }}
        type="button"
      >
        {isCompleted ? <Check aria-hidden="true" className="size-4" /> : null}
      </button>

      {/* 列2: 标题 */}
      <h3
        className={cn(
          "min-w-0 text-sm font-semibold leading-6",
          isCompleted && "text-muted-foreground",
        )}
        title={task.title}
      >
        <span className="block truncate">{task.title}</span>
      </h3>

      {/* 列3: 优先级 */}
      <div className="flex items-center justify-center">
        <Tag className="justify-center whitespace-nowrap" tone={priority.tone}>
          <PriorityIcon aria-hidden="true" className="size-3.5 shrink-0" />
          {priority.label}
        </Tag>
      </div>

      {/* 列4: 番茄计数 */}
      <span className="flex items-center justify-center text-xs text-muted-foreground">
        <img alt="番茄" src={IconTomato} className="w-5 inline" />
        {task.completedPomodoros}/{task.estimatedPomodoros}
      </span>

      {/* 列5: 状态 */}
      <span
        className={cn(
          "text-center text-xs font-medium",
          isCompleted && "text-[var(--color-success)]",
          isFocusRunning && "text-primary",
          isCurrent && !isFocusRunning && "text-primary",
          !isCompleted && !isCurrent && "text-muted-foreground",
        )}
      >
        {statusLabel}
      </span>

      {/* 列6: 操作按钮（保持原有结构） */}
      <div className="flex items-center gap-2">
        {!isCompleted ? (
          <AppButton
            aria-label={`${isFocusPaused && isCurrent ? "继续专注" : isCurrent ? "开始当前任务" : "开始专注"}：${task.title}`}
            className="h-10 w-10 px-3 text-xs rounded-full"
            disabled={isFocusRunning}
            icon={<Play aria-hidden="true" className="size-3.5" />}
            onClick={(event) => {
              event.stopPropagation();
              onStart(task.id);
            }}
            size="sm"
            variant={isCurrent ? "secondary" : "ghost"}
          ></AppButton>
        ) : null}
        <FocusTaskActionsMenu
          isCurrent={isCurrent}
          onDelete={onDelete}
          onEdit={onEdit}
          onSetCurrent={onSetCurrent}
          task={task}
        />
      </div>
    </article>
  );
}
