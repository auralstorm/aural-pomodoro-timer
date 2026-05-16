export type AppTheme = "cream" | "tomato" | "mint" | "darkFocus";
export type PomodoroPreset = "classic" | "deepFocus" | "light" | "custom";
export type ReminderTonePreset = "soft" | "soothing" | "pikachu" | "doraemon";
export type WhiteNoisePreset = "off" | "rain" | "forest" | "stream" | "fire";
export type ActiveWhiteNoisePreset = Exclude<WhiteNoisePreset, "off">;

export type SettingsStateData = {
  focusMinutes: number;
  shortBreakMinutes: number;
  longBreakMinutes: number;
  longBreakInterval: number;
  pomodoroPreset: PomodoroPreset;
  focusCompleteReminderEnabled: boolean;
  breakCompleteReminderEnabled: boolean;
  desktopNotificationEnabled: boolean;
  soundEnabled: boolean;
  reminderTonePreset: ReminderTonePreset;
  whiteNoisePreset: WhiteNoisePreset;
  autoStartNextRound: boolean;
  autoStartBreak: boolean;
  alwaysOnTop: boolean;
  assistantEnabled: boolean;
  minimizeToTray: boolean;
  theme: AppTheme;
  volume: number;
};
