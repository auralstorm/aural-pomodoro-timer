export type TaskPriority = "normal" | "important" | "urgent";

export type TaskStatus = "pending" | "inProgress" | "completed";

export type Task = {
  id: string;
  title: string;
  description?: string;
  priority: TaskPriority;
  status: TaskStatus;
  estimatedPomodoros: number;
  completedPomodoros: number;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
};

export type CreateTaskInput = {
  title: string;
  description?: string;
  priority: TaskPriority;
  estimatedPomodoros: number;
};

export type UpdateTaskInput = Partial<
  Pick<Task, "title" | "description" | "priority" | "estimatedPomodoros" | "status">
>;
