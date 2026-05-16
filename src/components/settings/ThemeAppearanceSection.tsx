import type { AppTheme } from "@/types/settings";
import { SelectableSettingCard } from "./SelectableSettingCard";
import { SettingsSectionCard } from "./SettingsSectionCard";
import { settingsIcons } from "./settingsAssets";

const themeOptions: Array<{
  value: AppTheme;
  label: string;
  icon: string;
}> = [
  { icon: settingsIcons.themeCream, label: "奶油白主题", value: "cream" },
  { icon: settingsIcons.themeTomato, label: "番茄红主题", value: "tomato" },
  { icon: settingsIcons.themeMint, label: "薄荷绿主题", value: "mint" },
  { icon: settingsIcons.themeNight, label: "夜间专注主题", value: "darkFocus" },
];

type ThemeAppearanceSectionProps = {
  theme: AppTheme;
  onThemeChange: (theme: AppTheme) => void;
};

export function ThemeAppearanceSection({
  theme,
  onThemeChange,
}: ThemeAppearanceSectionProps) {
  return (
    <SettingsSectionCard icon={settingsIcons.sectionTheme} title="主题外观">
      <div className="grid grid-cols-4 gap-4 max-lg:grid-cols-2">
        {themeOptions.map((option) => (
          <SelectableSettingCard
            className="min-h-24"
            icon={option.icon}
            iconClassName="size-16"
            key={option.value}
            onClick={() => onThemeChange(option.value)}
            selected={theme === option.value}
            title={option.label}
          />
        ))}
      </div>
    </SettingsSectionCard>
  );
}
