import { beforeEach, describe, expect, it } from "vitest";

import { DEFAULT_SETTINGS } from "@/constants/settings";
import { normalizeLegacySettings, useSettingsStore } from "./settingsStore";

describe("settings store", () => {
  beforeEach(() => {
    localStorage.clear();
    useSettingsStore.setState(DEFAULT_SETTINGS);
  });

  it("updates and resets settings", () => {
    useSettingsStore.getState().updateSettings({ focusMinutes: 45 });

    expect(useSettingsStore.getState().focusMinutes).toBe(45);

    useSettingsStore.getState().resetSettings();

    expect(useSettingsStore.getState().focusMinutes).toBe(
      DEFAULT_SETTINGS.focusMinutes,
    );
  });

  it("persists with Zustand persist metadata", () => {
    useSettingsStore.getState().updateSettings({ focusMinutes: 40 });

    expect(JSON.parse(localStorage.getItem("tomato-focus:settings") ?? "{}")).toMatchObject({
      state: { focusMinutes: 40 },
      version: 3,
    });
  });

  it("stores the selected built-in white noise preset", () => {
    expect(useSettingsStore.getState().whiteNoisePreset).toBe("off");

    useSettingsStore.getState().updateSettings({ whiteNoisePreset: "stream" });

    expect(useSettingsStore.getState().whiteNoisePreset).toBe("stream");
  });

  it("stores the selected reminder tone preset", () => {
    expect(useSettingsStore.getState().reminderTonePreset).toBe("soft");

    useSettingsStore.getState().updateSettings({ reminderTonePreset: "soothing" });

    expect(useSettingsStore.getState().reminderTonePreset).toBe("soothing");
  });

  it("normalizes legacy sound preset names to current audio resource names", () => {
    expect(
      normalizeLegacySettings({
        reminderTonePreset: "bell",
        whiteNoisePreset: "cafe",
      }),
    ).toMatchObject({
      reminderTonePreset: "soothing",
      whiteNoisePreset: "stream",
    });

    expect(
      normalizeLegacySettings({
        reminderTonePreset: "woodfish",
        whiteNoisePreset: "waves",
      }),
    ).toMatchObject({
      reminderTonePreset: "pikachu",
      whiteNoisePreset: "fire",
    });
  });

  it("maps legacy notificationEnabled to split reminder toggles", () => {
    expect(
      normalizeLegacySettings({
        notificationEnabled: false,
      }),
    ).toMatchObject({
      focusCompleteReminderEnabled: false,
      breakCompleteReminderEnabled: false,
      desktopNotificationEnabled: false,
    });

    expect(
      normalizeLegacySettings({
        notificationEnabled: true,
      }),
    ).toMatchObject({
      focusCompleteReminderEnabled: true,
      breakCompleteReminderEnabled: true,
      desktopNotificationEnabled: true,
    });
  });

  it("derives built-in or custom pomodoro preset from saved timer values", () => {
    expect(
      normalizeLegacySettings({
        focusMinutes: 50,
        shortBreakMinutes: 10,
        longBreakMinutes: 20,
        longBreakInterval: 4,
      }).pomodoroPreset,
    ).toBe("deepFocus");

    expect(
      normalizeLegacySettings({
        focusMinutes: 60,
        shortBreakMinutes: 10,
        longBreakMinutes: 20,
        longBreakInterval: 4,
      }).pomodoroPreset,
    ).toBe("custom");
  });
});
