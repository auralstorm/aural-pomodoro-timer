export const STORAGE_VERSION = 1 as const;

export const STORAGE_KEYS = {
  TASKS: "tomato-focus:tasks",
  CURRENT_TASK: "tomato-focus:current-task",
  ACHIEVEMENTS: "tomato-focus:achievements",
  SETTINGS: "tomato-focus:settings",
  SESSIONS: "tomato-focus:sessions",
  TIMER: "tomato-focus:timer",
} as const;
