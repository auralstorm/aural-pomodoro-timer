import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useAchievementStore } from "@/features/achievements/stores/achievementStore";
import { useModalStore } from "@/stores/modalStore";
import { useSettingsStore } from "@/stores/settingsStore";
import { useStatsStore } from "@/stores/statsStore";
import { useTaskStore } from "@/stores/taskStore";
import { useTimerStore } from "@/stores/timerStore";
import { minutesToSeconds } from "@/utils/time";
import { usePomodoroTimer } from "./usePomodoroTimer";

const notificationMocks = vi.hoisted(() => ({
  notifyFocusComplete: vi.fn().mockResolvedValue(undefined),
  notifyBreakComplete: vi.fn().mockResolvedValue(undefined),
}));

const audioControllerMocks = vi.hoisted(() => ({
  playReminderTone: vi.fn().mockResolvedValue(undefined),
  playWhiteNoise: vi.fn().mockResolvedValue(undefined),
  stopWhiteNoise: vi.fn(),
}));

vi.mock("@/desktop/notification", () => notificationMocks);
vi.mock("@/features/audio/audioController", () => audioControllerMocks);

describe("usePomodoroTimer", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-05-13T09:00:00.000Z"));

    notificationMocks.notifyFocusComplete.mockClear();
    notificationMocks.notifyBreakComplete.mockClear();
    audioControllerMocks.playReminderTone.mockClear();
    audioControllerMocks.playWhiteNoise.mockClear();
    audioControllerMocks.stopWhiteNoise.mockClear();

    useSettingsStore.getState().resetSettings();
    useStatsStore.setState({ sessions: [] });
    useTaskStore.setState({ tasks: [], currentTaskId: undefined });
    useAchievementStore.getState().clearAchievements();
    useModalStore.setState({ activeModal: null, payload: undefined });
    useTimerStore.getState().resetTimer("focus", minutesToSeconds(25));
    useTimerStore.getState().setCurrentTask(undefined);
    useTimerStore.getState().setCompletedPomodorosInCycle(0);
  });

  it("starts focus white noise and stops it when pausing or resetting", () => {
    useSettingsStore.getState().updateSettings({
      whiteNoisePreset: "forest",
      volume: 55,
    });

    const { result } = renderHook(() => usePomodoroTimer());

    act(() => {
      result.current.start();
    });

    expect(audioControllerMocks.playWhiteNoise).toHaveBeenCalledWith("forest", 55);

    act(() => {
      result.current.pause();
    });

    expect(audioControllerMocks.stopWhiteNoise).toHaveBeenCalledTimes(1);

    act(() => {
      result.current.reset();
    });

    expect(audioControllerMocks.stopWhiteNoise).toHaveBeenCalledTimes(2);
  });

  it("plays reminder audio on focus completion even when desktop notifications are disabled", () => {
    useAchievementStore
      .getState()
      .recordUnlocked(["morning-focus", "afternoon-restart", "night-focus", "weekend-focus"]);

    useSettingsStore.getState().updateSettings({
      soundEnabled: true,
      focusCompleteReminderEnabled: true,
      breakCompleteReminderEnabled: true,
      desktopNotificationEnabled: false,
      reminderTonePreset: "pikachu",
      whiteNoisePreset: "rain",
      volume: 48,
      autoStartBreak: false,
    });

    const { result } = renderHook(() => usePomodoroTimer());

    act(() => {
      result.current.start();
    });

    audioControllerMocks.playReminderTone.mockClear();
    audioControllerMocks.stopWhiteNoise.mockClear();
    notificationMocks.notifyFocusComplete.mockClear();

    act(() => {
      result.current.skip();
    });

    expect(audioControllerMocks.stopWhiteNoise).toHaveBeenCalled();
    expect(audioControllerMocks.playReminderTone).toHaveBeenCalledWith("pikachu", 48);
    expect(notificationMocks.notifyFocusComplete).toHaveBeenCalledWith({ enabled: false });
    expect(useTimerStore.getState().mode).toBe("shortBreak");
    expect(useModalStore.getState().activeModal).toBe("focusComplete");
    expect(useStatsStore.getState().sessions).toHaveLength(1);
  });

  it("keeps break completion notifications independent from reminder audio", () => {
    useSettingsStore.getState().updateSettings({
      soundEnabled: false,
      focusCompleteReminderEnabled: true,
      breakCompleteReminderEnabled: true,
      desktopNotificationEnabled: true,
      reminderTonePreset: "doraemon",
      whiteNoisePreset: "fire",
      volume: 62,
    });

    const { result } = renderHook(() => usePomodoroTimer());

    act(() => {
      result.current.switchMode("shortBreak");
      result.current.start();
    });

    audioControllerMocks.playReminderTone.mockClear();
    notificationMocks.notifyBreakComplete.mockClear();

    act(() => {
      result.current.skip();
    });

    expect(audioControllerMocks.playWhiteNoise).not.toHaveBeenCalled();
    expect(audioControllerMocks.playReminderTone).not.toHaveBeenCalled();
    expect(notificationMocks.notifyBreakComplete).toHaveBeenCalledWith({ enabled: true });
    expect(useTimerStore.getState().mode).toBe("focus");
    expect(useModalStore.getState().activeModal).toBe("breakComplete");
  });

  it("opens the all tasks complete modal instead of the single task complete modal when no pending tasks remain", () => {
    useAchievementStore
      .getState()
      .recordUnlocked([
        "first-task",
        "morning-focus",
        "afternoon-restart",
        "night-focus",
        "weekend-focus",
      ]);

    const currentTask = useTaskStore.getState().createTask({
      title: "完成 PRD",
      description: "补齐交互细节",
      priority: "important",
      estimatedPomodoros: 1,
    });
    useTaskStore.getState().setCurrentTask(currentTask.id);
    useTimerStore.getState().setCurrentTask(currentTask.id);

    const { result } = renderHook(() => usePomodoroTimer());

    act(() => {
      result.current.skip();
    });

    expect(useTaskStore.getState().tasks[0]?.status).toBe("completed");
    expect(useModalStore.getState().activeModal).toBe("allTasksComplete");
  });

  it("prioritizes achievement unlocked feedback over task completion flow when a new achievement is unlocked", () => {
    vi.setSystemTime(new Date("2026-05-13T08:00:00.000Z"));
    useAchievementStore
      .getState()
      .recordUnlocked(["morning-focus", "afternoon-restart", "night-focus", "weekend-focus"]);

    const currentTask = useTaskStore.getState().createTask({
      title: "晨间任务",
      description: "完成一轮早起专注",
      priority: "important",
      estimatedPomodoros: 1,
    });
    useTaskStore.getState().setCurrentTask(currentTask.id);
    useTimerStore.getState().setCurrentTask(currentTask.id);

    const { result } = renderHook(() => usePomodoroTimer());

    act(() => {
      result.current.skip();
    });

    expect(useAchievementStore.getState().unlockedMap["first-task"]).toBeDefined();
    expect(useModalStore.getState().activeModal).toBe("achievementUnlocked");
  });
});
