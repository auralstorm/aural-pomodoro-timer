import "@testing-library/jest-dom/vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { MemoryRouter } from "react-router-dom";

import { DEFAULT_SETTINGS } from "@/constants/settings";
import { useSettingsStore } from "@/stores/settingsStore";
import { useTaskStore } from "@/stores/taskStore";
import { useTimerStore } from "@/stores/timerStore";
import { FocusWorkspace } from "./FocusWorkspace";

describe("FocusWorkspace", () => {
  beforeEach(() => {
    localStorage.clear();
    useSettingsStore.setState(DEFAULT_SETTINGS);
    useTaskStore.setState({ tasks: [], currentTaskId: undefined });
    useTimerStore.getState().resetTimer("focus", 1500);
    useTimerStore.getState().setCurrentTask(undefined);
  });

  it("renders the focus task preview card with the add-task entry point", () => {
    render(
      <MemoryRouter>
        <FocusWorkspace />
      </MemoryRouter>,
    );

    expect(screen.getByText("今日任务")).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: "添加任务" })[0]).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "查看全部任务" })).toHaveAttribute("href", "/tasks");
  });

  it("opens the task editor drawer from the focus task preview card", () => {
    render(
      <MemoryRouter>
        <FocusWorkspace />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getAllByRole("button", { name: "添加任务" })[0]);

    expect(screen.getByText("新建任务")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("例如：阅读《高效能人士的七个习惯》")).toBeInTheDocument();
  });

  it("resets a running focus round to idle when switching to another task from the preview card", () => {
    const task1 = useTaskStore.getState().createTask({
      title: "任务1",
      priority: "normal",
      estimatedPomodoros: 1,
    });
    const task2 = useTaskStore.getState().createTask({
      title: "任务2",
      priority: "normal",
      estimatedPomodoros: 1,
    });
    useTaskStore.getState().setCurrentTask(task1.id);
    useTimerStore.getState().setCurrentTask(task1.id);
    useTimerStore.getState().startTimer();

    render(
      <MemoryRouter>
        <FocusWorkspace />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole("article", { name: "任务2" }));

    expect(useTaskStore.getState().currentTaskId).toBe(task2.id);
    expect(useTimerStore.getState()).toMatchObject({
      mode: "focus",
      status: "idle",
      totalSeconds: DEFAULT_SETTINGS.focusMinutes * 60,
    });
  });
});
