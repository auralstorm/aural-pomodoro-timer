import { Clock3, RefreshCcw } from "lucide-react";

import breakArt from "@/assets/modal/break.png";
import { AppDialog } from "@/components/common/AppDialog";

import { ModalActionRow } from "../ModalActionRow";
import { ModalInfoList } from "../ModalInfoList";
import { formatMinutesLabel } from "../modalFormatters";

type BreakCompleteModalProps = {
  open: boolean;
  breakMode: "shortBreak" | "longBreak";
  restMinutes: number;
  nextFocusMinutes: number;
  onStartFocus: () => void;
  onLater: () => void;
  onOpenChange: (open: boolean) => void;
};

export function BreakCompleteModal({
  open,
  breakMode,
  restMinutes,
  nextFocusMinutes,
  onStartFocus,
  onLater,
  onOpenChange,
}: BreakCompleteModalProps) {
  const isLongBreak = breakMode === "longBreak";

  return (
    <AppDialog
      description={
        isLongBreak
          ? "这一轮恢复已经完成，回到下一轮专注节奏。"
          : "状态已经恢复，现在开始下一轮专注。"
      }
      onOpenChange={onOpenChange}
      open={open}
      size="md"
      title={isLongBreak ? "长休息结束，回到专注吧" : "短休息结束，继续专注吧"}
    >
      <div className="grid items-center gap-5 sm:grid-cols-[minmax(0,1fr)_190px]">
        <ModalInfoList
          items={[
            {
              icon: <Clock3 className="size-4" />,
              label: "已休息",
              value: formatMinutesLabel(restMinutes),
              accentClassName: "text-lg font-black text-[var(--color-success)] whitespace-nowrap",
            },
            {
              icon: <RefreshCcw className="size-4" />,
              label: "下一轮",
              value: `专注 ${formatMinutesLabel(nextFocusMinutes)}`,
              accentClassName: "text-lg font-black text-primary whitespace-nowrap",
            },
          ]}
        />
        <img
          alt=""
          className="mx-auto h-[190px] w-full max-w-[190px] object-contain"
          src={breakArt}
        />
      </div>
      <ModalActionRow
        primary={{
          label: "开始专注",
          onClick: onStartFocus,
          variant: "success",
        }}
        secondary={{ label: "稍后开始", onClick: onLater }}
      />
    </AppDialog>
  );
}
