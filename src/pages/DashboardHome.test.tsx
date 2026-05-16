import "@testing-library/jest-dom/vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it } from "vitest";

import { useStatsStore } from "@/stores/statsStore";
import { useTaskStore } from "@/stores/taskStore";
import { useTimerStore } from "@/stores/timerStore";
import { DashboardHome } from "./DashboardHome";

describe("DashboardHome", () => {
  beforeEach(() => {
    localStorage.clear();
    useStatsStore.setState({ sessions: [] });
    useTaskStore.setState({ tasks: [], currentTaskId: undefined });
    useTimerStore.getState().resetTimer("focus", 1500);
    useTimerStore.getState().setCurrentTask(undefined);
  });

  it("renders without crashing when linked from the logo", async () => {
    render(
      <MemoryRouter>
        <DashboardHome />
      </MemoryRouter>,
    );

    expect(await screen.findByText("今天也来专注一会儿吧")).toBeInTheDocument();
  });

  it("syncs timer current task when starting a task from the dashboard", () => {
    const task = useTaskStore.getState().createTask({
      title: "写日报",
      priority: "normal",
      estimatedPomodoros: 1,
    });

    render(
      <MemoryRouter>
        <DashboardHome />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByText("写日报").closest("article")!);

    expect(useTaskStore.getState().currentTaskId).toBe(task.id);
    expect(useTimerStore.getState().currentTaskId).toBe(task.id);
  });

  it("matches the dashboard information structure from the design", () => {
    render(
      <MemoryRouter>
        <DashboardHome />
      </MemoryRouter>,
    );

    expect(screen.getByText("当前番茄钟")).toBeInTheDocument();
    expect(screen.getByText("连续打卡天数")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /添加任务/ })).toBeInTheDocument();
    expect(screen.queryByText("本周专注")).not.toBeInTheDocument();
  });
});
