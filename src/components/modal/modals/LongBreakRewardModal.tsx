import { Clock3, CupSoda, Trophy } from "lucide-react";

import longBreakArt from "@/assets/modal/long-break.png";
import { AppDialog } from "@/components/common/AppDialog";
import { useSettingsStore } from "@/stores/settingsStore";
import { useStatsStore } from "@/stores/statsStore";
import { calculateTodayStats } from "@/utils/stats";

import { ModalActionRow } from "../ModalActionRow";
import { ModalInfoList } from "../ModalInfoList";
import { formatFocusHours, formatMinutesLabel } from "../modalFormatters";

type LongBreakRewardModalProps = {
  open: boolean;
  pomodoros: number;
  onStartBreak: () => void;
  onLater: () => void;
  onOpenChange: (open: boolean) => void;
};

export function LongBreakRewardModal({
  open,
  pomodoros,
  onStartBreak,
  onLater,
  onOpenChange,
}: LongBreakRewardModalProps) {
  const longBreakMinutes = useSettingsStore((state) => state.longBreakMinutes);
  const sessions = useStatsStore((state) => state.sessions);
  const today = calculateTodayStats(sessions);

  return (
    <AppDialog
      description={`你已经完成 ${pomodoros} 个番茄，是时候好好放松一下了。`}
      onOpenChange={onOpenChange}
      open={open}
      size="md"
      title="进入长休息啦"
    >
      <div className="grid items-center gap-5 sm:grid-cols-[minmax(0,1fr)_190px]">
        <ModalInfoList
          items={[
            {
              icon: <Trophy className="size-4" />,
              label: "已完成番茄",
              value: `${pomodoros} / ${pomodoros}`,
              accentClassName: "text-lg font-black text-primary whitespace-nowrap",
            },
            {
              icon: <Clock3 className="size-4" />,
              label: "长休息时间",
              value: formatMinutesLabel(longBreakMinutes),
              accentClassName: "text-lg font-black text-[var(--color-warning)] whitespace-nowrap",
            },
            {
              icon: <CupSoda className="size-4" />,
              label: "今日累计",
              value: formatFocusHours(today.focusMinutes),
              accentClassName: "text-lg font-black text-[var(--color-success)] whitespace-nowrap",
            },
          ]}
        />
        <img
          alt=""
          className="mx-auto h-[190px] w-full max-w-[190px] object-contain"
          src={longBreakArt}
        />
      </div>
      <ModalActionRow
        primary={{ label: "开始长休息", onClick: onStartBreak }}
        secondary={{ label: "稍后再说", onClick: onLater }}
      />
    </AppDialog>
  );
}
