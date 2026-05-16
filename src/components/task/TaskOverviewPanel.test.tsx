import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { TaskOverviewPanel } from "./TaskOverviewPanel";

describe("TaskOverviewPanel", () => {
  it("renders the redesigned overview cards with detailed summaries", () => {
    render(
      <TaskOverviewPanel
        completedCount={6}
        completedPomodoroDelta={undefined}
        completionRate={68}
        completionRateDelta={undefined}
        estimatedPomodoroDelta={undefined}
        estimatedFocusMinutes={150}
        remainingCount={4}
        remainingCountDelta={undefined}
        totalCompletedPomodoros={6}
        totalCompletedFocusMinutes={90}
        totalEstimatedPomodoros={10}
        totalTasks={10}
      />,
    );

    expect(screen.getByText("任务概览")).toBeInTheDocument();
    expect(screen.getByText("今日任务完成率")).toBeInTheDocument();
    expect(screen.getByText("68%")).toBeInTheDocument();
    expect(screen.getByText("6 / 10 个任务已完成")).toBeInTheDocument();
    expect(screen.getByText("今日预计番茄数")).toBeInTheDocument();
    expect(screen.getByText("10 个")).toBeInTheDocument();
    expect(screen.getByText("预计专注时间 2 小时 30 分钟")).toBeInTheDocument();
    expect(screen.getByText("已完成番茄数")).toBeInTheDocument();
    expect(screen.getByText("专注时长 1 小时 30 分钟")).toBeInTheDocument();
    expect(screen.getByText("剩余任务数")).toBeInTheDocument();
    expect(screen.getByText("继续加油，完成更多小目标！")).toBeInTheDocument();
  });

  it("hides yesterday comparison when no delta data exists", () => {
    render(
      <TaskOverviewPanel
        completedCount={0}
        completedPomodoroDelta={undefined}
        completionRate={0}
        completionRateDelta={undefined}
        estimatedPomodoroDelta={undefined}
        estimatedFocusMinutes={0}
        remainingCount={0}
        remainingCountDelta={undefined}
        totalCompletedPomodoros={0}
        totalCompletedFocusMinutes={0}
        totalEstimatedPomodoros={0}
        totalTasks={0}
      />,
    );

    expect(screen.queryByText(/比昨天/)).not.toBeInTheDocument();
  });
});
