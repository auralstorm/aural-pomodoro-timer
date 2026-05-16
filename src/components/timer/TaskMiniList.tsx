import { Link } from "react-router-dom";

import { AppCard } from "@/components/common/AppCard";
import { EmptyState } from "@/components/common/EmptyState";
import { TaskCard } from "@/components/task/TaskCard";
import emptyTask from "@/assets/empty/illus-empty-task.png";
import { startFocusTask } from "@/features/focus/currentTaskSelection";
import { useTaskStore } from "@/stores/taskStore";

export function TaskMiniList() {
  const { tasks, currentTaskId } = useTaskStore();
  const pendingTasks = tasks.filter((task) => task.status !== "completed").slice(0, 5);

  return (
    <AppCard className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">今日任务</h2>
        <Link
          className="rounded-[var(--radius-pill)] bg-[var(--color-tomato-soft)] px-4 py-2 text-sm font-semibold text-primary transition hover:bg-[var(--color-tomato-light)]"
          to="/tasks"
        >
          查看全部
        </Link>
      </div>

      {pendingTasks.length === 0 ? (
        <EmptyState
          description="添加一个小目标，再开始一轮更稳定。"
          image={emptyTask}
          title="还没有任务"
        />
      ) : (
        <div className="flex flex-col gap-3">
          {pendingTasks.map((task) => (
            <TaskCard
              compact
              isCurrent={task.id === currentTaskId}
              key={task.id}
              onStart={startFocusTask}
              task={task}
            />
          ))}
        </div>
      )}
    </AppCard>
  );
}
