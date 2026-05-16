import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { MoveRight } from "lucide-react";

import { AppCard } from "@/components/common/AppCard";
import { FocusTaskList } from "@/components/timer/FocusTaskList";
import { FocusTaskSummary } from "@/components/timer/FocusTaskSummary";
import { selectCurrentTask, startFocusTask } from "@/features/focus/currentTaskSelection";
import { TaskEditorDrawer } from "@/components/task/TaskEditorDrawer";
import {
  DEFAULT_TASK_EDITOR_VALUES,
  type TaskEditorMode,
  type TaskEditorValues,
} from "@/components/task/task-editor.types";
import { useModalStore } from "@/stores/modalStore";
import { useTaskStore } from "@/stores/taskStore";
import { useTimerStore } from "@/stores/timerStore";
import type { Task } from "@/types/task";

type FocusTaskCardProps = {
  onStartTask?: (taskId: string) => void;
};

export function FocusTaskCard({ onStartTask }: FocusTaskCardProps) {
  const { tasks, currentTaskId, createTask, updateTask, completeTask } = useTaskStore();
  const timerCurrentTaskId = useTimerStore((state) => state.currentTaskId);
  const timerMode = useTimerStore((state) => state.mode);
  const timerStatus = useTimerStore((state) => state.status);
  const resumeTimer = useTimerStore((state) => state.startTimer);
  const openModal = useModalStore((state) => state.openModal);

  const [editorOpen, setEditorOpen] = useState(false);
  const [editorMode, setEditorMode] = useState<TaskEditorMode>("create");
  const [editorValues, setEditorValues] = useState<TaskEditorValues>(DEFAULT_TASK_EDITOR_VALUES);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const completedCount = useMemo(
    () => tasks.filter((task) => task.status === "completed").length,
    [tasks],
  );
  const previewTasks = useMemo(() => {
    return tasks.filter((task) => task.status !== "completed" || task.id === currentTaskId);
  }, [currentTaskId, tasks]);

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
    if (!editorValues.title.trim()) {
      return;
    }

    if (editingTask) {
      updateTask(editingTask.id, editorValues);
    } else {
      createTask(editorValues);
    }

    closeEditor();
  }

  function handleToggleComplete(taskId: string) {
    if (timerMode === "focus" && timerCurrentTaskId === taskId && timerStatus === "running") {
      openModal("actionConfirm", {
        confirmTitle: "确认完成当前专注任务？",
        confirmDescription: "完成后会立即清空当前专注绑定，本轮专注不会继续关联这个任务。",
        confirmLabel: "确认完成",
        confirmVariant: "danger",
        onConfirm: () => completeTask(taskId),
      });
      return;
    }

    completeTask(taskId);
  }

  function handleSetCurrent(taskId: string) {
    if (
      timerMode === "focus" &&
      timerStatus === "running" &&
      timerCurrentTaskId &&
      timerCurrentTaskId !== taskId
    ) {
      openModal("actionConfirm", {
        confirmTitle: "确认切换当前任务？",
        confirmDescription: "切换当前任务会重置本轮专注，当前这一轮将不再关联原任务。",
        confirmLabel: "继续切换",
        onConfirm: () => selectCurrentTask(taskId),
      });
      return;
    }

    selectCurrentTask(taskId);
  }

  function handleStart(taskId: string) {
    if (timerMode === "focus" && timerStatus === "running" && timerCurrentTaskId === taskId) {
      return;
    }

    if (timerMode === "focus" && timerStatus === "paused" && timerCurrentTaskId === taskId) {
      resumeTimer();
      return;
    }

    if (
      timerMode === "focus" &&
      timerStatus === "running" &&
      timerCurrentTaskId &&
      timerCurrentTaskId !== taskId
    ) {
      openModal("actionConfirm", {
        confirmTitle: "确认切换专注任务？",
        confirmDescription: "切换任务会重置本轮专注，并立即用新任务开始这一轮计时。",
        confirmLabel: "切换并开始",
        onConfirm: () => {
          if (onStartTask) {
            onStartTask(taskId);
            return;
          }

          startFocusTask(taskId);
        },
      });
      return;
    }

    if (onStartTask) {
      onStartTask(taskId);
      return;
    }

    startFocusTask(taskId);
  }

  return (
    <>
      <AppCard className="grid grid-rows-[auto,minmax(0,1fr),auto] gap-4 p-6">
        <FocusTaskSummary
          completedCount={completedCount}
          onCreateTask={openCreateDrawer}
          totalCount={tasks.length}
        />

        <div className="flex min-h-[250px]">
          <FocusTaskList
            currentTaskId={currentTaskId}
            focusStatus={timerStatus}
            focusTaskId={timerCurrentTaskId}
            onDelete={(task) => {
              openModal("deleteTaskConfirm", {
                taskId: task.id,
                taskTitle: task.title,
              });
            }}
            onEdit={openEditDrawer}
            onSetCurrent={handleSetCurrent}
            onStart={handleStart}
            onToggleComplete={handleToggleComplete}
            tasks={previewTasks}
          />
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 border-border">
          {tasks.length > 4 ? (
            <div className="text-center">
              <Link
                className="inline-flex items-center gap-1 rounded-[var(--radius-pill)] text-sm font-semibold text-primary/70 transition hover:text-primary"
                to="/tasks"
              >
                查看全部任务 <MoveRight />
              </Link>
            </div>
          ) : null}
        </div>
      </AppCard>

      <TaskEditorDrawer
        mode={editorMode}
        onCancel={closeEditor}
        onOpenChange={(open) => {
          setEditorOpen(open);
          if (!open) {
            resetEditor();
          }
        }}
        onSubmit={submitTask}
        onValuesChange={setEditorValues}
        open={editorOpen}
        values={editorValues}
      />
    </>
  );
}
