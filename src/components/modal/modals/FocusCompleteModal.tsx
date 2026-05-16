import { Clock3, CupSoda, ListTodo } from "lucide-react";

import focusArt from "@/assets/modal/focus.png";
import { AppDialog } from "@/components/common/AppDialog";
import { useStatsStore } from "@/stores/statsStore";
import { calculateTodayStats } from "@/utils/stats";

import { ModalActionRow } from "../ModalActionRow";
import { ModalInfoList } from "../ModalInfoList";
import { formatMinutesLabel } from "../modalFormatters";

type FocusCompleteModalProps = {
  open: boolean;
  taskTitle?: string;
  minutes: number;
  onStartBreak: () => void;
  onContinueFocus: () => void;
  onOpenChange: (open: boolean) => void;
};

export function FocusCompleteModal({
  open,
  taskTitle,
  minutes,
  onStartBreak,
  onContinueFocus,
  onOpenChange,
}: FocusCompleteModalProps) {
  const sessions = useStatsStore((state) => state.sessions);
  const today = calculateTodayStats(sessions);

  return (
    <AppDialog
      description="太棒啦，这又是一颗稳定完成的番茄，正在一步步接近目标。"
      onOpenChange={onOpenChange}
      open={open}
      size="md"
      title="专注完成啦！"
    >
      <div className="grid items-center gap-5 sm:grid-cols-[minmax(0,1fr)_190px]">
        <ModalInfoList
          items={[
            {
              icon: <Clock3 className="size-4" />,
              label: "本轮专注",
              value: formatMinutesLabel(minutes),
              accentClassName: "text-lg font-black text-primary whitespace-nowrap",
            },
            {
              icon: <ListTodo className="size-4" />,
              label: "当前任务",
              value: taskTitle ?? "这一轮专注",
            },
            {
              icon: <CupSoda className="size-4" />,
              label: "今日完成",
              value: `${today.completedPomodoros} 个番茄`,
              accentClassName: "text-lg font-black text-[var(--color-success)] whitespace-nowrap",
            },
          ]}
        />
        <img
          alt=""
          className="mx-auto h-[190px] w-full max-w-[190px] object-contain"
          src={focusArt}
        />
      </div>
      <ModalActionRow
        primary={{ label: "开始休息", onClick: onStartBreak }}
        secondary={{ label: "继续专注", onClick: onContinueFocus }}
      />
    </AppDialog>
  );
}
