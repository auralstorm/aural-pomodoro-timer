import emptyTaskIllustration from "@/assets/empty/illus-empty-task.png";
import { EmptyState } from "@/components/common/EmptyState";

export function FocusTaskEmptyState() {
  return (
    <EmptyState
      className="h-full w-full justify-center"
      description="先安排今天最重要的一件事，再开始一轮更稳。"
      image={emptyTaskIllustration}
      title="今天先安排一件最重要的事"
    />
  );
}
