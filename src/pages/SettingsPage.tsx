import { useEffect } from "react";
import { RotateCcw } from "lucide-react";
import { toast } from "sonner";

import { AppButton } from "@/components/common/AppButton";
import { PageLayout } from "@/components/layout/PageLayout";
import { AutomationSettingsSection } from "@/components/settings/AutomationSettingsSection";
import { LocalDataSection } from "@/components/settings/LocalDataSection";
import { PomodoroTimeSection } from "@/components/settings/PomodoroTimeSection";
import { ReminderSettingsSection } from "@/components/settings/ReminderSettingsSection";
import { SoundNoiseSection } from "@/components/settings/SoundNoiseSection";
import { ThemeAppearanceSection } from "@/components/settings/ThemeAppearanceSection";
import {
  playReminderTone,
  playWhiteNoise,
  setWhiteNoiseVolume,
  stopWhiteNoise,
} from "@/features/audio/audioController";
import { useModalStore } from "@/stores/modalStore";
import { useSettingsStore } from "@/stores/settingsStore";

export function SettingsPage() {
  const settings = useSettingsStore();
  const openModal = useModalStore((state) => state.openModal);

  useEffect(() => {
    if (settings.whiteNoisePreset === "off") {
      stopWhiteNoise();
      return;
    }

    setWhiteNoiseVolume(settings.volume);
  }, [settings.volume, settings.whiteNoisePreset]);

  useEffect(() => {
    return () => {
      stopWhiteNoise();
    };
  }, []);

  function updateTimerNumber(
    key: "focusMinutes" | "shortBreakMinutes" | "longBreakMinutes" | "longBreakInterval",
    value: number,
  ) {
    settings.updateSettings({
      [key]: Math.max(1, value),
      pomodoroPreset: "custom",
    });
  }

  function previewReminderTone(preset = settings.reminderTonePreset) {
    void playReminderTone(preset, settings.volume);
  }

  function previewWhiteNoise(preset: typeof settings.whiteNoisePreset) {
    void playWhiteNoise(preset, settings.volume);
  }

  function resetSettings() {
    settings.resetSettings();
    toast.success("已恢复默认设置");
  }

  return (
    <PageLayout
      action={
        <div className="flex gap-3">
          <AppButton
            icon={<RotateCcw aria-hidden="true" className="size-5" />}
            onClick={resetSettings}
            variant="ghost"
          >
            恢复默认
          </AppButton>
        </div>
      }
      subtitle="调整你的番茄节奏，让专注更适合自己"
      title="设置"
    >
      <div className="flex min-w-0 flex-col gap-5">
        <div className="grid grid-cols-[1.2fr_0.8fr] items-stretch gap-5 max-xl:grid-cols-1">
          <PomodoroTimeSection
            focusMinutes={settings.focusMinutes}
            longBreakInterval={settings.longBreakInterval}
            longBreakMinutes={settings.longBreakMinutes}
            onNumberChange={updateTimerNumber}
            onPresetSelect={(preset) =>
              settings.updateSettings({
                focusMinutes: preset.focusMinutes,
                longBreakInterval: preset.longBreakInterval,
                longBreakMinutes: preset.longBreakMinutes,
                pomodoroPreset: preset.key,
                shortBreakMinutes: preset.shortBreakMinutes,
              })
            }
            pomodoroPreset={settings.pomodoroPreset}
            shortBreakMinutes={settings.shortBreakMinutes}
          />
          <ReminderSettingsSection
            breakCompleteReminderEnabled={settings.breakCompleteReminderEnabled}
            desktopNotificationEnabled={settings.desktopNotificationEnabled}
            focusCompleteReminderEnabled={settings.focusCompleteReminderEnabled}
            onBreakCompleteReminderChange={(breakCompleteReminderEnabled) =>
              settings.updateSettings({ breakCompleteReminderEnabled })
            }
            onDesktopNotificationChange={(desktopNotificationEnabled) =>
              settings.updateSettings({ desktopNotificationEnabled })
            }
            onFocusCompleteReminderChange={(focusCompleteReminderEnabled) =>
              settings.updateSettings({ focusCompleteReminderEnabled })
            }
            onSoundChange={(soundEnabled) => settings.updateSettings({ soundEnabled })}
            soundEnabled={settings.soundEnabled}
          />
        </div>

        <div className="grid grid-cols-[1.2fr_0.8fr] items-stretch gap-5 max-xl:grid-cols-1">
          <SoundNoiseSection
            onPreviewReminderTone={() => previewReminderTone()}
            onReminderToneChange={(reminderTonePreset) => {
              settings.updateSettings({ reminderTonePreset });
              previewReminderTone(reminderTonePreset);
            }}
            onVolumeChange={(volume) => settings.updateSettings({ volume })}
            onWhiteNoiseChange={(whiteNoisePreset) => {
              settings.updateSettings({ whiteNoisePreset });
              previewWhiteNoise(whiteNoisePreset);
            }}
            reminderTonePreset={settings.reminderTonePreset}
            volume={settings.volume}
            whiteNoisePreset={settings.whiteNoisePreset}
          />
          <AutomationSettingsSection
            alwaysOnTop={settings.alwaysOnTop}
            assistantEnabled={settings.assistantEnabled}
            autoStartBreak={settings.autoStartBreak}
            autoStartNextRound={settings.autoStartNextRound}
            minimizeToTray={settings.minimizeToTray}
            onChange={(key, checked) => settings.updateSettings({ [key]: checked })}
          />
        </div>

        <div className="grid grid-cols-[1.2fr_0.8fr] items-stretch gap-5 max-xl:grid-cols-1">
          <ThemeAppearanceSection
            onThemeChange={(theme) => settings.updateSettings({ theme })}
            theme={settings.theme}
          />
          <LocalDataSection onClearData={() => openModal("clearDataConfirm")} />
        </div>
      </div>
    </PageLayout>
  );
}
