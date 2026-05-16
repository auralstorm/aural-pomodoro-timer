import { beforeEach, describe, expect, it, vi } from "vitest";

import { minutesToSeconds } from "@/utils/time";
import { useTimerStore } from "./timerStore";

describe("timer store", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-05-13T00:00:00.000Z"));
    useTimerStore.getState().resetTimer("focus", minutesToSeconds(25));
  });

  it("starts, pauses, resumes, and resets using timestamp state", () => {
    useTimerStore.getState().startTimer();

    expect(useTimerStore.getState().status).toBe("running");
    expect(useTimerStore.getState().startedAt).toBe("2026-05-13T00:00:00.000Z");

    vi.setSystemTime(new Date("2026-05-13T00:05:00.000Z"));
    useTimerStore.getState().pauseTimer();

    expect(useTimerStore.getState().status).toBe("paused");
    expect(useTimerStore.getState().pausedAt).toBe("2026-05-13T00:05:00.000Z");

    vi.setSystemTime(new Date("2026-05-13T00:07:00.000Z"));
    useTimerStore.getState().startTimer();

    expect(useTimerStore.getState().pausedAccumulatedMs).toBe(120000);

    useTimerStore.getState().resetTimer("shortBreak", minutesToSeconds(5));

    expect(useTimerStore.getState().mode).toBe("shortBreak");
    expect(useTimerStore.getState().status).toBe("idle");
    expect(useTimerStore.getState().totalSeconds).toBe(300);
  });

  it("persists timer state with Zustand persist metadata", () => {
    useTimerStore.getState().startTimer();

    const persisted = JSON.parse(localStorage.getItem("tomato-focus:timer") ?? "{}");

    expect(persisted.version).toBe(1);
    expect(persisted.state.status).toBe("running");
    expect(persisted.state.startedAt).toBe("2026-05-13T00:00:00.000Z");
  });
});
