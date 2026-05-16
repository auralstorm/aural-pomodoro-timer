import { Check, Edit3, Play, Trash2 } from "lucide-react";

import { AppButton } from "@/components/common/AppButton";
import { Tag } from "@/components/common/Tag";
import type { Task } from "@/types/task";
import { cn } from "@/lib/utils";
import IconTomato from "@/assets/icons/icon-tomato-count.svg";
import { PRIORITY_MAP, TASK_STATUS_LABEL } from "@/constants/task";

type TaskCardProps = {
  task: Task;
  isCurrent?: boolean;
  compact?: boolean;
  onStart?: (taskId: string) => void;
  onComplete?: (taskId: string) => void;
  onEdit?: (task: Task) => void;
  onDelete?: (task: Task) => void;
};

export function TaskCard({
  task,
  isCurrent,
  compact,
  onStart,
  onComplete,
  onEdit,
  onDelete,
}: TaskCardProps) {
  const priority = PRIORITY_MAP[task.priority];
  const PriorityIcon = priority.icon;
  const isCompleted = task.status === "completed";
  const statusLabel = isCompleted
    ? TASK_STATUS_LABEL.completed
    : isCurrent
      ? "当前专注"
      : TASK_STATUS_LABEL.pending;
  const statusTone = isCompleted ? "success" : isCurrent ? "focus" : "neutral";

  if (compact) {
    return (
      <article
        className={cn(
          "grid grid-cols-[auto_1fr_auto] items-center gap-4 rounded-[var(--radius-lg)] border border-border bg-card p-4 transition",
          !isCompleted && "cursor-pointer hover:border-primary/50",
          isCurrent && "border-primary bg-[var(--color-tomato-soft)]",
          isCompleted &&
            "border-[color-mix(in_srgb,var(--color-success)_40%,white)] bg-[color-mix(in_srgb,var(--color-success)_10%,white)]",
        )}
        onClick={() => {
          if (!isCompleted) onStart?.(task.id);
        }}
      >
        <button
          aria-label={isCompleted ? "任务已完成" : "完成任务"}
          className={cn(
            "grid size-6 place-items-center rounded-full border border-border text-muted-foreground",
            isCompleted && "border-[var(--color-success)] bg-[var(--color-success)] text-white",
          )}
          disabled={isCompleted}
          onClick={(event) => {
            event.stopPropagation();
            onComplete?.(task.id);
          }}
          type="button"
        >
          {isCompleted ? <Check aria-hidden="true" className="size-4" /> : null}
        </button>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3
              className={cn("truncate text-base font-bold", isCompleted && "text-muted-foreground")}
            >
              {task.title}
            </h3>
            {isCurrent ? <Tag tone="focus">当前专注</Tag> : null}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Tag tone={isCompleted ? "success" : "focus"}>
            <img alt="番茄" src={IconTomato} className="w-7.5 inline" /> {task.completedPomodoros} /{" "}
            {task.estimatedPomodoros}
          </Tag>
        </div>
      </article>
    );
  }

  return (
    <article
      className={cn(
        "grid grid-cols-[minmax(0,1.8fr)_120px_120px_92px_120px_88px] items-center gap-4 rounded-[var(--radius-lg)] border border-border bg-card px-4 py-4 transition max-xl:grid-cols-1",
        isCurrent && "border-primary bg-[var(--color-tomato-soft)]",
        isCompleted &&
          "border-[color-mix(in_srgb,var(--color-success)_40%,white)] bg-[color-mix(in_srgb,var(--color-success)_10%,white)]",
      )}
    >
      <div className="grid min-w-0 grid-cols-[auto_minmax(0,1fr)] items-center gap-4">
        <button
          aria-label={isCompleted ? "任务已完成" : "完成任务"}
          className={cn(
            "grid size-6 place-items-center rounded-full border border-border text-muted-foreground",
            isCompleted && "border-[var(--color-success)] bg-[var(--color-success)] text-white",
          )}
          disabled={isCompleted}
          onClick={(event) => {
            event.stopPropagation();
            onComplete?.(task.id);
          }}
          type="button"
        >
          {isCompleted ? <Check aria-hidden="true" className="size-4" /> : null}
        </button>

        <div className="min-w-0">
          <div className="flex min-w-0 items-center gap-2">
            <h3
              className={cn("truncate text-base font-bold", isCompleted && "text-muted-foreground")}
              title={task.title}
            >
              {task.title}
            </h3>
          </div>
          {task.description ? (
            <p className="mt-1 truncate text-sm text-muted-foreground" title={task.description}>
              {task.description}
            </p>
          ) : (
            <p className="mt-1 truncate text-sm text-muted-foreground">
              {isCompleted ? "已完成任务" : "准备开始下一步推进"}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center max-xl:justify-start">
        <Tag className="justify-center whitespace-nowrap" tone={priority.tone}>
          <PriorityIcon aria-hidden="true" className="size-3.5 shrink-0" />
          {priority.label}
        </Tag>
      </div>

      <div className="flex items-center max-xl:justify-start">
        <Tag className="justify-center whitespace-nowrap" tone={isCompleted ? "success" : "focus"}>
          <img alt="番茄" src={IconTomato} className="w-7.5 inline" /> {task.completedPomodoros} /{" "}
          {task.estimatedPomodoros}
        </Tag>
      </div>

      <div className="flex items-center justify-center max-xl:justify-start">
        <Tag className="justify-center whitespace-nowrap" tone={statusTone}>
          {statusLabel}
        </Tag>
      </div>

      <div className="flex items-center justify-center max-xl:justify-start">
        {!isCompleted ? (
          <AppButton
            aria-label={`开始专注：${task.title}`}
            icon={<Play aria-hidden="true" className="size-4" />}
            onClick={(event) => {
              event.stopPropagation();
              onStart?.(task.id);
            }}
            size="sm"
            variant="secondary"
          >
            开始专注
          </AppButton>
        ) : (
          <span className="text-sm font-semibold text-muted-foreground">-</span>
        )}
      </div>

      <div className="flex items-center justify-end gap-2 max-xl:justify-start">
        <AppButton
          aria-label={`编辑任务：${task.title}`}
          icon={<Edit3 aria-hidden="true" className="size-4" />}
          onClick={(event) => {
            event.stopPropagation();
            onEdit?.(task);
          }}
          size="icon"
          variant="ghost"
        />
        <AppButton
          aria-label={`删除任务：${task.title}`}
          icon={<Trash2 aria-hidden="true" className="size-4" />}
          onClick={(event) => {
            event.stopPropagation();
            onDelete?.(task);
          }}
          size="icon"
          variant="ghost"
        />
      </div>
    </article>
  );
}
