import "@testing-library/jest-dom/vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";
import dayjs from "dayjs";
import { beforeEach, describe, expect, it } from "vitest";

import { useStatsStore } from "@/stores/statsStore";
import { useTaskStore } from "@/stores/taskStore";
import type { PomodoroSession } from "@/types/timer";
import {
  FOCUS_TREND_CHART_MARGIN,
  FOCUS_TREND_X_AXIS_HEIGHT,
  FOCUS_TREND_X_AXIS_TICK_MARGIN,
  EFFICIENT_TIME_ROW_CLASS,
  FOCUS_TREND_Y_TICKS,
  TOP_STATS_CARD_MIN_HEIGHT,
  TOP_STATS_CONTENT_HEIGHT,
  BOTTOM_STATS_CARD_MIN_HEIGHT,
  BOTTOM_STATS_CONTENT_HEIGHT,
  DURATION_DISTRIBUTION_CARD_CLASS,
  DURATION_DISTRIBUTION_CONTENT_CLASS,
  DONUT_CENTER_CLASS,
  DONUT_CENTER_LABEL_CLASS,
  DONUT_CENTER_VALUE_CLASS,
  EFFICIENT_TIME_CONTENT_CLASS,
  StatisticsDashboard,
} from "./index";

describe("StatisticsDashboard", () => {
  beforeEach(() => {
    localStorage.clear();
    useTaskStore.setState({ tasks: [], currentTaskId: undefined });
    useStatsStore.setState({ sessions: [] });
  });

  it("shows an empty state for task completion analysis when no tasks exist", () => {
    render(<StatisticsDashboard />);

    expect(screen.getByText("暂无任务完成数据")).toBeInTheDocument();
    expect(screen.queryByText("0%")).not.toBeInTheDocument();
  });

  it("uses neutral copy for top stats when both current and previous periods are empty", () => {
    render(<StatisticsDashboard />);

    const totalFocusCard = screen.getByText("总专注时长").closest("section");
    expect(totalFocusCard).not.toBeNull();
    const totalFocusTrend = within(totalFocusCard!).getByText("本周还没有专注记录");
    expect(totalFocusTrend).toHaveClass("text-muted-foreground");

    const pomodoroCard = screen.getByText("完成番茄数").closest("section");
    expect(pomodoroCard).not.toBeNull();
    expect(within(pomodoroCard!).getByText("本周还没有完成番茄")).toHaveClass(
      "text-muted-foreground",
    );

    const taskCard = screen.getByText("完成任务数").closest("section");
    expect(taskCard).not.toBeNull();
    expect(within(taskCard!).getByText("本周还没有完成任务")).toHaveClass("text-muted-foreground");

    const streakCard = screen.getByText("连续打卡天数").closest("section");
    expect(streakCard).not.toBeNull();
    expect(within(streakCard!).getByText("今天开始建立连续记录")).toHaveClass(
      "text-muted-foreground",
    );
  });

  it("uses the selected top-level period for page metrics", () => {
    useStatsStore.setState({
      sessions: [
        createFocusSession("today", dayjs().hour(10).minute(0), 50),
        createFocusSession("older-this-month", dayjs().subtract(10, "day"), 25),
      ],
    });

    render(<StatisticsDashboard />);

    const totalFocusCard = screen.getByText("总专注时长").closest("section");
    expect(totalFocusCard).not.toBeNull();
    expect(within(totalFocusCard!).getByText("0.8h")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "本月" }));

    expect(within(totalFocusCard!).getByText("1.3h")).toBeInTheDocument();
  });

  it("shows explicit copy for newly added trend changes", () => {
    useStatsStore.setState({
      sessions: [createFocusSession("today", dayjs().hour(10).minute(0), 25)],
    });

    render(<StatisticsDashboard />);

    const totalFocusCard = screen.getByText("总专注时长").closest("section");
    expect(totalFocusCard).not.toBeNull();
    expect(within(totalFocusCard!).getByText("较上周新增 25 分钟")).toHaveClass(
      "text-[var(--color-success)]",
    );

    const pomodoroCard = screen.getByText("完成番茄数").closest("section");
    expect(pomodoroCard).not.toBeNull();
    expect(within(pomodoroCard!).getByText("较上周新增 1 个")).toHaveClass(
      "text-[var(--color-success)]",
    );
  });

  it("uses neutral copy when the current period matches the previous one", () => {
    useStatsStore.setState({
      sessions: [
        createFocusSession("today", dayjs().hour(10).minute(0), 25),
        createFocusSession("last-week", dayjs().subtract(7, "day").hour(10).minute(0), 25),
      ],
    });

    render(<StatisticsDashboard />);

    const totalFocusCard = screen.getByText("总专注时长").closest("section");
    expect(totalFocusCard).not.toBeNull();
    expect(within(totalFocusCard!).getByText("与上周持平")).toHaveClass("text-muted-foreground");
  });

  it("keeps custom period visible but disabled until date range selection exists", () => {
    render(<StatisticsDashboard />);

    const customTab = screen.getByRole("button", { name: "自定义" });

    expect(customTab).toBeInTheDocument();
    expect(customTab).toBeDisabled();
  });

  it("does not render the focus efficiency change card", () => {
    render(<StatisticsDashboard />);

    expect(screen.queryByText("专注效率变化")).not.toBeInTheDocument();
  });

  it("uses 0h, 2h, 4h, and 6h y-axis ticks for the focus trend chart", () => {
    expect(FOCUS_TREND_Y_TICKS).toEqual([0, 120, 240, 360]);
  });

  it("adds extra bottom spacing to the focus trend x-axis", () => {
    expect(FOCUS_TREND_CHART_MARGIN.bottom).toBe(12);
    expect(FOCUS_TREND_X_AXIS_HEIGHT).toBe(34);
    expect(FOCUS_TREND_X_AXIS_TICK_MARGIN).toBe(12);
  });

  it("keeps efficient time labels on one line with a wider label column", () => {
    expect(EFFICIENT_TIME_ROW_CLASS).toContain("160px");
    expect(EFFICIENT_TIME_ROW_CLASS).toContain("36px");
  });

  it("keeps duration distribution as tall as the task completion analysis card", () => {
    expect(TOP_STATS_CARD_MIN_HEIGHT).toBe("min-h-[320px]");
    expect(TOP_STATS_CONTENT_HEIGHT).toBe("h-[230px]");
    expect(BOTTOM_STATS_CARD_MIN_HEIGHT).toBe("min-h-[300px]");
    expect(BOTTOM_STATS_CONTENT_HEIGHT).toBe("h-[220px]");
    expect(DURATION_DISTRIBUTION_CARD_CLASS).toBe(BOTTOM_STATS_CARD_MIN_HEIGHT);
  });

  it("centers lower-card content inside the taller card height", () => {
    expect(EFFICIENT_TIME_CONTENT_CLASS).toContain(BOTTOM_STATS_CONTENT_HEIGHT);
    expect(EFFICIENT_TIME_CONTENT_CLASS).toContain("justify-center");
    expect(DURATION_DISTRIBUTION_CONTENT_CLASS).toContain(BOTTOM_STATS_CONTENT_HEIGHT);
    expect(DURATION_DISTRIBUTION_CONTENT_CLASS).toContain("items-center");
  });

  it("shows an empty state in the efficient time panel when no focus sessions exist", () => {
    render(<StatisticsDashboard />);

    expect(screen.getByText("暂无高效时段数据")).toBeInTheDocument();
    expect(screen.queryByText("上午 09:00 - 11:00")).not.toBeInTheDocument();
  });

  it("uses compact centered labels inside donut charts", () => {
    expect(DONUT_CENTER_CLASS).toContain("justify-center");
    expect(DONUT_CENTER_CLASS).toContain("gap-0");
    expect(DONUT_CENTER_VALUE_CLASS).toContain("leading-none");
    expect(DONUT_CENTER_LABEL_CLASS).toContain("leading-none");
  });

  it("does not render the lower data guide after sessions exist", () => {
    useStatsStore.setState({
      sessions: [createFocusSession("today", dayjs().hour(10).minute(0), 50)],
    });

    render(<StatisticsDashboard />);

    expect(screen.queryByText("继续积累统计数据")).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "去专注" })).not.toBeInTheDocument();
  });

  it("opens the achievement drawer and filters achievement categories", () => {
    render(<StatisticsDashboard />);

    fireEvent.click(screen.getByRole("button", { name: "查看全部" }));

    expect(screen.getByRole("dialog", { name: "成就中心" })).toBeInTheDocument();
    expect(screen.getByText("已点亮成就")).toBeInTheDocument();
    expect(screen.getAllByTestId("achievement-card")).toHaveLength(24);

    fireEvent.click(screen.getByRole("button", { name: "任务" }));

    const taskCards = screen.getAllByTestId("achievement-card");
    expect(taskCards).toHaveLength(4);
    expect(screen.getByText("完成第 1 个任务")).toBeInTheDocument();
    expect(taskCards.map((card) => card.textContent).join(" ")).not.toContain("连续专注 3 天");
  });
});

function createFocusSession(
  id: string,
  endedAt: dayjs.Dayjs,
  durationMinutes: number,
): PomodoroSession {
  return {
    completed: true,
    durationMinutes,
    endedAt: endedAt.toISOString(),
    id,
    mode: "focus",
    startedAt: endedAt.subtract(durationMinutes, "minute").toISOString(),
  };
}
