
import emptyTaskIllustration from "@/assets/empty/illus-empty-task.png";
import { EmptyState } from "@/components/common/EmptyState";

type FocusTaskEmptyStateProps = {
  onCreateTask?: () => void;
};

export function FocusTaskEmptyState({ onCreateTask }: FocusTaskEmptyStateProps) {
  void onCreateTask;

  return (
    <EmptyState
      className="h-full w-full justify-center"
      description="先安排今天最重要的一件事，再开始一轮更稳。"
      image={emptyTaskIllustration}
      title="今天先安排一件最重要的事"
    >
      {/* <div className="flex flex-wrap items-center justify-center gap-3">
        {onCreateTask ? <AppButton onClick={onCreateTask}>添加任务</AppButton> : null}
        <AppButton asChild variant="ghost">
          <Link to="/tasks">从全部任务中选择</Link>
        </AppButton>
      </div> */}
    </EmptyState>
  );
}
