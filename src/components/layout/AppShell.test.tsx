import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useSettingsStore } from "@/stores/settingsStore";
import { AppShell } from "./AppShell";

const windowMocks = vi.hoisted(() => ({
  setWindowAlwaysOnTop: vi.fn().mockResolvedValue(undefined),
  setMinimizeToTrayEnabled: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("@/desktop/window", () => windowMocks);

describe("AppShell", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    useSettingsStore.getState().resetSettings();
  });

  it("syncs desktop window behaviors from settings", async () => {
    useSettingsStore.getState().updateSettings({
      alwaysOnTop: true,
      minimizeToTray: true,
    });

    render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route element={<AppShell />}>
            <Route element={<div>content</div>} path="/" />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    expect(await screen.findByText("content")).toBeInTheDocument();
    expect(windowMocks.setWindowAlwaysOnTop).toHaveBeenCalledWith(true);
    expect(windowMocks.setMinimizeToTrayEnabled).toHaveBeenCalledWith(true);
  });
});
