import { Bell, ChevronDown, Maximize2, Music2, RefreshCcw, Settings2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useMemo, useRef } from "react";

import { AppCard } from "@/components/common/AppCard";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { playReminderTone, playWhiteNoise, stopWhiteNoise } from "@/features/audio/audioController";
import {
  getReminderToneAudio,
  getWhiteNoiseAudio,
  reminderToneAudioConfig,
  whiteNoiseAudioConfig,
} from "@/features/audio/audioConfig";
import { useAudioRuntimeStore } from "@/features/audio/audioRuntimeStore";
import { cn } from "@/lib/utils";
import { useSettingsStore } from "@/stores/settingsStore";
import type { ReminderTonePreset, WhiteNoisePreset } from "@/types/settings";
import IconPlan from "@/assets/icons/icon-tool.png";

const reminderOptions = Object.entries(reminderToneAudioConfig).map(([value, config]) => ({
  value: value as ReminderTonePreset,
  label: `${config.label}提示音`,
}));

const whiteNoiseOptions = Object.entries(whiteNoiseAudioConfig).map(([value, config]) => ({
  value: value as Exclude<WhiteNoisePreset, "off">,
  label: config.label,
}));

export function FocusTools() {
  const settings = useSettingsStore();
  const isWhiteNoisePlaying = useAudioRuntimeStore((state) => state.isWhiteNoisePlaying);
  const lastWhiteNoisePresetRef = useRef<Exclude<WhiteNoisePreset, "off">>(
    settings.whiteNoisePreset === "off" ? "rain" : settings.whiteNoisePreset,
  );

  useEffect(() => {
    if (settings.whiteNoisePreset !== "off") {
      lastWhiteNoisePresetRef.current = settings.whiteNoisePreset;
    }
  }, [settings.whiteNoisePreset]);

  const reminderLabel = useMemo(
    () => `${getReminderToneAudio(settings.reminderTonePreset).label}提示音`,
    [settings.reminderTonePreset],
  );

  const whiteNoiseLabel = useMemo(() => {
    if (settings.whiteNoisePreset === "off") {
      return getWhiteNoiseAudio(lastWhiteNoisePresetRef.current).label;
    }
    return getWhiteNoiseAudio(settings.whiteNoisePreset).label;
  }, [settings.whiteNoisePreset]);

  async function handleReminderPresetChange(preset: ReminderTonePreset) {
    settings.updateSettings({
      reminderTonePreset: preset,
      soundEnabled: true,
    });
    await playReminderTone(preset, settings.volume);
  }

  async function handleReminderToggle() {
    const nextEnabled = !settings.soundEnabled;
    settings.updateSettings({ soundEnabled: nextEnabled });
    if (nextEnabled) {
      await playReminderTone(settings.reminderTonePreset, settings.volume);
    }
  }

  async function handleWhiteNoisePresetChange(preset: Exclude<WhiteNoisePreset, "off">) {
    lastWhiteNoisePresetRef.current = preset;
    settings.updateSettings({ whiteNoisePreset: preset });
    await playWhiteNoise(preset, settings.volume);
  }

  async function handleWhiteNoiseToggle() {
    if (isWhiteNoisePlaying) {
      stopWhiteNoise();
      return;
    }

    const nextPreset =
      settings.whiteNoisePreset === "off"
        ? lastWhiteNoisePresetRef.current
        : settings.whiteNoisePreset;

    if (settings.whiteNoisePreset === "off") {
      settings.updateSettings({ whiteNoisePreset: nextPreset });
    }

    await playWhiteNoise(nextPreset, settings.volume);
  }

  return (
    <AppCard className="flex flex-col gap-4 p-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-l font-bold flex items-center gap-2">
          <img src={IconPlan} alt="专注工具" className="size-8" /> 专注工具
        </h2>
        <Link
          aria-label="打开专注工具设置"
          className="grid size-8 place-items-center rounded-full border border-border bg-background text-muted-foreground transition hover:border-primary/30 hover:text-primary"
          to="/settings"
        >
          <Settings2 aria-hidden="true" className="size-4" />
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 max-sm:grid-cols-1" data-testid="focus-tools-list">
        <SelectableFocusToolCard
          enabled={isWhiteNoisePlaying}
          icon={Music2}
          iconClassName="bg-[var(--color-tomato-soft)] text-primary"
          onSelect={handleWhiteNoisePresetChange}
          onToggle={handleWhiteNoiseToggle}
          options={whiteNoiseOptions}
          title="白噪音"
          triggerLabel="选择白噪音"
          value={
            settings.whiteNoisePreset === "off"
              ? lastWhiteNoisePresetRef.current
              : settings.whiteNoisePreset
          }
          valueLabel={whiteNoiseLabel}
        />

        <SelectableFocusToolCard
          enabled={settings.soundEnabled}
          icon={Bell}
          iconClassName="bg-[color-mix(in_srgb,var(--color-warning)_18%,white)] text-[var(--color-warning)]"
          onSelect={handleReminderPresetChange}
          onToggle={handleReminderToggle}
          options={reminderOptions}
          title="提醒音"
          triggerLabel="选择提醒音"
          value={settings.reminderTonePreset}
          valueLabel={reminderLabel}
        />

        <ToggleFocusToolCard
          description="休息结束自动开始"
          enabled={settings.autoStartNextRound}
          icon={RefreshCcw}
          iconClassName="bg-[color-mix(in_srgb,var(--color-success)_16%,white)] text-[var(--color-success)]"
          onToggle={() =>
            settings.updateSettings({ autoStartNextRound: !settings.autoStartNextRound })
          }
          title="自动开始下一轮"
          toggleLabel="切换自动开始下一轮"
        />

        <ToggleFocusToolCard
          description="保持在最前"
          enabled={settings.alwaysOnTop}
          icon={Maximize2}
          iconClassName="bg-[color-mix(in_srgb,var(--color-foreground)_7%,white)] text-muted-foreground"
          onToggle={() => settings.updateSettings({ alwaysOnTop: !settings.alwaysOnTop })}
          title="窗口置顶"
          toggleLabel="切换窗口置顶"
        />
      </div>
    </AppCard>
  );
}

type SelectableFocusToolCardProps<TValue extends string> = {
  enabled: boolean;
  icon: typeof Bell;
  iconClassName: string;
  onSelect: (value: TValue) => void | Promise<void>;
  onToggle: () => void | Promise<void>;
  options: Array<{ label: string; value: TValue }>;
  title: string;
  triggerLabel: string;
  value: TValue;
  valueLabel: string;
};

function SelectableFocusToolCard<TValue extends string>({
  enabled,
  icon,
  iconClassName,
  onSelect,
  onToggle,
  options,
  title,
  triggerLabel,
  value,
  valueLabel,
}: SelectableFocusToolCardProps<TValue>) {
  return (
    <div className="grid min-h-[88px] grid-cols-[44px_minmax(0,1fr)_auto] items-center gap-3 rounded-[22px] border border-border bg-background px-4 py-4 shadow-[0_6px_18px_rgba(255,107,107,0.04)]">
      <ToolIcon className={iconClassName} icon={icon} />

      <div className="min-w-0">
        <div className="text-sm font-black leading-6 text-foreground">{title}</div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              aria-label={triggerLabel}
              className="mt-1 inline-flex items-center gap-1 text-left text-sm font-medium text-muted-foreground transition hover:text-primary"
              type="button"
            >
              <span className="truncate text-sm">{valueLabel}</span>
              <ChevronDown aria-hidden="true" className="size-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className="rounded-[16px] border border-border bg-background/95 p-1 shadow-[0_16px_40px_rgba(58,46,42,0.12)] backdrop-blur-md"
          >
            <DropdownMenuRadioGroup
              onValueChange={(nextValue) => void onSelect(nextValue as TValue)}
              value={value}
            >
              {options.map((option) => (
                <DropdownMenuRadioItem
                  className="rounded-[12px] px-3 py-2 text-sm font-medium"
                  key={option.value}
                  value={option.value}
                >
                  {option.label}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <ToolToggleButton ariaLabel={`切换${title}`} enabled={enabled} onClick={onToggle} />
    </div>
  );
}

type ToggleFocusToolCardProps = {
  description: string;
  enabled: boolean;
  icon: typeof Bell;
  iconClassName: string;
  onToggle: () => void;
  title: string;
  toggleLabel: string;
};

function ToggleFocusToolCard({
  description,
  enabled,
  icon,
  iconClassName,
  onToggle,
  title,
  toggleLabel,
}: ToggleFocusToolCardProps) {
  return (
    <button
      className="grid min-h-[88px] grid-cols-[44px_minmax(0,1fr)_auto] items-center gap-3 rounded-[22px] border border-border bg-background px-4 py-4 text-left shadow-[0_6px_18px_rgba(255,107,107,0.04)] transition hover:border-primary/35"
      onClick={onToggle}
      type="button"
    >
      <ToolIcon className={iconClassName} icon={icon} />
      <div className="min-w-0">
        <div className="text-sm font-black leading-6 text-foreground">{title}</div>
        <div className="mt-1 truncate text-sm font-medium text-muted-foreground">{description}</div>
      </div>
      <ToolToggleVisual enabled={enabled} />
      <span className="sr-only">{toggleLabel}</span>
    </button>
  );
}

function ToolIcon({ className, icon: Icon }: { className: string; icon: typeof Bell }) {
  return (
    <span className={cn("grid size-11 place-items-center rounded-full", className)}>
      <Icon aria-hidden="true" className="size-5" />
    </span>
  );
}

function ToolToggleButton({
  ariaLabel,
  enabled,
  onClick,
}: {
  ariaLabel: string;
  enabled: boolean;
  onClick: () => void | Promise<void>;
}) {
  return (
    <button
      aria-label={ariaLabel}
      className="rounded-full"
      onClick={(event) => {
        event.stopPropagation();
        void onClick();
      }}
      type="button"
    >
      <ToolToggleVisual enabled={enabled} />
    </button>
  );
}

function ToolToggleVisual({ enabled }: { enabled: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "block h-7 w-12 rounded-full p-1 transition",
        enabled ? "bg-primary" : "bg-muted",
      )}
    >
      <span
        className={cn(
          "block size-5 rounded-full bg-white shadow-sm transition",
          enabled ? "translate-x-5" : "",
        )}
      />
    </span>
  );
}
