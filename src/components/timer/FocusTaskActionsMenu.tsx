import { Edit3, MoreHorizontal, Pin, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Task } from "@/types/task";

type FocusTaskActionsMenuProps = {
  task: Task;
  isCurrent?: boolean;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onSetCurrent?: (taskId: string) => void;
};

export function FocusTaskActionsMenu({
  task,
  isCurrent,
  onEdit,
  onDelete,
  onSetCurrent,
}: FocusTaskActionsMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          aria-label="更多操作"
          className="grid size-9 place-items-center rounded-full text-muted-foreground transition hover:bg-muted"
          onClick={(event) => event.stopPropagation()}
          onPointerDown={(event) => event.stopPropagation()}
          type="button"
        >
          <MoreHorizontal aria-hidden="true" className="size-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-40 min-w-40"
        onClick={(event) => event.stopPropagation()}
      >
        {!isCurrent && task.status !== "completed" && onSetCurrent ? (
          <>
            <DropdownMenuItem
              onClick={(event) => {
                event.stopPropagation();
                onSetCurrent(task.id);
              }}
            >
              <Pin aria-hidden="true" className="size-4" />
              设为当前
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        ) : null}
        <DropdownMenuItem
          onClick={(event) => {
            event.stopPropagation();
            onEdit(task);
          }}
        >
          <Edit3 aria-hidden="true" className="size-4" />
          编辑
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={(event) => {
            event.stopPropagation();
            onDelete(task);
          }}
          variant="destructive"
        >
          <Trash2 aria-hidden="true" className="size-4" />
          删除
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
