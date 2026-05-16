import "@testing-library/jest-dom/vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { DEFAULT_SETTINGS } from "@/constants/settings";
import { playReminderTone, playWhiteNoise, stopWhiteNoise } from "@/features/audio/audioController";
import { useSettingsStore } from "@/stores/settingsStore";
import { FocusTools } from "./FocusTools";

vi.mock("@/features/audio/audioController", () => ({
  playReminderTone: vi.fn(() => Promise.resolve()),
  playWhiteNoise: vi.fn(() => Promise.resolve()),
  stopWhiteNoise: vi.fn(),
}));

describe("FocusTools", () => {
  beforeEach(() => {
    localStorage.clear();
    useSettingsStore.setState(DEFAULT_SETTINGS);
    vi.clearAllMocks();
  });

  function renderFocusTools() {
    return render(
      <MemoryRouter>
        <FocusTools />
      </MemoryRouter>,
    );
  }

  it("renders focus tools as a compact two-column card grid with a settings entry", () => {
    renderFocusTools();

    const list = screen.getByTestId("focus-tools-list");

    expect(list).toHaveClass("grid-cols-2");
    expect(screen.getByRole("link", { name: "打开专注工具设置" })).toHaveAttribute(
      "href",
      "/settings",
    );
    expect(screen.getByText("自动开始下一轮")).toBeInTheDocument();
    expect(screen.getByText("窗口置顶")).toBeInTheDocument();
  });

  it("shows the renamed white-noise label and allows preset selection", async () => {
    useSettingsStore.setState({ whiteNoisePreset: "stream" });

    renderFocusTools();

    expect(screen.getByText("溪流")).toBeInTheDocument();

    fireEvent.pointerDown(screen.getByRole("button", { name: "选择白噪音" }));
    fireEvent.click(await screen.findByRole("menuitemradio", { name: "火焰" }));

    expect(useSettingsStore.getState().whiteNoisePreset).toBe("fire");
    expect(playWhiteNoise).toHaveBeenCalledWith("fire", DEFAULT_SETTINGS.volume);
  });

  it("allows reminder-tone selection without changing desktop notification state", async () => {
    useSettingsStore.setState({
      desktopNotificationEnabled: true,
      soundEnabled: true,
      reminderTonePreset: "soft",
    });

    renderFocusTools();

    fireEvent.pointerDown(screen.getByRole("button", { name: "选择提醒音" }));
    fireEvent.click(await screen.findByRole("menuitemradio", { name: "皮卡丘提示音" }));

    expect(useSettingsStore.getState().reminderTonePreset).toBe("pikachu");
    expect(useSettingsStore.getState().desktopNotificationEnabled).toBe(true);
    expect(playReminderTone).toHaveBeenCalledWith("pikachu", DEFAULT_SETTINGS.volume);
  });

  it("turns white noise off and restores the last selected preset when toggled back on", async () => {
    useSettingsStore.setState({
      ...DEFAULT_SETTINGS,
      whiteNoisePreset: "forest",
    });

    renderFocusTools();

    fireEvent.click(screen.getByRole("button", { name: "切换白噪音" }));

    expect(useSettingsStore.getState().whiteNoisePreset).toBe("off");
    expect(stopWhiteNoise).toHaveBeenCalled();

    fireEvent.click(screen.getByRole("button", { name: "切换白噪音" }));

    expect(useSettingsStore.getState().whiteNoisePreset).toBe("forest");
    expect(playWhiteNoise).toHaveBeenCalledWith("forest", DEFAULT_SETTINGS.volume);
  });
});
