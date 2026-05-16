import { create } from "zustand";
import { persist } from "zustand/middleware";

import { STORAGE_KEYS } from "@/constants/storage";
import { clearTimerTaskBindingForTask } from "@/features/focus/focusTaskBinding";
import type { CreateTaskInput, Task, UpdateTaskInput } from "@/types/task";
import { createId } from "@/utils/id";

type TaskStoreData = {
  tasks: Task[];
  currentTaskId?: string;
};

type TaskStore = TaskStoreData & {
  createTask: (input: CreateTaskInput) => Task;
  updateTask: (taskId: string, input: UpdateTaskInput) => void;
  deleteTask: (taskId: string) => void;
  completeTask: (taskId: string) => void;
  releaseCurrentTask: (taskId?: string) => void;
  setCurrentTask: (taskId?: string) => void;
  incrementTaskPomodoro: (taskId: string) => Task | undefined;
  clearTasks: () => void;
};

export const useTaskStore = create<TaskStore>()(
  persist(
    (set, get) => ({
      tasks: [],
      currentTaskId: undefined,
      createTask: (input) => {
        const now = new Date().toISOString();
        const task: Task = {
          id: createId("task"),
          title: input.title.trim(),
          description: input.description?.trim() || undefined,
          priority: input.priority,
          status: "pending",
          estimatedPomodoros: Math.max(1, input.estimatedPomodoros),
          completedPomodoros: 0,
          createdAt: now,
          updatedAt: now,
        };
        set({ tasks: [task, ...get().tasks] });
        return task;
      },
      updateTask: (taskId, input) => {
        const isCompletingTask = input.status === "completed";
        const currentTaskId =
          isCompletingTask && get().currentTaskId === taskId
            ? undefined
            : get().currentTaskId;
        const tasks = get().tasks.map((task) =>
          task.id === taskId
            ? {
                ...task,
                ...input,
                title: input.title?.trim() ?? task.title,
                description: input.description?.trim() || input.description,
                updatedAt: new Date().toISOString(),
              }
            : task,
        );
        set({ tasks, currentTaskId });

        if (isCompletingTask) {
          clearTimerTaskBindingForTask(taskId);
        }
      },
      deleteTask: (taskId) => {
        const currentTaskId =
          get().currentTaskId === taskId ? undefined : get().currentTaskId;
        set({
          tasks: get().tasks.filter((task) => task.id !== taskId),
          currentTaskId,
        });
        clearTimerTaskBindingForTask(taskId);
      },
      completeTask: (taskId) => {
        const now = new Date().toISOString();
        const currentTaskId =
          get().currentTaskId === taskId ? undefined : get().currentTaskId;
        const tasks = get().tasks.map((task) =>
          task.id === taskId
            ? {
                ...task,
                status: "completed" as const,
                completedAt: now,
                updatedAt: now,
              }
            : task,
        );
        set({ tasks, currentTaskId });
        clearTimerTaskBindingForTask(taskId);
      },
      releaseCurrentTask: (taskId) => {
        const targetTaskId = taskId ?? get().currentTaskId;
        const shouldClearCurrent =
          !targetTaskId || get().currentTaskId === targetTaskId;
        const tasks = get().tasks.map((task) => {
          if (task.id !== targetTaskId) {
            return task;
          }

          if (task.status !== "inProgress") {
            return task;
          }

          return {
            ...task,
            status: "pending" as const,
            updatedAt: new Date().toISOString(),
          };
        });

        set({
          tasks,
          currentTaskId: shouldClearCurrent ? undefined : get().currentTaskId,
        });

        clearTimerTaskBindingForTask(targetTaskId);
      },
      setCurrentTask: (taskId) => {
        const tasks = get().tasks.map((task) => {
          if (task.id === taskId && task.status !== "completed") {
            return {
              ...task,
              status: "inProgress" as const,
              updatedAt: new Date().toISOString(),
            };
          }
          if (task.status === "inProgress") {
            return {
              ...task,
              status: "pending" as const,
              updatedAt: new Date().toISOString(),
            };
          }
          return task;
        });
        set({ tasks, currentTaskId: taskId });
      },
      incrementTaskPomodoro: (taskId) => {
        let updatedTask: Task | undefined;
        const now = new Date().toISOString();
        const tasks = get().tasks.map((task) => {
          if (task.id !== taskId) {
            return task;
          }

          const completedPomodoros = task.completedPomodoros + 1;
          const isCompleted = completedPomodoros >= task.estimatedPomodoros;
          updatedTask = {
            ...task,
            completedPomodoros,
            status: isCompleted ? "completed" : "inProgress",
            completedAt: isCompleted ? now : task.completedAt,
            updatedAt: now,
          };
          return updatedTask;
        });
        const currentTaskId =
          updatedTask?.status === "completed" && get().currentTaskId === taskId
            ? undefined
            : get().currentTaskId;
        set({ tasks, currentTaskId });

        if (updatedTask?.status === "completed") {
          clearTimerTaskBindingForTask(taskId);
        }

        return updatedTask;
      },
      clearTasks: () => {
        set({ tasks: [], currentTaskId: undefined });
      },
    }),
    {
      name: STORAGE_KEYS.TASKS,
      version: 1,
      partialize: ({ tasks, currentTaskId }) => ({ tasks, currentTaskId }),
      migrate: migrateLegacyTasks,
    },
  ),
);

function migrateLegacyTasks(persistedState: unknown): TaskStoreData {
  if (
    persistedState &&
    typeof persistedState === "object" &&
    "data" in persistedState
  ) {
    const data = (persistedState as { data: Partial<TaskStoreData> }).data;
    return {
      tasks: data.tasks ?? [],
      currentTaskId: data.currentTaskId,
    };
  }

  const data = persistedState as Partial<TaskStoreData>;
  return {
    tasks: data?.tasks ?? [],
    currentTaskId: data?.currentTaskId,
  };
}
