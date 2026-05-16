import { Music, Volume2 } from "lucide-react";

import { AppButton } from "@/components/common/AppButton";
import { Slider } from "@/components/ui/slider";
import type { ReminderTonePreset, WhiteNoisePreset } from "@/types/settings";
import { SelectableSettingCard } from "./SelectableSettingCard";
import { SettingsSectionCard } from "./SettingsSectionCard";
import { settingsIcons } from "./settingsAssets";

const reminderToneOptions = [
  { icon: settingsIcons.soundSoftTone, label: "轻柔", value: "soft" },
  { icon: settingsIcons.soundBell, label: "舒缓", value: "soothing" },
  { icon: settingsIcons.soundWoodfish, label: "皮卡丘", value: "pikachu" },
  { icon: settingsIcons.soundClearTone, label: "多啦A梦", value: "doraemon" },
] satisfies Array<{
  icon: string;
  label: string;
  value: ReminderTonePreset;
}>;

const whiteNoiseOptions: Array<{
  value: WhiteNoisePreset;
  label: string;
  icon: string;
}> = [
  { icon: settingsIcons.noiseRain, label: "雷声", value: "rain" },
  { icon: settingsIcons.noiseForest, label: "森林", value: "forest" },
  { icon: settingsIcons.noiseCafe, label: "溪流", value: "stream" },
  { icon: settingsIcons.noiseWave, label: "火焰", value: "fire" },
];

type SoundNoiseSectionProps = {
  reminderTonePreset: ReminderTonePreset;
  whiteNoisePreset: WhiteNoisePreset;
  volume: number;
  onPreviewReminderTone: () => void;
  onReminderToneChange: (preset: ReminderTonePreset) => void;
  onWhiteNoiseChange: (preset: WhiteNoisePreset) => void;
  onVolumeChange: (value: number) => void;
};

export function SoundNoiseSection({
  reminderTonePreset,
  whiteNoisePreset,
  volume,
  onPreviewReminderTone,
  onReminderToneChange,
  onWhiteNoiseChange,
  onVolumeChange,
}: SoundNoiseSectionProps) {
  return (
    <SettingsSectionCard icon={settingsIcons.sectionSound} title="声音与白噪音">
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-[80px_1fr] items-center gap-4">
          <span className="text-sm font-semibold text-foreground">提醒音</span>
          <div className="grid grid-cols-4 gap-3">
            {reminderToneOptions.map((option) => (
              <SelectableSettingCard
                className="min-h-11 flex-row"
                icon={option.icon}
                key={option.label}
                onClick={() => onReminderToneChange(option.value)}
                selected={reminderTonePreset === option.value}
                title={option.label}
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-[80px_1fr] items-center gap-4">
          <span className="text-sm font-semibold text-foreground">白噪音</span>
          <div className="grid grid-cols-4 gap-3">
            {whiteNoiseOptions.map((option) => (
              <SelectableSettingCard
                className="min-h-11 flex-row"
                icon={option.icon}
                key={option.value}
                onClick={() => onWhiteNoiseChange(option.value)}
                selected={whiteNoisePreset === option.value}
                title={option.label}
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-[80px_1fr_auto_auto] items-center gap-4">
          <span className="text-sm font-semibold text-foreground">音量调节</span>
          <div className="flex items-center gap-3">
            <Volume2 className="size-4 text-muted-foreground" />
            <Slider
              aria-label="音量调节"
              max={100}
              min={0}
              onValueChange={(value) => onVolumeChange(value[0] ?? volume)}
              value={[volume]}
            />
          </div>
          <span className="w-10 text-right text-sm text-muted-foreground">{volume}%</span>
          <AppButton
            className="h-9"
            icon={<Music className="size-4" />}
            onClick={onPreviewReminderTone}
            size="sm"
            variant="ghost"
          >
            播放预览
          </AppButton>
        </div>
      </div>
    </SettingsSectionCard>
  );
}
