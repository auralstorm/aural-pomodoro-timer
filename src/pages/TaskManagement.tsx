import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { EmptyState } from "@/components/common/EmptyState";
import { PageLayout } from "@/components/layout/PageLayout";
import { TaskCard } from "@/components/task/TaskCard";
import { TaskEditorDrawer } from "@/components/task/TaskEditorDrawer";
import { TaskOverviewPanel } from "@/components/task/TaskOverviewPanel";
import {
  DEFAULT_TASK_EDITOR_VALUES,
  type TaskEditorMode,
  type TaskEditorValues,
} from "@/components/task/task-editor.types";
import { type TaskFilterValue } from "@/components/task/task-management.constants";
import { TaskToolbar } from "@/components/task/TaskToolbar";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import emptyTask from "@/assets/empty/illus-empty-task.png";
import { startFocusTask } from "@/features/focus/currentTaskSelection";
import { useModalStore } from "@/stores/modalStore";
import { useSettingsStore } from "@/stores/settingsStore";
import { useStatsStore } from "@/stores/statsStore";
import { useTaskStore } from "@/stores/taskStore";
import type { Task } from "@/types/task";
import { calculateTodayStats, calculateCompletionRate } from "@/utils/stats";

const TASKS_PER_PAGE = 5;

function buildPaginationItems(currentPage: number, totalPages: number) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (currentPage <= 4) {
    return [1, 2, 3, 4, 5, "ellipsis-end", totalPages] as const;
  }

  if (currentPage >= totalPages - 3) {
    return [
      1,
      "ellipsis-start",
      totalPages - 4,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ] as const;
  }

  return [
    1,
    "ellipsis-start",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "ellipsis-end",
    totalPages,
  ] as const;
}

export function TaskManagement() {
  const navigate = useNavigate();
  const sessions = useStatsStore((state) => state.sessions);
  const focusMinutes = useSettingsStore((state) => state.focusMinutes);
  const { tasks, currentTaskId, createTask, updateTask, completeTask } = useTaskStore();
  const openModal = useModalStore((state) => state.openModal);
  const [filter, setFilter] = useState<TaskFilterValue>("today");
  const [editorOpen, setEditorOpen] = useState(false);
  const [editorMode, setEditorMode] = useState<TaskEditorMode>("create");
  const [editorValues, setEditorValues] = useState<TaskEditorValues>(DEFAULT_TASK_EDITOR_VALUES);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      if (filter === "completed") return task.status === "completed";
      if (filter === "inProgress") return task.status === "inProgress";
      if (filter === "important") return task.priority !== "normal";
      return true;
    });
  }, [filter, tasks]);
  const totalPages = Math.max(1, Math.ceil(filteredTasks.length / TASKS_PER_PAGE));
  const paginatedTasks = useMemo(() => {
    const startIndex = (currentPage - 1) * TASKS_PER_PAGE;
    return filteredTasks.slice(startIndex, startIndex + TASKS_PER_PAGE);
  }, [currentPage, filteredTasks]);
  const paginationItems = useMemo(
    () => buildPaginationItems(currentPage, totalPages),
    [currentPage, totalPages],
  );

  const completedCount = tasks.filter((task) => task.status === "completed").length;
  const remainingCount = Math.max(0, tasks.length - completedCount);
  const completionRate = calculateCompletionRate(tasks);
  const totalEstimatedPomodoros = tasks.reduce((sum, task) => sum + task.estimatedPomodoros, 0);
  const todayStats = calculateTodayStats(sessions);
  const totalCompletedPomodoros = todayStats.completedPomodoros;
  const totalCompletedFocusMinutes = todayStats.focusMinutes;
  const estimatedFocusMinutes = totalEstimatedPomodoros * focusMinutes;

  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  useEffect(() => {
    setCurrentPage((page) => Math.min(page, totalPages));
  }, [totalPages]);

  function resetEditor() {
    setEditorMode("create");
    setEditingTask(null);
    setEditorValues(DEFAULT_TASK_EDITOR_VALUES);
  }

  function openCreateDrawer() {
    resetEditor();
    setEditorOpen(true);
  }

  function openEditDrawer(task: Task) {
    setEditorMode("edit");
    setEditingTask(task);
    setEditorValues({
      title: task.title,
      description: task.description ?? "",
      estimatedPomodoros: task.estimatedPomodoros,
      priority: task.priority,
    });
    setEditorOpen(true);
  }

  function closeEditor() {
    setEditorOpen(false);
    resetEditor();
  }

  function submitTask() {
    if (!editorValues.title.trim()) return;

    if (editingTask) {
      updateTask(editingTask.id, editorValues);
    } else {
      createTask(editorValues);
    }

    closeEditor();
  }

  function startTask(taskId: string) {
    startFocusTask(taskId);
    navigate("/focus");
  }

  function changePage(page: number) {
    if (page < 1 || page > totalPages || page === currentPage) return;
    setCurrentPage(page);
  }

  return (
    <PageLayout subtitle="把任务拆小，一颗番茄一个目标" title="今日任务">
      <div className="grid items-stretch grid-cols-[minmax(0,1fr)_400px] gap-6 max-xl:grid-cols-1">
        <div className="flex h-full min-h-0 flex-col gap-5">
          <TaskToolbar filter={filter} onCreateTask={openCreateDrawer} onFilterChange={setFilter} />

          <div className="flex-1 min-h-0">
            {filteredTasks.length === 0 ? (
              <EmptyState
                className="h-full min-h-[480px] justify-center"
                description="先添加一个能在 1-3 个番茄内推进的小目标。"
                image={emptyTask}
                title="暂无任务"
              />
            ) : (
              <div className="flex flex-col">
                <div className="flex flex-col gap-3 rounded-xl border border-border border-dashed bg-card px-5 py-5">
                  {paginatedTasks.map((task) => (
                    <TaskCard
                      isCurrent={task.id === currentTaskId}
                      key={task.id}
                      onComplete={completeTask}
                      onDelete={(targetTask) =>
                        openModal("deleteTaskConfirm", {
                          taskId: targetTask.id,
                          taskTitle: targetTask.title,
                        })
                      }
                      onEdit={openEditDrawer}
                      onStart={startTask}
                      task={task}
                    />
                  ))}
                </div>

                {totalPages > 1 ? (
                  <Pagination className="mt-5 justify-center">
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          aria-disabled={currentPage === 1}
                          className={
                            currentPage === 1 ? "pointer-events-none opacity-50" : undefined
                          }
                          href="#"
                          onClick={(event) => {
                            event.preventDefault();
                            changePage(currentPage - 1);
                          }}
                          text="上一页"
                        />
                      </PaginationItem>

                      {paginationItems.map((item, index) => (
                        <PaginationItem key={`${item}-${index}`}>
                          {typeof item === "number" ? (
                            <PaginationLink
                              href="#"
                              isActive={item === currentPage}
                              onClick={(event) => {
                                event.preventDefault();
                                changePage(item);
                              }}
                            >
                              {item}
                            </PaginationLink>
                          ) : (
                            <PaginationEllipsis />
                          )}
                        </PaginationItem>
                      ))}

                      <PaginationItem>
                        <PaginationNext
                          aria-disabled={currentPage === totalPages}
                          className={
                            currentPage === totalPages
                              ? "pointer-events-none opacity-50"
                              : undefined
                          }
                          href="#"
                          onClick={(event) => {
                            event.preventDefault();
                            changePage(currentPage + 1);
                          }}
                          text="下一页"
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                ) : null}
              </div>
            )}
          </div>
        </div>

        <TaskOverviewPanel
          completedCount={completedCount}
          completionRate={completionRate}
          completionRateDelta={undefined}
          completedPomodoroDelta={undefined}
          estimatedFocusMinutes={estimatedFocusMinutes}
          estimatedPomodoroDelta={undefined}
          remainingCount={remainingCount}
          remainingCountDelta={undefined}
          totalCompletedPomodoros={totalCompletedPomodoros}
          totalCompletedFocusMinutes={totalCompletedFocusMinutes}
          totalEstimatedPomodoros={totalEstimatedPomodoros}
          totalTasks={tasks.length}
        />
      </div>

      <TaskEditorDrawer
        mode={editorMode}
        onCancel={closeEditor}
        onOpenChange={(open) => {
          setEditorOpen(open);
          if (!open) resetEditor();
        }}
        onSubmit={submitTask}
        onValuesChange={setEditorValues}
        open={editorOpen}
        values={editorValues}
      />
    </PageLayout>
  );
}
