import { CheckCheck, Clock3, Sprout } from "lucide-react";

import successArt from "@/assets/modal/completed.png";
import { AppDialog } from "@/components/common/AppDialog";
import { useStatsStore } from "@/stores/statsStore";
import { calculateTodayStats } from "@/utils/stats";

import { ModalActionRow } from "../ModalActionRow";
import { ModalInfoList } from "../ModalInfoList";
import { formatFocusHours } from "../modalFormatters";

type TaskCompleteModalProps = {
  open: boolean;
  taskTitle?: string;
  onViewTasks: () => void;
  onContinueFocus: () => void;
  onOpenChange: (open: boolean) => void;
};

export function TaskCompleteModal({
  open,
  taskTitle,
  onViewTasks,
  onContinueFocus,
  onOpenChange,
}: TaskCompleteModalProps) {
  const sessions = useStatsStore((state) => state.sessions);
  const today = calculateTodayStats(sessions);

  return (
    <AppDialog
      description={
        taskTitle ? `“${taskTitle}” 已经达成目标，继续保持这份节奏。` : "今天的小目标又完成了一个。"
      }
      onOpenChange={onOpenChange}
      open={open}
      size="md"
      title="任务完成！"
    >
      <div className="grid items-center gap-5 sm:grid-cols-[minmax(0,1fr)_190px]">
        <ModalInfoList
          items={[
            {
              icon: <CheckCheck className="size-4" />,
              label: "完成任务",
              value: taskTitle ?? "当前任务",
            },
            {
              icon: <Sprout className="size-4" />,
              label: "今日完成",
              value: `${today.completedPomodoros} 个番茄`,
              accentClassName: "text-lg font-black text-primary whitespace-nowrap",
            },
            {
              icon: <Clock3 className="size-4" />,
              label: "今日累计",
              value: formatFocusHours(today.focusMinutes),
              accentClassName: "text-lg font-black text-[var(--color-success)] whitespace-nowrap",
            },
          ]}
        />
        <img
          alt=""
          className="mx-auto h-[190px] w-full max-w-[190px] object-contain"
          src={successArt}
        />
      </div>
      <ModalActionRow
        primary={{ label: "查看任务", onClick: onViewTasks }}
        secondary={{ label: "继续专注", onClick: onContinueFocus }}
      />
    </AppDialog>
  );
}
