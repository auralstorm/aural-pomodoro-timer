import { SettingSwitchRow } from "./SettingSwitchRow";
import { SettingsSectionCard } from "./SettingsSectionCard";
import { settingsIcons } from "./settingsAssets";

type AutomationSettingsSectionProps = {
  autoStartNextRound: boolean;
  autoStartBreak: boolean;
  alwaysOnTop: boolean;
  assistantEnabled: boolean;
  minimizeToTray: boolean;
  onChange: (
    key: "autoStartNextRound" | "autoStartBreak" | "alwaysOnTop" | "assistantEnabled" | "minimizeToTray",
    checked: boolean,
  ) => void;
};

export function AutomationSettingsSection({
  autoStartNextRound,
  autoStartBreak,
  alwaysOnTop,
  assistantEnabled,
  minimizeToTray,
  onChange,
}: AutomationSettingsSectionProps) {
  return (
    <SettingsSectionCard icon={settingsIcons.sectionAutomation} title="自动化">
      <SettingSwitchRow
        checked={autoStartNextRound}
        description="休息结束后自动开始下一轮专注"
        label="自动开始下一轮专注"
        onCheckedChange={(checked) => onChange("autoStartNextRound", checked)}
      />
      <SettingSwitchRow
        checked={autoStartBreak}
        description="专注结束后自动进入休息"
        label="自动开始休息"
        onCheckedChange={(checked) => onChange("autoStartBreak", checked)}
      />
      <SettingSwitchRow
        checked={alwaysOnTop}
        description="保持番茄钟窗口在最前"
        label="窗口置顶"
        onCheckedChange={(checked) => onChange("alwaysOnTop", checked)}
      />
      <SettingSwitchRow
        checked={assistantEnabled}
        description="开启后显示桌面番茄助手窗口"
        label="桌面助手"
        onCheckedChange={(checked) => onChange("assistantEnabled", checked)}
      />
      <SettingSwitchRow
        checked={minimizeToTray}
        description="点击关闭按钮时隐藏到系统托盘"
        label="最小化到托盘"
        onCheckedChange={(checked) => onChange("minimizeToTray", checked)}
      />
      <div className="mt-2 rounded-[var(--radius-lg)] border border-border bg-background px-4 py-2 text-xs text-muted-foreground">
        开启自动化后，番茄钟会帮你保持节奏。
      </div>
    </SettingsSectionCard>
  );
}
