import type { Task } from "@/types/task";

import { cn } from "@/lib/utils";
import { PRIORITY_MAP } from "@/constants/task";

import IconTomato from "@/assets/icons/icon-tomato-count.svg";

type FocusTaskMetaProps = {
  task: Task;
  className?: string;
};

export function FocusTaskMeta({ task, className }: FocusTaskMetaProps) {
  const priority = PRIORITY_MAP[task.priority];

  return (
    <div
      className={cn(
        "mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground",
        className,
      )}
    >
      <span>
        {task.completedPomodoros}/{task.estimatedPomodoros} 个
        <img alt="番茄" src={IconTomato} className="w-7.5 inline" />
      </span>
      {task.priority !== "normal" && (
        <>
          <span aria-hidden="true" className="text-border">
            ·
          </span>
          <span className="inline-flex items-center gap-1">{priority.label}</span>
        </>
      )}
    </div>
  );
}
