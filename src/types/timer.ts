export type TimerMode = "focus" | "shortBreak" | "longBreak";

export type TimerStatus = "idle" | "running" | "paused" | "completed";

export type PomodoroSession = {
  id: string;
  taskId?: string;
  mode: TimerMode;
  startedAt: string;
  endedAt: string;
  durationMinutes: number;
  completed: boolean;
};

export type TimerStateSnapshot = {
  mode: TimerMode;
  status: TimerStatus;
  totalSeconds: number;
  startedAt?: string;
  pausedAt?: string;
  pausedAccumulatedMs: number;
  currentTaskId?: string;
  completedPomodorosInCycle: number;
};
