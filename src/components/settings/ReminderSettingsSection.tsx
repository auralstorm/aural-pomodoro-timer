import { SettingSwitchRow } from "./SettingSwitchRow";
import { SettingsSectionCard } from "./SettingsSectionCard";
import { settingsIcons } from "./settingsAssets";

type ReminderSettingsSectionProps = {
  focusCompleteReminderEnabled: boolean;
  breakCompleteReminderEnabled: boolean;
  desktopNotificationEnabled: boolean;
  soundEnabled: boolean;
  assistantEnabled: boolean;
  onFocusCompleteReminderChange: (checked: boolean) => void;
  onBreakCompleteReminderChange: (checked: boolean) => void;
  onDesktopNotificationChange: (checked: boolean) => void;
  onSoundChange: (checked: boolean) => void;
  onAssistantChange: (checked: boolean) => void;
};

export function ReminderSettingsSection({
  focusCompleteReminderEnabled,
  breakCompleteReminderEnabled,
  desktopNotificationEnabled,
  soundEnabled,
  assistantEnabled,
  onFocusCompleteReminderChange,
  onBreakCompleteReminderChange,
  onDesktopNotificationChange,
  onSoundChange,
  onAssistantChange,
}: ReminderSettingsSectionProps) {
  return (
    <SettingsSectionCard icon={settingsIcons.sectionNotification} title="提醒设置">
      <SettingSwitchRow
        checked={focusCompleteReminderEnabled}
        description="专注结束时弹出提醒"
        label="专注结束提醒"
        onCheckedChange={onFocusCompleteReminderChange}
      />
      <SettingSwitchRow
        checked={breakCompleteReminderEnabled}
        description="休息结束时弹出提醒"
        label="休息结束提醒"
        onCheckedChange={onBreakCompleteReminderChange}
      />
      <SettingSwitchRow
        checked={desktopNotificationEnabled}
        description="通过桌面通知显示提醒"
        label="桌面通知"
        onCheckedChange={onDesktopNotificationChange}
      />
      <SettingSwitchRow
        checked={soundEnabled}
        description="使用应用内声音播放提醒"
        label="应用内声音提醒"
        onCheckedChange={onSoundChange}
      />
      <SettingSwitchRow
        checked={assistantEnabled}
        description="开启后显示桌面番茄助手窗口"
        label="桌面助手"
        onCheckedChange={onAssistantChange}
      />
    </SettingsSectionCard>
  );
}
