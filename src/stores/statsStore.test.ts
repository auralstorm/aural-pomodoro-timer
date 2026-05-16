import { beforeEach, describe, expect, it } from "vitest";

import { useStatsStore } from "./statsStore";

describe("stats store", () => {
  beforeEach(() => {
    localStorage.clear();
    useStatsStore.setState({ sessions: [] });
  });

  it("persists sessions with Zustand persist metadata", () => {
    useStatsStore.getState().addSession({
      id: "session-1",
      mode: "focus",
      startedAt: "2026-05-13T00:00:00.000Z",
      endedAt: "2026-05-13T00:25:00.000Z",
      durationMinutes: 25,
      completed: true,
    });

    const persisted = JSON.parse(localStorage.getItem("tomato-focus:sessions") ?? "{}");

    expect(persisted.version).toBe(1);
    expect(persisted.state.sessions).toHaveLength(1);
  });
});
