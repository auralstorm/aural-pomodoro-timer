import { AlertCircle, Circle, Star } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import type { TaskPriority, TaskStatus } from "@/types/task";

// ── 优先级 ──────────────────────────────────────────

type PriorityConfig = {
  label: string;
  tone: "success" | "warning" | "danger";
  icon: LucideIcon;
  /** 排序权重，数值越小越靠前 */
  rank: number;
};

export const PRIORITY_MAP: Record<TaskPriority, PriorityConfig> = {
  normal: { label: "普通", tone: "success", icon: Circle, rank: 2 },
  important: { label: "重要", tone: "warning", icon: Star, rank: 1 },
  urgent: { label: "紧急", tone: "danger", icon: AlertCircle, rank: 0 },
};

export const PRIORITY_OPTIONS: { value: TaskPriority; label: string }[] = [
  { value: "normal", label: "普通" },
  { value: "important", label: "重要" },
  { value: "urgent", label: "紧急" },
];

// ── 任务状态 ────────────────────────────────────────

export const TASK_STATUS_LABEL: Record<TaskStatus, string> = {
  pending: "待开始",
  inProgress: "进行中",
  completed: "已完成",
};
