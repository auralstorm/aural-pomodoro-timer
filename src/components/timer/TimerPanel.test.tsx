import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { TimerPanel } from "./TimerPanel";

describe("TimerPanel", () => {
  it("renders mode tabs with leading icons and a rounded primary start button", () => {
    const { container } = render(
      <TimerPanel
        mode="focus"
        onModeChange={vi.fn()}
        onPause={vi.fn()}
        onReset={vi.fn()}
        onSkip={vi.fn()}
        onStart={vi.fn()}
        remainingSeconds={1500}
        status="idle"
        totalSeconds={1500}
      />,
    );

    const focusButton = screen.getByRole("button", { name: /专注25min/i });
    const shortBreakButton = screen.getByRole("button", { name: /短休息5min/i });
    const longBreakButton = screen.getByRole("button", { name: /长休息15min/i });
    const startButton = screen.getByRole("button", { name: "开始专注" });

    expect(focusButton.querySelector("img")).toBeTruthy();
    expect(shortBreakButton.querySelector("img")).toBeTruthy();
    expect(longBreakButton.querySelector("img")).toBeTruthy();
    expect(startButton.className).toContain("rounded-[30px]");
    expect(container.querySelector("[data-slot='segmented-tabs-indicator']")).toBeTruthy();
    expect(screen.getByTestId("timer-panel-decor")).toBeInTheDocument();
    expect(screen.getAllByTestId(/timer-panel-sprite-/)).toHaveLength(6);
  });

  it("renders the countdown as fixed-width animated digit slots", () => {
    render(
      <TimerPanel
        mode="focus"
        onModeChange={vi.fn()}
        onPause={vi.fn()}
        onReset={vi.fn()}
        onSkip={vi.fn()}
        onStart={vi.fn()}
        remainingSeconds={1416}
        status="idle"
        totalSeconds={1500}
      />,
    );

    const timeDisplay = screen.getByTestId("animated-time-display");

    expect(timeDisplay).toHaveClass("tabular-nums");
    expect(screen.getAllByTestId("animated-digit-slot")).toHaveLength(4);
    expect(screen.getByTestId("animated-time-colon")).toHaveTextContent(":");
  });

  it("shows 自由专注 when focus is running without a bound task", () => {
    render(
      <TimerPanel
        mode="focus"
        onModeChange={vi.fn()}
        onPause={vi.fn()}
        onReset={vi.fn()}
        onSkip={vi.fn()}
        onStart={vi.fn()}
        remainingSeconds={1416}
        status="running"
        totalSeconds={1500}
      />,
    );

    expect(screen.getByRole("heading", { name: "自由专注" })).toBeInTheDocument();
  });

  it("keeps 准备开始 when focus is idle without a bound task", () => {
    render(
      <TimerPanel
        mode="focus"
        onModeChange={vi.fn()}
        onPause={vi.fn()}
        onReset={vi.fn()}
        onSkip={vi.fn()}
        onStart={vi.fn()}
        remainingSeconds={1500}
        status="idle"
        totalSeconds={1500}
      />,
    );

    expect(screen.getByRole("heading", { name: "准备开始" })).toBeInTheDocument();
  });
});
