import "@testing-library/jest-dom/vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import type { Task } from "@/types/task";

import { FocusTaskList } from "./FocusTaskList";

type BuildTaskOverrides = Partial<Task>;

function buildTask(id: string, title: string, overrides: BuildTaskOverrides = {}): Task {
  return {
    id,
    title,
    description: `${title} description`,
    priority: "normal",
    status: "pending",
    estimatedPomodoros: 1,
    completedPomodoros: 0,
    createdAt: "2026-05-14T00:00:00.000Z",
    updatedAt: "2026-05-14T00:00:00.000Z",
    ...overrides,
  };
}

describe("FocusTaskList", () => {
  it("renders the empty state and forwards create actions when no tasks exist", () => {
    const onCreateTask = vi.fn();

    render(<FocusTaskList onCreateTask={onCreateTask} tasks={[]} />);

    expect(
      screen.getByRole("heading", { name: "还没有任务" }),
    ).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "添加任务" }));

    expect(onCreateTask).toHaveBeenCalledTimes(1);
  });

  it("does not render an add-task button when no create callback is provided", () => {
    render(<FocusTaskList tasks={[]} />);

    expect(
      screen.getByRole("heading", { name: "还没有任务" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "添加任务" }),
    ).not.toBeInTheDocument();
  });

  it("sorts current task first, unfinished tasks before completed, and truncates the preview to four items", () => {
    const tasks = [
      buildTask("task-1", "已完成-旧", {
        status: "completed",
        updatedAt: "2026-05-14T01:00:00.000Z",
      }),
      buildTask("task-2", "进行中-较新", {
        status: "inProgress",
        updatedAt: "2026-05-14T05:00:00.000Z",
      }),
      buildTask("task-3", "待办-最新", {
        status: "pending",
        updatedAt: "2026-05-14T06:00:00.000Z",
      }),
      buildTask("task-4", "当前任务", {
        status: "completed",
        updatedAt: "2026-05-14T00:30:00.000Z",
      }),
      buildTask("task-5", "待办-次新", {
        status: "pending",
        updatedAt: "2026-05-14T04:00:00.000Z",
      }),
      buildTask("task-6", "已完成-最新", {
        status: "completed",
        updatedAt: "2026-05-14T07:00:00.000Z",
      }),
    ];

    render(<FocusTaskList currentTaskId="task-4" tasks={tasks} />);

    const articles = screen.getAllByRole("article");
    expect(articles).toHaveLength(4);
    expect(articles.map((article) => article.getAttribute("aria-label"))).toEqual([
      "当前任务",
      "待办-最新",
      "进行中-较新",
      "待办-次新",
    ]);
    expect(screen.queryByText("已完成-最新")).not.toBeInTheDocument();
    expect(screen.queryByText("已完成-旧")).not.toBeInTheDocument();
  });

  it("renders compact task rows with current badge, truncates long titles, and simplifies the actions menu", () => {
    const tasks = [
      buildTask("task-1", "UI评审围绕你的番茄时钟 Tauri 2 项目，核心解决了以下关键问", {
        estimatedPomodoros: 3,
        updatedAt: "2026-05-14T03:00:00.000Z",
      }),
    ];

    render(<FocusTaskList currentTaskId="task-1" tasks={tasks} />);

    expect(
      screen.getByRole("article", {
        name: /UI评审围绕你的番茄时钟 Tauri 2 项目，核心解决了以下关键问/,
      }),
    ).toBeInTheDocument();
    expect(screen.getByText("当前专注")).toBeInTheDocument();
    expect(
      screen.getByTitle("UI评审围绕你的番茄时钟 Tauri 2 项目，核心解决了以下关键问"),
    ).toHaveClass("truncate");

    fireEvent.pointerDown(screen.getByRole("button", { name: "更多操作" }));
    expect(screen.getByRole("menuitem", { name: "编辑" })).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: "删除" })).toBeInTheDocument();
  });

  it("sets a task as current when the row is clicked", () => {
    const onSetCurrent = vi.fn();
    const tasks = [buildTask("task-1", "整理周报")];

    render(<FocusTaskList onSetCurrent={onSetCurrent} tasks={tasks} />);

    fireEvent.click(screen.getByRole("article", { name: "整理周报" }));

    expect(onSetCurrent).toHaveBeenCalledWith("task-1");
  });
});
