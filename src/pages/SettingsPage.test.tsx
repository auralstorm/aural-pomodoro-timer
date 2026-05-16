import "@testing-library/jest-dom/vitest";
import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { DEFAULT_SETTINGS } from "@/constants/settings";
import { useModalStore } from "@/stores/modalStore";
import { useSettingsStore } from "@/stores/settingsStore";
import { SettingsPage } from "./SettingsPage";

const audioControllerMocks = vi.hoisted(() => ({
  playReminderTone: vi.fn().mockResolvedValue(undefined),
  playWhiteNoise: vi.fn().mockResolvedValue(undefined),
  setWhiteNoiseVolume: vi.fn(),
  stopWhiteNoise: vi.fn(),
}));

vi.mock("@/features/audio/audioController", () => audioControllerMocks);

describe("SettingsPage", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    useModalStore.setState({ activeModal: null });
    useSettingsStore.setState({
      ...DEFAULT_SETTINGS,
    });
  });

  it("adjusts timer values through shadcn input-group steppers", () => {
    render(<SettingsPage />);

    const focusSetting = screen.getByLabelText("专注时长设置");

    fireEvent.click(within(focusSetting).getByRole("button", { name: "减少专注时长" }));
    expect(useSettingsStore.getState().focusMinutes).toBe(24);

    fireEvent.click(within(focusSetting).getByRole("button", { name: "增加专注时长" }));
    expect(useSettingsStore.getState().focusMinutes).toBe(25);
  });

  it("keeps preset cards fixed and switches to custom after manual edits", () => {
    render(<SettingsPage />);

    fireEvent.click(screen.getByRole("button", { name: /轻量模式/i }));

    expect(useSettingsStore.getState().focusMinutes).toBe(15);
    expect(useSettingsStore.getState().shortBreakMinutes).toBe(3);
    expect(useSettingsStore.getState().longBreakMinutes).toBe(10);
    expect(useSettingsStore.getState().pomodoroPreset).toBe("light");

    const focusSetting = screen.getByLabelText("专注时长设置");
    fireEvent.click(within(focusSetting).getByRole("button", { name: "增加专注时长" }));

    expect(useSettingsStore.getState().focusMinutes).toBe(16);
    expect(useSettingsStore.getState().pomodoroPreset).toBe("custom");

    expect(screen.getByRole("button", { name: /轻量模式/i })).toHaveAttribute("aria-pressed", "false");
    expect(screen.getByRole("button", { name: /自定义/i })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByText("15 / 3")).toBeInTheDocument();
  });

  it("updates reminder switches, sound presets, and local data actions", () => {
    render(<SettingsPage />);

    fireEvent.click(screen.getByRole("switch", { name: "专注结束提醒" }));
    expect(useSettingsStore.getState().focusCompleteReminderEnabled).toBe(false);
    expect(useSettingsStore.getState().breakCompleteReminderEnabled).toBe(true);
    expect(useSettingsStore.getState().desktopNotificationEnabled).toBe(true);

    fireEvent.click(screen.getByRole("switch", { name: "桌面通知" }));
    expect(useSettingsStore.getState().desktopNotificationEnabled).toBe(false);

    fireEvent.click(screen.getByRole("switch", { name: "最小化到托盘" }));
    expect(useSettingsStore.getState().minimizeToTray).toBe(true);

    fireEvent.click(screen.getByRole("button", { name: /舒缓/ }));
    expect(useSettingsStore.getState().reminderTonePreset).toBe("soothing");
    expect(audioControllerMocks.playReminderTone).toHaveBeenCalledWith("soothing", 70);

    fireEvent.click(screen.getByRole("button", { name: /溪流/ }));
    expect(useSettingsStore.getState().whiteNoisePreset).toBe("stream");
    expect(audioControllerMocks.playWhiteNoise).toHaveBeenCalledWith("stream", 70);

    fireEvent.click(screen.getByRole("button", { name: "播放预览" }));
    expect(audioControllerMocks.playReminderTone).toHaveBeenLastCalledWith("soothing", 70);

    act(() => {
      useSettingsStore.getState().updateSettings({ volume: 55 });
    });
    expect(audioControllerMocks.setWhiteNoiseVolume).toHaveBeenCalledWith(55);

    fireEvent.click(screen.getByRole("button", { name: "清除数据" }));
    expect(useModalStore.getState().activeModal).toBe("clearDataConfirm");
  });

  it("hides settings that are not backed by runtime behavior yet", () => {
    render(<SettingsPage />);

    expect(screen.queryByRole("switch", { name: "提前 1 分钟提醒" })).not.toBeInTheDocument();
    expect(screen.getByRole("switch", { name: "最小化到托盘" })).toBeInTheDocument();
  });

  it("stops preview white noise when leaving the settings page", () => {
    const { unmount } = render(<SettingsPage />);

    fireEvent.click(screen.getByRole("button", { name: /溪流/ }));
    unmount();

    expect(audioControllerMocks.stopWhiteNoise).toHaveBeenCalled();
  });
});
