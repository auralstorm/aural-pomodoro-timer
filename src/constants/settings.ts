import type { SettingsStateData } from "@/types/settings";

export const DEFAULT_SETTINGS: SettingsStateData = {
  focusMinutes: 25,
  shortBreakMinutes: 5,
  longBreakMinutes: 15,
  longBreakInterval: 4,
  pomodoroPreset: "classic",
  focusCompleteReminderEnabled: true,
  breakCompleteReminderEnabled: true,
  desktopNotificationEnabled: true,
  soundEnabled: true,
  reminderTonePreset: "soft",
  whiteNoisePreset: "off",
  autoStartNextRound: false,
  autoStartBreak: false,
  alwaysOnTop: false,
  assistantEnabled: false,
  minimizeToTray: false,
  theme: "cream",
  volume: 70,
};
