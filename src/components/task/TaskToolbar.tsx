import { Plus } from "lucide-react";

import { AppButton } from "@/components/common/AppButton";
import { SegmentedTabs } from "@/components/common/SegmentedTabs";
import {
  taskFilterOptions,
  type TaskFilterValue,
} from "@/components/task/task-management.constants";

type TaskToolbarProps = {
  filter: TaskFilterValue;
  onFilterChange: (value: TaskFilterValue) => void;
  onCreateTask: () => void;
};

export function TaskToolbar({ filter, onFilterChange, onCreateTask }: TaskToolbarProps) {
  return (
    <div className="flex items-center justify-between gap-4 max-md:flex-col max-md:items-stretch">
      <SegmentedTabs options={taskFilterOptions} onChange={onFilterChange} value={filter} />
      <div className="flex items-center gap-3 self-end max-md:self-stretch">
        <AppButton
          className="h-10 rounded-2xl"
          icon={<Plus aria-hidden="true" className="size-5" />}
          onClick={onCreateTask}
        >
          新建任务
        </AppButton>
      </div>
    </div>
  );
}
