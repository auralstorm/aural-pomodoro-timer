import { FocusTools } from "@/components/timer/FocusTools";
import { FocusTaskCard } from "@/components/timer/FocusTaskCard";
import { TimerPanel } from "@/components/timer/TimerPanel";
import { startFocusTask } from "@/features/focus/currentTaskSelection";
import { PageLayout } from "@/components/layout/PageLayout";
import { usePomodoroTimer } from "@/hooks/usePomodoroTimer";

export function FocusWorkspace() {
  const timer = usePomodoroTimer();

  function startTask(taskId: string) {
    startFocusTask(taskId);
  }

  return (
    <PageLayout>
      <div className="grid grid-cols-[minmax(0,1fr)_620px] gap-6 max-xl:grid-cols-1">
        <TimerPanel
          currentTaskTitle={timer.currentTask?.title}
          mode={timer.mode}
          onModeChange={timer.switchMode}
          onPause={timer.pause}
          onReset={timer.reset}
          onSkip={timer.skip}
          onStart={timer.start}
          remainingSeconds={timer.remainingSeconds}
          status={timer.status}
          totalSeconds={timer.totalSeconds}
        />
        <aside className="flex flex-col gap-6">
          <FocusTaskCard onStartTask={startTask} />
          <FocusTools />
        </aside>
      </div>
      {/* <TipBar>专注 25 分钟，休息 5 分钟，让番茄钟帮你保持高效。</TipBar> */}
    </PageLayout>
  );
}
