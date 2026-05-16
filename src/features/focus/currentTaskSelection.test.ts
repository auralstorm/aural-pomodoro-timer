import { beforeEach, describe, expect, it } from "vitest";

import { DEFAULT_SETTINGS } from "@/constants/settings";
import { selectCurrentTask, startFocusTask } from "@/features/focus/currentTaskSelection";
import { useSettingsStore } from "@/stores/settingsStore";
import { useTaskStore } from "@/stores/taskStore";
import { useTimerStore } from "@/stores/timerStore";

describe("currentTaskSelection", () => {
  beforeEach(() => {
    localStorage.clear();
    useSettingsStore.setState(DEFAULT_SETTINGS);
    useTaskStore.setState({ tasks: [], currentTaskId: undefined });
    useTimerStore.getState().resetTimer("focus", DEFAULT_SETTINGS.focusMinutes * 60);
    useTimerStore.getState().setCurrentTask(undefined);
  });

  it("resets a running focus round to idle when switching to another task", () => {
    const task1 = useTaskStore.getState().createTask({
      title: "任务1",
      priority: "normal",
      estimatedPomodoros: 1,
    });
    const task2 = useTaskStore.getState().createTask({
      title: "任务2",
      priority: "normal",
      estimatedPomodoros: 1,
    });

    startFocusTask(task1.id);

    selectCurrentTask(task2.id);

    expect(useTaskStore.getState().currentTaskId).toBe(task2.id);
    expect(useTimerStore.getState()).toMatchObject({
      currentTaskId: task2.id,
      mode: "focus",
      status: "idle",
      totalSeconds: DEFAULT_SETTINGS.focusMinutes * 60,
      startedAt: undefined,
      pausedAt: undefined,
      pausedAccumulatedMs: 0,
    });
    expect(useTaskStore.getState().tasks.find((task) => task.id === task1.id)?.status).toBe(
      "pending",
    );
    expect(useTaskStore.getState().tasks.find((task) => task.id === task2.id)?.status).toBe(
      "inProgress",
    );
  });

  it("resets a paused focus round to idle when switching to another task", () => {
    const task1 = useTaskStore.getState().createTask({
      title: "任务1",
      priority: "normal",
      estimatedPomodoros: 1,
    });
    const task2 = useTaskStore.getState().createTask({
      title: "任务2",
      priority: "normal",
      estimatedPomodoros: 1,
    });

    startFocusTask(task1.id);
    useTimerStore.getState().pauseTimer();

    selectCurrentTask(task2.id);

    expect(useTimerStore.getState()).toMatchObject({
      currentTaskId: task2.id,
      mode: "focus",
      status: "idle",
      totalSeconds: DEFAULT_SETTINGS.focusMinutes * 60,
    });
  });

  it("only switches current task during break modes without resetting the timer", () => {
    const task1 = useTaskStore.getState().createTask({
      title: "任务1",
      priority: "normal",
      estimatedPomodoros: 1,
    });
    const task2 = useTaskStore.getState().createTask({
      title: "任务2",
      priority: "normal",
      estimatedPomodoros: 1,
    });

    useTaskStore.getState().setCurrentTask(task1.id);
    useTimerStore.getState().setCurrentTask(task1.id);
    useTimerStore.getState().switchMode("shortBreak", 300);
    useTimerStore.getState().startTimer();

    selectCurrentTask(task2.id);

    expect(useTimerStore.getState()).toMatchObject({
      currentTaskId: task2.id,
      mode: "shortBreak",
      status: "running",
      totalSeconds: 300,
    });
  });

  it("starts a full new focus round when explicitly starting another task", () => {
    const task1 = useTaskStore.getState().createTask({
      title: "任务1",
      priority: "normal",
      estimatedPomodoros: 1,
    });
    const task2 = useTaskStore.getState().createTask({
      title: "任务2",
      priority: "normal",
      estimatedPomodoros: 1,
    });

    startFocusTask(task1.id);
    selectCurrentTask(task2.id);
    startFocusTask(task2.id);

    expect(useTimerStore.getState()).toMatchObject({
      currentTaskId: task2.id,
      mode: "focus",
      status: "running",
      totalSeconds: DEFAULT_SETTINGS.focusMinutes * 60,
    });
  });
});
