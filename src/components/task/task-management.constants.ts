import type { TaskPriority } from "@/types/task";

export type TaskFilterValue = "all" | "today" | "inProgress" | "completed" | "important";

export const taskFilterOptions = [
  { value: "all" as const, label: "全部" },
  { value: "today" as const, label: "今日" },
  { value: "inProgress" as const, label: "进行中" },
  { value: "completed" as const, label: "已完成" },
  { value: "important" as const, label: "高优先级" },
];

export const taskPriorityOptions: { value: TaskPriority; label: string }[] = [
  { value: "normal", label: "普通" },
  { value: "important", label: "重要" },
  { value: "urgent", label: "紧急" },
];
