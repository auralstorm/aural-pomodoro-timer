import { settingsIcons } from "@/components/settings/settingsAssets";

export type PomodoroPresetKey = "classic" | "deepFocus" | "light" | "custom";

export type PomodoroPresetConfig = {
  key: Exclude<PomodoroPresetKey, "custom">;
  label: string;
  icon: string;
  focusMinutes: number;
  shortBreakMinutes: number;
  longBreakMinutes: number;
  longBreakInterval: number;
};
export const POMODORO_PRESETS: PomodoroPresetConfig[] = [
  {
    key: "classic",
    label: "经典",
    icon: settingsIcons.presetClassic,
    focusMinutes: 25,
    shortBreakMinutes: 5,
    longBreakMinutes: 15,
    longBreakInterval: 4,
  },
  {
    key: "deepFocus",
    label: "深度专注",
    icon: settingsIcons.presetDeepFocus,
    focusMinutes: 50,
    shortBreakMinutes: 10,
    longBreakMinutes: 20,
    longBreakInterval: 4,
  },
  {
    key: "light",
    label: "轻量模式",
    icon: settingsIcons.presetLight,
    focusMinutes: 15,
    shortBreakMinutes: 3,
    longBreakMinutes: 10,
    longBreakInterval: 4,
  },
];

export function resolvePomodoroPresetKey(values: {
  focusMinutes: number;
  shortBreakMinutes: number;
  longBreakMinutes: number;
  longBreakInterval: number;
}): PomodoroPresetKey {
  const matchedPreset = POMODORO_PRESETS.find((preset) =>
    preset.focusMinutes === values.focusMinutes &&
    preset.shortBreakMinutes === values.shortBreakMinutes &&
    preset.longBreakMinutes === values.longBreakMinutes &&
    preset.longBreakInterval === values.longBreakInterval,
  );

  return matchedPreset?.key ?? "custom";
}
