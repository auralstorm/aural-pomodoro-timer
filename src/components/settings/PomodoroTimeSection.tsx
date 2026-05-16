import { POMODORO_PRESETS } from "@/constants/pomodoroPresets";
import type { PomodoroPreset as PomodoroPresetKey } from "@/types/settings";

import { NumberStepperSetting } from "./NumberStepperSetting";
import { SelectableSettingCard } from "./SelectableSettingCard";
import { SettingsSectionCard } from "./SettingsSectionCard";
import { settingsIcons } from "./settingsAssets";

type PomodoroTimeSectionProps = {
  focusMinutes: number;
  shortBreakMinutes: number;
  longBreakMinutes: number;
  longBreakInterval: number;
  pomodoroPreset: PomodoroPresetKey;
  onNumberChange: (key: "focusMinutes" | "shortBreakMinutes" | "longBreakMinutes" | "longBreakInterval", value: number) => void;
  onPresetSelect: (preset: (typeof POMODORO_PRESETS)[number]) => void;
};

export function PomodoroTimeSection({
  focusMinutes,
  shortBreakMinutes,
  longBreakMinutes,
  longBreakInterval,
  pomodoroPreset,
  onNumberChange,
  onPresetSelect,
}: PomodoroTimeSectionProps) {
  return (
    <SettingsSectionCard icon={settingsIcons.sectionTimer} title="番茄时间">
      <div className="grid grid-cols-[minmax(0,340px)_1fr] gap-5 max-lg:grid-cols-1">
        <div className="flex flex-col gap-3">
          <NumberStepperSetting
            icon={settingsIcons.itemFocusDuration}
            label="专注时长"
            onChange={(value) => onNumberChange("focusMinutes", value)}
            suffix="分钟"
            value={focusMinutes}
          />
          <NumberStepperSetting
            icon={settingsIcons.itemShortBreak}
            label="短休息"
            onChange={(value) => onNumberChange("shortBreakMinutes", value)}
            suffix="分钟"
            value={shortBreakMinutes}
          />
          <NumberStepperSetting
            icon={settingsIcons.itemLongBreak}
            label="长休息"
            onChange={(value) => onNumberChange("longBreakMinutes", value)}
            suffix="分钟"
            value={longBreakMinutes}
          />
          <NumberStepperSetting
            icon={settingsIcons.itemLongBreakTrigger}
            label="长休息触发"
            onChange={(value) => onNumberChange("longBreakInterval", value)}
            suffix="个番茄后"
            value={longBreakInterval}
          />
        </div>

        <div className="rounded-[var(--radius-lg)] border border-border bg-background p-4">
          <h3 className="text-sm font-black">预设方案</h3>
          <div className="mt-4 grid grid-cols-4 gap-3">
            {POMODORO_PRESETS.map((preset) => (
              <SelectableSettingCard
                className="min-h-32"
                icon={preset.icon}
                key={preset.key}
                onClick={() => onPresetSelect(preset)}
                selected={pomodoroPreset === preset.key}
                subtitle={`${preset.focusMinutes} / ${preset.shortBreakMinutes}`}
                title={preset.label}
              />
            ))}
            <SelectableSettingCard
              className="min-h-32"
              icon={settingsIcons.sectionTimer}
              onClick={() => undefined}
              selected={pomodoroPreset === "custom"}
              subtitle={`${focusMinutes} / ${shortBreakMinutes}`}
              title="自定义"
            />
          </div>
        </div>
      </div>
    </SettingsSectionCard>
  );
}
