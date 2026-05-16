import { describe, expect, it } from "vitest";

import {
  calculateRemainingSeconds,
  formatSeconds,
  minutesToSeconds,
} from "./time";

describe("time utilities", () => {
  it("formats seconds as mm:ss", () => {
    expect(formatSeconds(1500)).toBe("25:00");
    expect(formatSeconds(65)).toBe("01:05");
    expect(formatSeconds(0)).toBe("00:00");
  });

  it("converts minutes to seconds", () => {
    expect(minutesToSeconds(25)).toBe(1500);
    expect(minutesToSeconds(1.5)).toBe(90);
  });

  it("calculates remaining seconds from timestamps and paused time", () => {
    expect(
      calculateRemainingSeconds({
        totalSeconds: 1500,
        startedAt: "2026-05-13T00:00:00.000Z",
        now: "2026-05-13T00:10:00.000Z",
        pausedAccumulatedMs: 120000,
      }),
    ).toBe(1020);
  });

  it("does not count time after pausedAt as elapsed time", () => {
    expect(
      calculateRemainingSeconds({
        totalSeconds: 1500,
        startedAt: "2026-05-13T00:00:00.000Z",
        pausedAt: "2026-05-13T00:05:00.000Z",
        now: "2026-05-13T00:10:00.000Z",
        pausedAccumulatedMs: 0,
      }),
    ).toBe(1200);
  });
});
