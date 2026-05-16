import { Trash2 } from "lucide-react";

import { AppButton } from "@/components/common/AppButton";
import { SettingsSectionCard } from "./SettingsSectionCard";
import { settingsIcons } from "./settingsAssets";

type LocalDataSectionProps = {
  onClearData: () => void;
};

export function LocalDataSection({ onClearData }: LocalDataSectionProps) {
  return (
    <SettingsSectionCard icon={settingsIcons.sectionLocalData} title="本地数据">
      <div className="text-muted-foreground text-xs mb-9">专注记录，任务和设置会保存在当前设备中</div>
      <div className="rounded-[var(--radius-lg)] border border-[var(--color-tomato-light)] bg-[var(--color-tomato-soft)] p-4">
        <div className="grid grid-cols-[1fr_auto] items-center gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <img alt="" className="size-8 object-contain" draggable={false} src={settingsIcons.localClear} />
            <div className="min-w-0">
              <h3 className="text-sm font-black text-destructive">清除本地数据</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                删除本机保存的任务、专注记录和设置。
              </p>
            </div>
          </div>
          <AppButton
            className="h-9 px-4"
            icon={<Trash2 className="size-4" />}
            onClick={onClearData}
            size="sm"
            variant="danger"
          >
            清除数据
          </AppButton>
        </div>
      </div>
    </SettingsSectionCard>
  );
}
