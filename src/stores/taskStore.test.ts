import { beforeEach, describe, expect, it } from "vitest";

import { useTaskStore } from "./taskStore";

describe("task store", () => {
  beforeEach(() => {
    localStorage.clear();
    useTaskStore.setState({
      tasks: [],
      currentTaskId: undefined,
    });
  });

  it("creates, selects, increments, and completes a task", () => {
    const task = useTaskStore.getState().createTask({
      title: "实现番茄钟计时功能",
      priority: "important",
      estimatedPomodoros: 1,
    });

    useTaskStore.getState().setCurrentTask(task.id);
    const updatedTask = useTaskStore.getState().incrementTaskPomodoro(task.id);

    expect(useTaskStore.getState().currentTaskId).toBe(task.id);
    expect(updatedTask?.completedPomodoros).toBe(1);
    expect(updatedTask?.status).toBe("completed");
  });

  it("persists tasks with Zustand persist metadata", () => {
    useTaskStore.getState().createTask({
      title: "写持久化测试",
      priority: "normal",
      estimatedPomodoros: 1,
    });

    const persisted = JSON.parse(localStorage.getItem("tomato-focus:tasks") ?? "{}");

    expect(persisted.version).toBe(1);
    expect(persisted.state.tasks).toHaveLength(1);
    expect(persisted.state.tasks[0].title).toBe("写持久化测试");
  });
});
