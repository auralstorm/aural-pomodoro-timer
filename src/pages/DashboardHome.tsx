import { Link } from "react-router-dom";
import {
  BarChart3,
  CalendarCheck,
  Clock,
  Pause,
  Play,
  Plus,
} from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { AppButton } from "@/components/common/AppButton";
import { AppCard } from "@/components/common/AppCard";
import { EmptyState } from "@/components/common/EmptyState";
import { ProgressRing } from "@/components/common/ProgressRing";
import { Tag } from "@/components/common/Tag";
import { PageLayout } from "@/components/layout/PageLayout";
import { StatCard } from "@/components/stats/StatCard";
import { TaskCard } from "@/components/task/TaskCard";
import emptyStats from "@/assets/empty/illus-empty-stats.png";
import logoSymbol from "@/assets/logo/logo-symbol-tomato.png";
import { selectCurrentTask } from "@/features/focus/currentTaskSelection";
import { usePomodoroTimer } from "@/hooks/usePomodoroTimer";
import { useStatsStore } from "@/stores/statsStore";
import { useTaskStore } from "@/stores/taskStore";
import {
  calculateTodayStats,
  calculateWeeklyTrend,
  getCurrentStreakDays,
} from "@/utils/stats";
import { formatSeconds, getModeLabel } from "@/utils/time";

export function DashboardHome() {
  const sessions = useStatsStore((state) => state.sessions);
  const { tasks, currentTaskId } = useTaskStore();
  const today = calculateTodayStats(sessions);
  const trend = calculateWeeklyTrend(sessions);
  const currentStreak = getCurrentStreakDays(sessions);
  const pendingTasks = tasks.filter((task) => task.status !== "completed").slice(0, 3);

  function startTask(taskId: string) {
    selectCurrentTask(taskId);
  }

  return (
    <PageLayout>
      <AppCard className="grid min-h-[300px] grid-cols-[1fr_520px] items-center gap-8 overflow-hidden p-10 max-xl:grid-cols-1" tone="hero" style={{background: "url(/assets/hero.png) no-repeat"}}>
        <div className="flex flex-col items-start gap-6">
          <div>
            <h1 className="text-5xl font-black leading-tight text-foreground">
              今天也来专注一会儿吧
            </h1>
            <p className="mt-4 max-w-xl text-lg leading-8 text-muted-foreground">
              每一个专注的番茄，都是成长的积累。保持节奏，让每一天都有清晰进展。
            </p>
          </div>
          <div className="flex gap-3">
            <AppButton asChild>
              <Link to="/focus">
                <Play aria-hidden="true" className="size-5" />
                开始专注
              </Link>
            </AppButton>
            <AppButton asChild variant="ghost">
              <Link to="/tasks">查看任务</Link>
            </AppButton>
          </div>
        </div>
        {/* <img alt="" className="h-80 w-full object-contain" src={heroHome} /> */}
      </AppCard>

      <div className="grid grid-cols-4 gap-5 max-xl:grid-cols-2">
        <StatCard icon={<Clock className="size-7" />} label="今日专注时长" value={`${(today.focusMinutes / 60).toFixed(1)}h`} />
        <StatCard icon={<img alt="" className="size-10 object-contain" src={logoSymbol} />} label="今日完成番茄数" value={`${today.completedPomodoros}`} />
        <StatCard icon={<CalendarCheck className="size-7" />} label="连续打卡天数" value={`${currentStreak} 天`} />
        <StatCard icon={<BarChart3 className="size-7" />} label="任务完成率" value={`${getTaskCompletionRate(tasks)}%`} />
      </div>

      <div className="grid grid-cols-[360px_minmax(0,1fr)_420px] gap-6 max-2xl:grid-cols-[340px_minmax(0,1fr)_380px] max-xl:grid-cols-1">
        <DashboardTimerCard />

        <AppCard className="flex min-h-80 flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">今日任务</h2>
            <Link className="inline-flex items-center gap-1 text-sm font-semibold text-primary" to="/tasks">
              <Plus aria-hidden="true" className="size-4" />
              添加任务
            </Link>
          </div>
          {pendingTasks.length === 0 ? (
            <EmptyState
              description="先安排一个小目标，让专注有明确方向。"
              title="暂无进行中的任务"
            />
          ) : (
            <div className="flex flex-col gap-3">
              {pendingTasks.map((task) => (
                <TaskCard
                  compact
                  isCurrent={task.id === currentTaskId}
                  key={task.id}
                  onStart={startTask}
                  task={task}
                />
              ))}
            </div>
          )}
          <Link className="mt-auto self-center text-sm font-bold text-primary" to="/tasks">
            查看全部任务
          </Link>
        </AppCard>

        <AppCard className="flex min-h-80 flex-col gap-5">
          <h2 className="text-xl font-bold">本周专注趋势</h2>
          {sessions.length === 0 ? (
            <EmptyState
              description="开始专注后，趋势会在这里展示。"
              image={emptyStats}
              title="暂无统计数据"
            />
          ) : (
            <ResponsiveContainer height={230} width="100%">
              <LineChart data={trend} margin={{ bottom: 0, left: -12, right: 10, top: 14 }}>
                <CartesianGrid stroke="var(--color-divider)" strokeDasharray="4 8" />
                <XAxis dataKey="label" tickLine={false} />
                <YAxis tickLine={false} />
                <Tooltip />
                <Line
                  dataKey="minutes"
                  dot={{ r: 5 }}
                  stroke="var(--color-tomato-red)"
                  strokeWidth={3}
                  type="monotone"
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </AppCard>
      </div>
      {/* <TipBar>每一颗番茄，都是成长的记录。</TipBar> */}
    </PageLayout>
  );
}

function DashboardTimerCard() {
  const timer = usePomodoroTimer();
  const progress = timer.totalSeconds > 0
    ? ((timer.totalSeconds - timer.remainingSeconds) / timer.totalSeconds) * 100
    : 0;
  const isRunning = timer.status === "running";

  return (
    <AppCard className="flex min-h-80 flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="inline-flex items-center gap-2 text-xl font-bold">
          <img alt="" className="size-7 object-contain" src={logoSymbol} />
          当前番茄钟
        </h2>
        <Tag tone={timer.mode === "focus" ? "focus" : "rest"}>{getModeLabel(timer.mode)}</Tag>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
        <ProgressRing className="" size={178} strokeWidth={12} value={progress}>
          <div>
            <strong className="block text-4xl font-black leading-none text-primary">
              {formatSeconds(timer.remainingSeconds)}
            </strong>
            <span className="mt-2 block text-xs font-semibold text-muted-foreground">
              {timer.currentTask?.title ?? "准备开始"}
            </span>
          </div>
        </ProgressRing>

        <AppButton
          asChild={!isRunning}
          className="min-w-40"
          icon={isRunning ? <Pause aria-hidden="true" className="size-5" /> : undefined}
          onClick={isRunning ? timer.pause : undefined}
        >
          {isRunning ? (
            "暂停专注"
          ) : (
            <Link onClick={timer.start} to="/focus">
              <Play aria-hidden="true" className="size-5" />
              开始专注
            </Link>
          )}
        </AppButton>
      </div>
    </AppCard>
  );
}

function getTaskCompletionRate(tasks: { status: string }[]) {
  if (tasks.length === 0) return 0;
  const completed = tasks.filter((task) => task.status === "completed").length;
  return Math.round((completed / tasks.length) * 100);
}
