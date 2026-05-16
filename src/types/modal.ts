export type ModalType =
  | "focusComplete"
  | "longBreakReward"
  | "breakComplete"
  | "taskComplete"
  | "allTasksComplete"
  | "deleteTaskConfirm"
  | "actionConfirm"
  | "clearDataConfirm"
  | "achievementUnlocked";

export type ModalPayload = {
  taskId?: string;
  taskTitle?: string;
  minutes?: number;
  breakMode?: "shortBreak" | "longBreak";
  pomodoros?: number;
  achievementIds?: string[];
  achievementTitle?: string;
  confirmTitle?: string;
  confirmDescription?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmVariant?: "primary" | "danger" | "success";
  onConfirm?: () => void;
};
