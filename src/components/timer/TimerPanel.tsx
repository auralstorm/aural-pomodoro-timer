import { Pause, Play, RotateCcw, SkipForward } from "lucide-react";
import focusModeIcon from "@/assets/logo/logo-symbol-tomato.png";
import longBreakModeIcon from "@/assets/icons/settings/item-long-break.svg";
import shortBreakModeIcon from "@/assets/icons/settings/item-short-break.svg";
import { AppButton } from "@/components/common/AppButton";
import { AppCard } from "@/components/common/AppCard";
import { AnimatedTimeDisplay } from "@/components/timer/AnimatedTimeDisplay";
import { ProgressRing } from "@/components/common/ProgressRing";
import { SegmentedTabs } from "@/components/common/SegmentedTabs";
import { Tag } from "@/components/common/Tag";
import { TimerPanelDecorLayer } from "@/components/timer/TimerPanelDecorLayer";
import type { TimerMode, TimerStatus } from "@/types/timer";
import { getModeLabel } from "@/utils/time";

type TimerPanelProps = {
  mode: TimerMode;
  status: TimerStatus;
  remainingSeconds: number;
  totalSeconds: number;
  currentTaskTitle?: string;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onSkip: () => void;
  onModeChange: (mode: TimerMode) => void;
};

const modeOptions = [
  {
    value: "focus" as const,
    label: "专注",
    helper: "25min",
    icon: <img alt="" className="size-6 object-contain" src={focusModeIcon} />,
  },
  {
    value: "shortBreak" as const,
    label: "短休息",
    helper: "5min",
    icon: <img alt="" className="size-8 object-contain" src={shortBreakModeIcon} />,
  },
  {
    value: "longBreak" as const,
    label: "长休息",
    helper: "15min",
    icon: <img alt="" className="size-8 object-contain" src={longBreakModeIcon} />,
  },
];

export function TimerPanel({
  mode,
  status,
  remainingSeconds,
  totalSeconds,
  currentTaskTitle,
  onStart,
  onPause,
  onReset,
  onSkip,
  onModeChange,
}: TimerPanelProps) {
  const progress = totalSeconds > 0 ? ((totalSeconds - remainingSeconds) / totalSeconds) * 100 : 0;
  const isRunning = status === "running";
  const hasSkippableSession = status === "running" || status === "paused";
  const skipLabel = mode === "focus" ? "提前结束" : "跳过休息";
  const displayTitle =
    currentTaskTitle ??
    (mode === "focus" && (status === "running" || status === "paused") ? "自由专注" : "准备开始");

  return (
    <AppCard className="relative overflow-hidden p-10" tone="hero">
      <TimerPanelDecorLayer />

      <div className="relative z-10 flex flex-col items-center gap-8 pr-0">
        <div className="flex w-full max-w-[560px] flex-col items-center gap-3 text-center">
          <div className="w-full">
            <h2
              className="mx-auto max-w-full truncate text-3xl font-black text-foreground text-center"
              title={displayTitle}
            >
              {displayTitle}
            </h2>
          </div>
        </div>

        <ProgressRing value={progress}>
          <div className="flex flex-col items-center gap-3">
            <Tag
              className="inline-flex border border-border px-4 py-1.5"
              tone={mode === "focus" ? "focus" : "rest"}
            >
              {getModeLabel(mode)}中
            </Tag>
            <AnimatedTimeDisplay
              className="text-7xl font-black text-primary"
              seconds={remainingSeconds}
            />
            <Tag tone="focus">番茄时间更有价值</Tag>
          </div>
        </ProgressRing>

        <SegmentedTabs
          value={mode}
          options={modeOptions}
          onChange={onModeChange}
          className="mt-10"
        />

        <div className="flex flex-wrap items-center justify-center gap-4">
          <AppButton
            className="rounded-[30px] w-[180px]"
            icon={
              isRunning ? (
                <Pause aria-hidden="true" className="size-5" />
              ) : (
                <Play aria-hidden="true" className="size-5" />
              )
            }
            onClick={isRunning ? onPause : onStart}
            size="lg"
          >
            {isRunning ? "暂停" : "开始专注"}
          </AppButton>
          <AppButton
            className="rounded-[30px]"
            icon={<RotateCcw aria-hidden="true" className="size-5" />}
            onClick={onReset}
            size="lg"
            variant="ghost"
          >
            重置
          </AppButton>
          {hasSkippableSession ? (
            <AppButton
              className="rounded-[30px]"
              icon={<SkipForward aria-hidden="true" className="size-5" />}
              onClick={onSkip}
              size="lg"
              variant="ghost"
            >
              {skipLabel}
            </AppButton>
          ) : null}
        </div>
      </div>
    </AppCard>
  );
}
