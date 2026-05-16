import "@testing-library/jest-dom/vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import { DEFAULT_SETTINGS } from "@/constants/settings";
import { useSettingsStore } from "@/stores/settingsStore";
import { useTaskStore } from "@/stores/taskStore";
import { useTimerStore } from "@/stores/timerStore";
import { TaskManagement } from "./TaskManagement";

describe("TaskManagement", () => {
  beforeEach(() => {
    localStorage.clear();
    useSettingsStore.setState(DEFAULT_SETTINGS);
    useTaskStore.setState({ tasks: [], currentTaskId: undefined });
    useTimerStore.getState().resetTimer("shortBreak", 300);
    useTimerStore.getState().setCurrentTask(undefined);
  });

  function renderTaskManagement() {
    return render(
      <MemoryRouter initialEntries={["/tasks"]}>
        <Routes>
          <Route element={<TaskManagement />} path="/tasks" />
          <Route element={<div data-testid="focus-route" />} path="/focus" />
        </Routes>
      </MemoryRouter>,
    );
  }

  it("opens the task drawer and creates a task", () => {
    renderTaskManagement();

    fireEvent.click(screen.getByRole("button", { name: "新建任务" }));
    fireEvent.change(screen.getByPlaceholderText("例如：阅读《高效能人士的七个习惯》"), {
      target: { value: "实现番茄钟计时功能" },
    });
    fireEvent.click(screen.getByRole("button", { name: "创建任务" }));

    expect(screen.getByText("实现番茄钟计时功能")).toBeInTheDocument();
  });

  it("uses quick pomodoro options when creating a task", () => {
    renderTaskManagement();

    fireEvent.click(screen.getByRole("button", { name: "新建任务" }));
    fireEvent.change(screen.getByPlaceholderText("例如：阅读《高效能人士的七个习惯》"), {
      target: { value: "拆 PRD" },
    });
    fireEvent.click(screen.getByRole("button", { name: "预计 3 个番茄" }));
    fireEvent.click(screen.getByRole("button", { name: "创建任务" }));

    expect(useTaskStore.getState().tasks[0]).toMatchObject({
      title: "拆 PRD",
      estimatedPomodoros: 3,
    });
  });

  it("supports custom pomodoro estimate beyond quick options", () => {
    renderTaskManagement();

    fireEvent.click(screen.getByRole("button", { name: "新建任务" }));
    fireEvent.click(screen.getByRole("button", { name: "切换为自定义预计番茄数" }));
    fireEvent.change(screen.getByLabelText("自定义预计番茄数"), {
      target: { value: "6" },
    });
    fireEvent.change(screen.getByPlaceholderText("例如：阅读《高效能人士的七个习惯》"), {
      target: { value: "长任务" },
    });
    fireEvent.click(screen.getByRole("button", { name: "创建任务" }));

    expect(useTaskStore.getState().tasks[0]).toMatchObject({
      title: "长任务",
      estimatedPomodoros: 6,
    });
  });

  it("opens the task drawer in edit mode from a task card", () => {
    useTaskStore.getState().createTask({
      title: "写日报",
      priority: "important",
      estimatedPomodoros: 2,
    });

    renderTaskManagement();

    fireEvent.click(screen.getByRole("button", { name: "编辑任务：写日报" }));

    expect(screen.getByText("编辑任务")).toBeInTheDocument();
    expect(screen.getByDisplayValue("写日报")).toBeInTheDocument();
  });

  it("starts a focus session and navigates to focus page from a task", () => {
    const task = useTaskStore.getState().createTask({
      title: "写日报",
      priority: "important",
      estimatedPomodoros: 2,
    });

    renderTaskManagement();

    fireEvent.click(screen.getByRole("button", { name: "开始专注：写日报" }));

    expect(useTaskStore.getState().currentTaskId).toBe(task.id);
    expect(useTaskStore.getState().tasks[0].status).toBe("inProgress");
    expect(useTimerStore.getState()).toMatchObject({
      currentTaskId: task.id,
      mode: "focus",
      status: "running",
      totalSeconds: DEFAULT_SETTINGS.focusMinutes * 60,
    });
    expect(screen.getByTestId("focus-route")).toBeInTheDocument();
  });

  it("keeps the left content area stretch wrapper for empty-state alignment", () => {
    const { container } = renderTaskManagement();

    expect(container.querySelector(".grid.items-stretch")).toBeInTheDocument();
    expect(container.querySelector(".flex-1.min-h-0")).toBeInTheDocument();
  });
});
