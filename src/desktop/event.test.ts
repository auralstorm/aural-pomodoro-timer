import { describe, expect, it, vi } from "vitest";

vi.mock("@tauri-apps/api/event", () => ({
  emit: vi.fn().mockRejectedValue(new Error("Tauri not available")),
  listen: vi.fn().mockRejectedValue(new Error("Tauri not available")),
}));

import { safeEmit, safeListen } from "./event";

describe("desktop event wrappers", () => {
  it("safeEmit does not throw when Tauri is unavailable", async () => {
    await expect(safeEmit("test-event")).resolves.toBeUndefined();
  });

  it("safeListen returns a no-op unlisten when Tauri is unavailable", async () => {
    const unlisten = await safeListen("test-event", () => {});
    expect(typeof unlisten).toBe("function");
    unlisten();
  });
});
