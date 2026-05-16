import "@testing-library/jest-dom/vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it } from "vitest";

import { useModalStore } from "@/stores/modalStore";
import { useStatsStore } from "@/stores/statsStore";
import { useTaskStore } from "@/stores/taskStore";
import { useTimerStore } from "@/stores/timerStore";
import { GlobalModalRenderer } from "./GlobalModalRenderer";

describe("GlobalModalRenderer", () => {
  beforeEach(() => {
    localStorage.clear();
    useModalStore.getState().closeModal();
    useStatsStore.setState({ sessions: [] });
    useTaskStore.setState({ tasks: [], currentTaskId: undefined });
    useTimerStore.getState().switchMode("shortBreak", 300);
  });

  it("starts the current break timer from the focus complete modal primary action", () => {
    useModalStore.getState().openModal("focusComplete", { minutes: 25 });

    render(
      <MemoryRouter>
        <GlobalModalRenderer />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole("button", { name: "开始休息" }));

    expect(useTimerStore.getState().status).toBe("running");
  });

  it("navigates to statistics from the all tasks complete modal primary action", () => {
    useModalStore.getState().openModal("allTasksComplete");

    render(
      <MemoryRouter>
        <GlobalModalRenderer />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole("button", { name: "查看统计" }));

    expect(useModalStore.getState().activeModal).toBeNull();
  });

  it("renders all tasks complete actions in primary-then-secondary order", () => {
    useModalStore.getState().openModal("allTasksComplete");

    render(
      <MemoryRouter>
        <GlobalModalRenderer />
      </MemoryRouter>,
    );

    const primary = screen.getByRole("button", { name: "查看统计" });
    const secondary = screen.getByRole("button", { name: "返回首页" });

    expect(
      primary.compareDocumentPosition(secondary) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });

  it("renders delete confirmation actions in primary-then-secondary order", () => {
    useModalStore.getState().openModal("deleteTaskConfirm", {
      taskId: "task-1",
      taskTitle: "删掉我",
    });

    render(
      <MemoryRouter>
        <GlobalModalRenderer />
      </MemoryRouter>,
    );

    const primary = screen.getByRole("button", { name: "删除任务" });
    const secondary = screen.getByRole("button", { name: "取消" });

    expect(
      primary.compareDocumentPosition(secondary) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });

  it("uses a wider dialog layout for focus completion artwork modals", () => {
    useModalStore.getState().openModal("focusComplete", { minutes: 25 });

    render(
      <MemoryRouter>
        <GlobalModalRenderer />
      </MemoryRouter>,
    );

    const content = screen.getByRole("dialog");

    expect(content.className).toContain("sm:max-w-[680px]");
  });

  it("renders clear data confirmation actions in primary-then-secondary order", () => {
    useModalStore.getState().openModal("clearDataConfirm");

    render(
      <MemoryRouter>
        <GlobalModalRenderer />
      </MemoryRouter>,
    );

    const primary = screen.getByRole("button", { name: "确认清除" });
    const secondary = screen.getByRole("button", { name: "取消" });

    expect(
      primary.compareDocumentPosition(secondary) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });
});
