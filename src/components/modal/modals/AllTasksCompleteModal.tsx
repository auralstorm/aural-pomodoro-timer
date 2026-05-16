import { ChartColumn, Clock3, ListChecks, Sprout } from "lucide-react";

import successArt from "@/assets/modal/completed.png";
import { AppDialog } from "@/components/common/AppDialog";
import { useStatsStore } from "@/stores/statsStore";
import { useTaskStore } from "@/stores/taskStore";
import { calculateTodayStats } from "@/utils/stats";

import { ModalActionRow } from "../ModalActionRow";
import { ModalInfoList } from "../ModalInfoList";
import { formatFocusHours } from "../modalFormatters";

type AllTasksCompleteModalProps = {
  open: boolean;
  onViewStatistics: () => void;
  onBackHome: () => void;
  onOpenChange: (open: boolean) => void;
};

export function AllTasksCompleteModal({
  open,
  onViewStatistics,
  onBackHome,
  onOpenChange,
}: AllTasksCompleteModalProps) {
  const sessions = useStatsStore((state) => state.sessions);
  const tasks = useTaskStore((state) => state.tasks);
  const today = calculateTodayStats(sessions);
  const completedTasks = tasks.filter((task) => task.status === "completed").length;

  return (
    <AppDialog
      description="所有小目标都已达成，继续保持，把成果沉淀成稳定节奏。"
      onOpenChange={onOpenChange}
      open={open}
      size="md"
      title="今日任务全部完成！"
    >
      <div className="grid items-center gap-6 sm:grid-cols-[1fr_220px]">
        <ModalInfoList
          items={[
            {
              icon: <ListChecks className="size-4" />,
              label: "完成任务",
              value: `${completedTasks} 个`,
              accentClassName: "text-lg font-black text-[var(--color-warning)]",
            },
            {
              icon: <Sprout className="size-4" />,
              label: "完成番茄",
              value: `${today.completedPomodoros} 个`,
              accentClassName: "text-lg font-black text-primary",
            },
            {
              icon: <Clock3 className="size-4" />,
              label: "专注时长",
              value: formatFocusHours(today.focusMinutes),
              accentClassName: "text-lg font-black text-primary",
            },
          ]}
        />
        <img
          alt=""
          className="mx-auto h-[220px] w-full max-w-[220px] object-contain"
          src={successArt}
        />
      </div>
      <ModalActionRow
        primary={{
          label: "查看统计",
          onClick: onViewStatistics,
          icon: <ChartColumn className="size-4" />,
        }}
        secondary={{ label: "返回首页", onClick: onBackHome }}
      />
    </AppDialog>
  );
}
