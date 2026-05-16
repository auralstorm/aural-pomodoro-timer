import { create } from "zustand";
import { persist } from "zustand/middleware";

import { resolvePomodoroPresetKey } from "@/constants/pomodoroPresets";
import { DEFAULT_SETTINGS } from "@/constants/settings";
import { STORAGE_KEYS } from "@/constants/storage";
import type { ReminderTonePreset, SettingsStateData, WhiteNoisePreset } from "@/types/settings";

type SettingsStore = SettingsStateData & {
  updateSettings: (payload: Partial<SettingsStateData>) => void;
  resetSettings: () => void;
};

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      ...DEFAULT_SETTINGS,
      updateSettings: (payload) => set(payload),
      resetSettings: () => set(DEFAULT_SETTINGS),
    }),
    {
      name: STORAGE_KEYS.SETTINGS,
      version: 3,
      partialize: stripActions,
      migrate: migrateLegacySettings,
    },
  ),
);

function stripActions(state: SettingsStore): SettingsStateData {
  const { updateSettings: _updateSettings, resetSettings: _resetSettings, ...data } = state;
  return data;
}

function migrateLegacySettings(persistedState: unknown): SettingsStateData {
  if (persistedState && typeof persistedState === "object" && "data" in persistedState) {
    return normalizeLegacySettings((persistedState as { data: LegacySettingsData }).data);
  }

  return normalizeLegacySettings(persistedState as LegacySettingsData);
}

type LegacyReminderTonePreset = ReminderTonePreset | "bell" | "woodfish" | "clear";
type LegacyWhiteNoisePreset = WhiteNoisePreset | "cafe" | "waves";
type LegacySettingsData = Partial<
  Omit<SettingsStateData, "reminderTonePreset" | "whiteNoisePreset">
> & {
  notificationEnabled?: boolean;
  reminderTonePreset?: LegacyReminderTonePreset;
  whiteNoiseEnabled?: boolean;
  whiteNoisePreset?: LegacyWhiteNoisePreset;
};

export function normalizeLegacySettings(data: LegacySettingsData): SettingsStateData {
  const {
    whiteNoiseEnabled,
    notificationEnabled: legacyNotificationEnabled,
    ...settings
  } = data ?? {};
  return {
    ...DEFAULT_SETTINGS,
    ...settings,
    pomodoroPreset:
      settings.pomodoroPreset ??
      resolvePomodoroPresetKey({
        focusMinutes: settings.focusMinutes ?? DEFAULT_SETTINGS.focusMinutes,
        shortBreakMinutes: settings.shortBreakMinutes ?? DEFAULT_SETTINGS.shortBreakMinutes,
        longBreakMinutes: settings.longBreakMinutes ?? DEFAULT_SETTINGS.longBreakMinutes,
        longBreakInterval: settings.longBreakInterval ?? DEFAULT_SETTINGS.longBreakInterval,
      }),
    focusCompleteReminderEnabled:
      settings.focusCompleteReminderEnabled ??
      legacyNotificationEnabled ??
      DEFAULT_SETTINGS.focusCompleteReminderEnabled,
    breakCompleteReminderEnabled:
      settings.breakCompleteReminderEnabled ??
      legacyNotificationEnabled ??
      DEFAULT_SETTINGS.breakCompleteReminderEnabled,
    desktopNotificationEnabled:
      settings.desktopNotificationEnabled ??
      legacyNotificationEnabled ??
      DEFAULT_SETTINGS.desktopNotificationEnabled,
    reminderTonePreset: normalizeReminderTonePreset(settings.reminderTonePreset),
    whiteNoisePreset: normalizeWhiteNoisePreset(settings.whiteNoisePreset, whiteNoiseEnabled),
  };
}

function normalizeReminderTonePreset(
  preset: LegacyReminderTonePreset | undefined,
): ReminderTonePreset {
  if (preset === "bell") return "soothing";
  if (preset === "woodfish") return "pikachu";
  if (preset === "clear") return "doraemon";
  return preset ?? DEFAULT_SETTINGS.reminderTonePreset;
}

function normalizeWhiteNoisePreset(
  preset: LegacyWhiteNoisePreset | undefined,
  whiteNoiseEnabled?: boolean,
): WhiteNoisePreset {
  if (preset === "cafe") return "stream";
  if (preset === "waves") return "fire";
  return preset ?? (whiteNoiseEnabled ? "rain" : DEFAULT_SETTINGS.whiteNoisePreset);
}
