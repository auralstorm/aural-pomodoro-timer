import "@testing-library/jest-dom/vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";

import App from "./App";
import { useTimerStore } from "@/stores/timerStore";

describe("App", () => {
  beforeEach(() => {
    localStorage.clear();
    useTimerStore.getState().resetTimer("focus", 1500);
  });

  it("renders the focus workspace as the first meaningful screen", async () => {
    render(<App />);

    expect(await screen.findByRole("button", { name: "开始专注" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /今日任务/ })).toBeInTheDocument();
  });

  it("starts the focus timer from the main control", async () => {
    render(<App />);

    fireEvent.click(await screen.findByRole("button", { name: "开始专注" }));

    expect(screen.getByRole("button", { name: "暂停" })).toBeInTheDocument();
  });
});
