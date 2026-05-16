import "@testing-library/jest-dom/vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { MemoryRouter } from "react-router-dom";

import { useTaskStore } from "@/stores/taskStore";
import { useTimerStore } from "@/stores/timerStore";
import { FocusTaskCard } from "./FocusTaskCard";

describe("FocusTaskCard", () => {
  beforeEach(() => {
    localStorage.clear();
    useTaskStore.setState({ tasks: [], currentTaskId: undefined });
    useTimerStore.getState().setCurrentTask(undefined);
  });

  it("renders add button, preview list item, and a 查看全部任务 link", () => {
    useTaskStore.getState().createTask({
      title: "实现番茄钟计时功能",
      priority: "important",
      estimatedPomodoros: 3,
    });

    render(
      <MemoryRouter>
        <FocusTaskCard />
      </MemoryRouter>,
    );

    expect(screen.getByRole("button", { name: "添加任务" })).toBeInTheDocument();
    expect(screen.getByLabelText("实现番茄钟计时功能")).toBeInTheDocument();

    const viewAllLink = screen.getByRole("link", { name: "查看全部任务" });
    expect(viewAllLink).toBeInTheDocument();
    expect(viewAllLink).toHaveAttribute("href", "/tasks");
  });

  it("opens the task editor drawer from the add button", () => {
    render(
      <MemoryRouter>
        <FocusTaskCard />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getAllByRole("button", { name: "添加任务" })[0]);

    expect(screen.getByText("新建任务")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("例如：阅读《高效能人士的七个习惯》"),
    ).toBeInTheDocument();
  });

  it("keeps a stable preview card height for task capacity", () => {
    render(
      <MemoryRouter>
        <FocusTaskCard />
      </MemoryRouter>,
    );

    expect(screen.getByText("今日任务").closest("div[class*='grid']")).toHaveClass(
      "min-h-[392px]",
      "grid-rows-[auto,minmax(0,1fr),auto]",
    );
  });
});

