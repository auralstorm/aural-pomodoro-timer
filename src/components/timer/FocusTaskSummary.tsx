import { Plus } from "lucide-react";

import { AppButton } from "@/components/common/AppButton";
import IconPlan from "@/assets/icons/icon-plan.png";

type FocusTaskSummaryProps = {
  completedCount: number;
  totalCount: number;
  onCreateTask: () => void;
};

export function FocusTaskSummary({
  completedCount,
  totalCount,
  onCreateTask,
}: FocusTaskSummaryProps) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="min-w-0">
        <h2 className="flex items-center gap-2 text-l font-bold">
          <img src={IconPlan} alt="今日任务" className="size-8" /> 今日任务
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {totalCount > 0 ? `已完成 ${completedCount} / ${totalCount}` : "安排今天最重要的一件事"}
        </p>
      </div>
      <AppButton
        className="h-8 px-4 text-sm!"
        icon={<Plus aria-hidden="true" className="size-4" />}
        onClick={onCreateTask}
        size="sm"
      >
        添加任务
      </AppButton>
    </div>
  );
}
