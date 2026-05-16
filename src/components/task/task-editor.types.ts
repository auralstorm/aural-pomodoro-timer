import type { Task, TaskPriority } from "@/types/task";

export type TaskEditorMode = "create" | "edit";

export type TaskEditorValues = {
  title: string;
  description: string;
  estimatedPomodoros: number;
  priority: TaskPriority;
};

export type TaskEditorState = {
  mode: TaskEditorMode;
  task: Task | null;
  values: TaskEditorValues;
};

export const DEFAULT_TASK_EDITOR_VALUES: TaskEditorValues = {
  title: "",
  description: "",
  estimatedPomodoros: 2,
  priority: "normal",
};
