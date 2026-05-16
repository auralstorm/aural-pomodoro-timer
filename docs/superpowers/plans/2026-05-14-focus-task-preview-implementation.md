# Focus Task Preview Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将专注页右侧“今日任务”区域改造成轻量任务预览卡，支持新建任务、任务预览、当前任务置顶、快速切换和进入完整任务页。

**Architecture:** 保持 `FocusWorkspace` 作为容器编排层，把右侧任务卡拆成小粒度展示组件。任务排序、列表截断、空状态切换集中在 `FocusTaskList`，新建/编辑继续复用现有 `TaskEditorDrawer`，更多操作收敛成独立菜单组件，避免把任务页的管理复杂度搬进专注页。

**Tech Stack:** React、TypeScript、React Router、Zustand、shadcn drawer/dropdown-menu、Vitest、Testing Library

---

## File Map

**Create:**
- `src/components/timer/FocusTaskCard.tsx` — 右侧整张任务卡容器，负责头部、底部入口和 drawer/menu 的装配
- `src/components/timer/FocusTaskList.tsx` — 任务排序、截断、空状态切换
- `src/components/timer/FocusTaskListItem.tsx` — 单条紧凑任务行展示
- `src/components/timer/FocusTaskActionsMenu.tsx` — 单条任务更多操作菜单
- `src/components/timer/FocusTaskEmptyState.tsx` — 任务空状态

**Modify:**
- `src/pages/FocusWorkspace.tsx` — 将 `TaskMiniList` 替换为 `FocusTaskCard`
- `src/components/timer/TaskMiniList.tsx` — 删除或改为过渡导出；实现完成后不再被 `FocusWorkspace` 使用
- `src/components/task/TaskEditorDrawer.tsx` — 如有必要，补可选 props 以支持从专注页打开时更轻的标题文案；不改主结构
- `src/components/task/task-editor.types.ts` — 如有必要，补充复用类型
- `src/components/timer/FocusTools.tsx` — 无需修改，保持职责单一
- `src/stores/taskStore.ts` — 如需补 helper，仅新增最小动作，避免把排序塞进 store

**Test:**
- `src/components/timer/FocusTaskCard.test.tsx`
- `src/components/timer/FocusTaskList.test.tsx`
- `src/pages/FocusWorkspace.test.tsx` 或补到现有 `src/App.test.tsx`

---

### Task 1: 建立右侧任务卡的测试骨架

**Files:**
- Create: `src/components/timer/FocusTaskCard.test.tsx`
- Create: `src/components/timer/FocusTaskList.test.tsx`

- [ ] **Step 1: 写失败测试，锁定核心行为**

```tsx
import { MemoryRouter } from "react-router-dom";
import { render, screen } from "@testing-library/react";

import { FocusTaskCard } from "./FocusTaskCard";

describe("FocusTaskCard", () => {
  it("renders add task and view all entry points", () => {
    render(
      <MemoryRouter>
        <FocusTaskCard />
      </MemoryRouter>,
    );

    expect(screen.getByRole("button", { name: /添加任务/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /查看全部任务/i })).toBeInTheDocument();
  });
});
```

```tsx
import { render, screen } from "@testing-library/react";

import { FocusTaskList } from "./FocusTaskList";

describe("FocusTaskList", () => {
  it("puts current task first and limits preview to four items", () => {
    render(
      <FocusTaskList
        currentTaskId="task-3"
        tasks={[
          { id: "task-1", title: "A", status: "pending", priority: "normal", estimatedPomodoros: 2, completedPomodoros: 0, createdAt: "2026-05-14T08:00:00.000Z", updatedAt: "2026-05-14T08:00:00.000Z" },
          { id: "task-2", title: "B", status: "pending", priority: "normal", estimatedPomodoros: 2, completedPomodoros: 0, createdAt: "2026-05-14T08:10:00.000Z", updatedAt: "2026-05-14T08:10:00.000Z" },
          { id: "task-3", title: "C", status: "pending", priority: "normal", estimatedPomodoros: 2, completedPomodoros: 0, createdAt: "2026-05-14T08:20:00.000Z", updatedAt: "2026-05-14T08:20:00.000Z" },
          { id: "task-4", title: "D", status: "pending", priority: "normal", estimatedPomodoros: 2, completedPomodoros: 0, createdAt: "2026-05-14T08:30:00.000Z", updatedAt: "2026-05-14T08:30:00.000Z" },
          { id: "task-5", title: "E", status: "pending", priority: "normal", estimatedPomodoros: 2, completedPomodoros: 0, createdAt: "2026-05-14T08:40:00.000Z", updatedAt: "2026-05-14T08:40:00.000Z" },
        ]}
      />,
    );

    expect(screen.getAllByRole("article")).toHaveLength(4);
    expect(screen.getAllByRole("article")[0]).toHaveTextContent("C");
  });
});
```

- [ ] **Step 2: 运行测试确认失败**

Run: `pnpm test -- src/components/timer/FocusTaskCard.test.tsx src/components/timer/FocusTaskList.test.tsx`

Expected: FAIL，提示 `FocusTaskCard` / `FocusTaskList` 文件不存在。

- [ ] **Step 3: 创建最小组件占位**

```tsx
// src/components/timer/FocusTaskCard.tsx
import { Link } from "react-router-dom";

export function FocusTaskCard() {
  return (
    <section>
      <button type="button">添加任务</button>
      <Link to="/tasks">查看全部任务</Link>
    </section>
  );
}
```

```tsx
// src/components/timer/FocusTaskList.tsx
import type { Task } from "@/types/task";

type FocusTaskListProps = {
  tasks: Task[];
  currentTaskId?: string | null;
};

export function FocusTaskList({ tasks }: FocusTaskListProps) {
  return (
    <div>
      {tasks.slice(0, 4).map((task) => (
        <article key={task.id}>{task.title}</article>
      ))}
    </div>
  );
}
```

- [ ] **Step 4: 运行测试确认第一轮通过/第二轮按预期失败**

Run: `pnpm test -- src/components/timer/FocusTaskCard.test.tsx src/components/timer/FocusTaskList.test.tsx`

Expected:
- `FocusTaskCard` 测试 PASS
- `FocusTaskList` 排序测试 FAIL，因为当前任务尚未置顶

- [ ] **Step 5: Commit**

```bash
git add src/components/timer/FocusTaskCard.tsx src/components/timer/FocusTaskList.tsx src/components/timer/FocusTaskCard.test.tsx src/components/timer/FocusTaskList.test.tsx
git commit -m "test: add focus task preview component skeleton"
```

### Task 2: 实现列表排序、截断和空状态

**Files:**
- Create: `src/components/timer/FocusTaskEmptyState.tsx`
- Modify: `src/components/timer/FocusTaskList.tsx`
- Modify: `src/components/timer/FocusTaskList.test.tsx`

- [ ] **Step 1: 为空状态和排序补失败测试**

```tsx
it("shows empty state and add task action when there are no tasks", () => {
  const onCreate = vi.fn();

  render(<FocusTaskList currentTaskId={null} onCreateTask={onCreate} tasks={[]} />);

  expect(screen.getByText("还没有任务")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /添加任务/i })).toBeInTheDocument();
});
```

```tsx
it("orders current task first, pending before completed, then by updatedAt desc", () => {
  render(
    <FocusTaskList
      currentTaskId="task-2"
      tasks={[
        { id: "task-1", title: "完成任务", status: "completed", priority: "normal", estimatedPomodoros: 1, completedPomodoros: 1, createdAt: "2026-05-14T08:00:00.000Z", updatedAt: "2026-05-14T09:00:00.000Z" },
        { id: "task-2", title: "当前任务", status: "pending", priority: "normal", estimatedPomodoros: 2, completedPomodoros: 0, createdAt: "2026-05-14T08:10:00.000Z", updatedAt: "2026-05-14T08:10:00.000Z" },
        { id: "task-3", title: "较新未完成", status: "pending", priority: "normal", estimatedPomodoros: 2, completedPomodoros: 0, createdAt: "2026-05-14T08:20:00.000Z", updatedAt: "2026-05-14T10:00:00.000Z" },
      ]}
    />,
  );

  const items = screen.getAllByRole("article");
  expect(items[0]).toHaveTextContent("当前任务");
  expect(items[1]).toHaveTextContent("较新未完成");
  expect(items[2]).toHaveTextContent("完成任务");
});
```

- [ ] **Step 2: 运行测试确认失败**

Run: `pnpm test -- src/components/timer/FocusTaskList.test.tsx`

Expected: FAIL，空状态文案和排序断言不满足。

- [ ] **Step 3: 实现排序函数和空状态组件**

```tsx
// src/components/timer/FocusTaskEmptyState.tsx
import { AppButton } from "@/components/common/AppButton";
import { EmptyState } from "@/components/common/EmptyState";
import emptyTask from "@/assets/empty/illus-empty-task.png";

type FocusTaskEmptyStateProps = {
  onCreateTask: () => void;
};

export function FocusTaskEmptyState({ onCreateTask }: FocusTaskEmptyStateProps) {
  return (
    <EmptyState
      action={
        <AppButton onClick={onCreateTask} size="sm">
          添加任务
        </AppButton>
      }
      description="先添加一个小目标，再开始一轮更稳。"
      image={emptyTask}
      title="还没有任务"
    />
  );
}
```

```tsx
// src/components/timer/FocusTaskList.tsx
import type { Task } from "@/types/task";

import { FocusTaskEmptyState } from "./FocusTaskEmptyState";

type FocusTaskListProps = {
  tasks: Task[];
  currentTaskId?: string | null;
  onCreateTask?: () => void;
};

function sortTasks(tasks: Task[], currentTaskId?: string | null) {
  return [...tasks].sort((left, right) => {
    const leftCurrent = left.id === currentTaskId ? 1 : 0;
    const rightCurrent = right.id === currentTaskId ? 1 : 0;
    if (leftCurrent !== rightCurrent) return rightCurrent - leftCurrent;

    const leftPending = left.status === "completed" ? 0 : 1;
    const rightPending = right.status === "completed" ? 0 : 1;
    if (leftPending !== rightPending) return rightPending - leftPending;

    return new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime();
  });
}

export function FocusTaskList({ tasks, currentTaskId, onCreateTask = () => undefined }: FocusTaskListProps) {
  if (tasks.length === 0) {
    return <FocusTaskEmptyState onCreateTask={onCreateTask} />;
  }

  return (
    <div className="flex flex-col gap-3">
      {sortTasks(tasks, currentTaskId)
        .slice(0, 4)
        .map((task) => (
          <article key={task.id}>{task.title}</article>
        ))}
    </div>
  );
}
```

- [ ] **Step 4: 运行测试确认通过**

Run: `pnpm test -- src/components/timer/FocusTaskList.test.tsx`

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/timer/FocusTaskList.tsx src/components/timer/FocusTaskEmptyState.tsx src/components/timer/FocusTaskList.test.tsx
git commit -m "feat: add focus task preview sorting and empty state"
```

### Task 3: 实现单条任务行与更多操作菜单

**Files:**
- Create: `src/components/timer/FocusTaskListItem.tsx`
- Create: `src/components/timer/FocusTaskActionsMenu.tsx`
- Modify: `src/components/timer/FocusTaskList.tsx`
- Modify: `src/components/timer/FocusTaskCard.test.tsx`

- [ ] **Step 1: 写失败测试，锁定行内容和更多菜单**

```tsx
it("renders estimated pomodoros, current task tag, and actions menu", async () => {
  render(
    <MemoryRouter>
      <FocusTaskCard />
    </MemoryRouter>,
  );

  expect(screen.getByText(/预计/i)).toBeInTheDocument();
  expect(screen.getByText(/当前专注/i)).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /更多操作/i })).toBeInTheDocument();
});
```

- [ ] **Step 2: 运行测试确认失败**

Run: `pnpm test -- src/components/timer/FocusTaskCard.test.tsx`

Expected: FAIL，缺少预计胶囊/当前专注/更多操作。

- [ ] **Step 3: 最小实现紧凑任务行和菜单**

```tsx
// src/components/timer/FocusTaskActionsMenu.tsx
import { MoreVertical, Pencil, Play, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type FocusTaskActionsMenuProps = {
  onEdit: () => void;
  onDelete: () => void;
  onStart: () => void;
  onSetCurrent: () => void;
};

export function FocusTaskActionsMenu(props: FocusTaskActionsMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button aria-label="更多操作" size="icon" variant="ghost">
          <MoreVertical className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={props.onSetCurrent}>设为当前任务</DropdownMenuItem>
        <DropdownMenuItem onClick={props.onStart}>
          <Play className="mr-2 size-4" />
          开始专注
        </DropdownMenuItem>
        <DropdownMenuItem onClick={props.onEdit}>
          <Pencil className="mr-2 size-4" />
          编辑
        </DropdownMenuItem>
        <DropdownMenuItem className="text-destructive" onClick={props.onDelete}>
          <Trash2 className="mr-2 size-4" />
          删除
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```

```tsx
// src/components/timer/FocusTaskListItem.tsx
import { Check } from "lucide-react";

import { Tag } from "@/components/common/Tag";
import type { Task } from "@/types/task";

import { FocusTaskActionsMenu } from "./FocusTaskActionsMenu";

type FocusTaskListItemProps = {
  task: Task;
  isCurrent: boolean;
  onToggleComplete: (taskId: string) => void;
  onSetCurrent: (taskId: string) => void;
  onStart: (taskId: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
};

export function FocusTaskListItem({ task, isCurrent, onToggleComplete, onSetCurrent, onStart, onEdit, onDelete }: FocusTaskListItemProps) {
  return (
    <article className="grid grid-cols-[auto_1fr_auto_auto] items-center gap-3 rounded-[20px] border border-border bg-card px-4 py-3">
      <button
        aria-label={task.status === "completed" ? "取消完成" : "完成任务"}
        className="grid size-7 place-items-center rounded-full border border-border"
        onClick={() => onToggleComplete(task.id)}
        type="button"
      >
        {task.status === "completed" ? <Check className="size-4" /> : null}
      </button>
      <button className="min-w-0 text-left" onClick={() => onSetCurrent(task.id)} type="button">
        <span className="truncate font-semibold">{task.title}</span>
      </button>
      <div className="flex items-center gap-2">
        <Tag tone="focus">预计 {task.estimatedPomodoros}</Tag>
        {isCurrent ? <Tag tone="focus">当前专注</Tag> : null}
      </div>
      <FocusTaskActionsMenu
        onDelete={() => onDelete(task)}
        onEdit={() => onEdit(task)}
        onSetCurrent={() => onSetCurrent(task.id)}
        onStart={() => onStart(task.id)}
      />
    </article>
  );
}
```

- [ ] **Step 4: 运行测试确认通过**

Run: `pnpm test -- src/components/timer/FocusTaskCard.test.tsx src/components/timer/FocusTaskList.test.tsx`

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/timer/FocusTaskListItem.tsx src/components/timer/FocusTaskActionsMenu.tsx src/components/timer/FocusTaskList.tsx src/components/timer/FocusTaskCard.test.tsx
git commit -m "feat: add compact focus task items and actions menu"
```

### Task 4: 将任务卡接入专注页和 TaskEditorDrawer

**Files:**
- Modify: `src/components/timer/FocusTaskCard.tsx`
- Modify: `src/pages/FocusWorkspace.tsx`
- Modify: `src/components/task/TaskEditorDrawer.tsx`
- Modify: `src/pages/FocusWorkspace.test.tsx`

- [ ] **Step 1: 写失败测试，锁定专注页入口**

```tsx
it("opens task editor drawer from focus task card", async () => {
  render(
    <MemoryRouter>
      <FocusWorkspace />
    </MemoryRouter>,
  );

  await userEvent.click(screen.getByRole("button", { name: /添加任务/i }));

  expect(screen.getByText("新建任务")).toBeInTheDocument();
});
```

```tsx
it("navigates to tasks from the focus task card footer link", async () => {
  render(
    <MemoryRouter initialEntries={["/focus"]}>
      <FocusWorkspace />
    </MemoryRouter>,
  );

  expect(screen.getByRole("link", { name: /查看全部任务/i })).toHaveAttribute("href", "#/tasks");
});
```

- [ ] **Step 2: 运行测试确认失败**

Run: `pnpm test -- src/pages/FocusWorkspace.test.tsx`

Expected: FAIL，当前 `FocusWorkspace` 仍在用 `TaskMiniList`。

- [ ] **Step 3: 接入新卡片和 drawer 状态**

```tsx
// src/pages/FocusWorkspace.tsx
import { useState } from "react";

import { TaskEditorDrawer } from "@/components/task/TaskEditorDrawer";
import { FocusTaskCard } from "@/components/timer/FocusTaskCard";

export function FocusWorkspace() {
  const [taskEditorOpen, setTaskEditorOpen] = useState(false);
  const timer = usePomodoroTimer();

  return (
    <PageLayout>
      <div className="grid grid-cols-[minmax(0,1fr)_420px] gap-6 max-xl:grid-cols-1">
        <TimerPanel ... />
        <aside className="flex flex-col gap-6">
          <FocusTaskCard onCreateTask={() => setTaskEditorOpen(true)} />
          <FocusTools />
        </aside>
      </div>
      <TaskEditorDrawer
        mode="create"
        open={taskEditorOpen}
        onOpenChange={setTaskEditorOpen}
      />
    </PageLayout>
  );
}
```

```tsx
// src/components/timer/FocusTaskCard.tsx
import { Link, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";

import { AppCard } from "@/components/common/AppCard";
import { TaskEditorDrawer } from "@/components/task/TaskEditorDrawer";
import { useTaskStore } from "@/stores/taskStore";
import { useTimerStore } from "@/stores/timerStore";

import { FocusTaskList } from "./FocusTaskList";

type FocusTaskCardProps = {
  onCreateTask?: () => void;
};

export function FocusTaskCard({ onCreateTask }: FocusTaskCardProps) {
  const navigate = useNavigate();
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const { tasks, currentTaskId, setCurrentTask, completeTask } = useTaskStore();
  const setTimerTask = useTimerStore((state) => state.setCurrentTask);

  const pendingTasks = useMemo(
    () => tasks.filter((task) => task.status !== "completed"),
    [tasks],
  );

  return (
    <AppCard className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">今日任务</h2>
        <button className="..." onClick={() => onCreateTask?.()} type="button">
          + 添加任务
        </button>
      </div>

      <FocusTaskList
        currentTaskId={currentTaskId}
        onCreateTask={() => onCreateTask?.()}
        onDeleteTask={setEditingTaskId}
        onEditTask={setEditingTaskId}
        onSetCurrentTask={(taskId) => {
          setCurrentTask(taskId);
          setTimerTask(taskId);
        }}
        onStartTask={(taskId) => {
          setCurrentTask(taskId);
          setTimerTask(taskId);
          navigate("/focus");
        }}
        onToggleComplete={completeTask}
        tasks={pendingTasks}
      />

      <Link className="..." to="/tasks">
        查看全部任务
      </Link>

      <TaskEditorDrawer
        mode="edit"
        open={Boolean(editingTaskId)}
        taskId={editingTaskId}
        onOpenChange={(open) => {
          if (!open) setEditingTaskId(null);
        }}
      />
    </AppCard>
  );
}
```

- [ ] **Step 4: 运行测试确认通过**

Run: `pnpm test -- src/pages/FocusWorkspace.test.tsx src/components/timer/FocusTaskCard.test.tsx`

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/pages/FocusWorkspace.tsx src/components/timer/FocusTaskCard.tsx src/pages/FocusWorkspace.test.tsx
git commit -m "feat: wire focus task preview card into focus workspace"
```

### Task 5: 收口样式和完整验证

**Files:**
- Modify: `src/components/timer/FocusTaskCard.tsx`
- Modify: `src/components/timer/FocusTaskListItem.tsx`
- Modify: `src/components/timer/FocusTaskEmptyState.tsx`
- Modify: `src/pages/FocusWorkspace.tsx`

- [ ] **Step 1: 写视觉结构回归测试**

```tsx
it("renders no more than four compact preview items", () => {
  render(
    <MemoryRouter>
      <FocusTaskCard />
    </MemoryRouter>,
  );

  expect(screen.queryAllByRole("article").length).toBeLessThanOrEqual(4);
});
```

- [ ] **Step 2: 运行测试确认失败或不完整**

Run: `pnpm test -- src/components/timer/FocusTaskCard.test.tsx`

Expected: 如果超出四条或结构不稳定则 FAIL；否则继续补样式实现后统一验证。

- [ ] **Step 3: 收口样式实现**

```tsx
// 样式目标
// - 卡片头部与按钮对齐
// - 每行 52~60px 高度
// - 标题单行省略
// - 预计/当前专注都为轻胶囊
// - 底部“查看全部任务”是明确文本链接
// - 空状态按钮复用主按钮样式
```

执行点：
- `FocusTaskCard` 增加与设计稿一致的头部/底部间距
- `FocusTaskListItem` 控制为紧凑单行布局，避免描述和次级字段回流
- `FocusTaskEmptyState` 缩小插画和文案块，保持右栏整体平衡

- [ ] **Step 4: 运行完整验证**

Run: `pnpm test -- src/components/timer/FocusTaskCard.test.tsx src/components/timer/FocusTaskList.test.tsx src/pages/FocusWorkspace.test.tsx`

Expected: PASS

Run: `pnpm build`

Expected: build 成功，无 TypeScript 和 Vite 错误

- [ ] **Step 5: Commit**

```bash
git add src/components/timer/FocusTaskCard.tsx src/components/timer/FocusTaskList.tsx src/components/timer/FocusTaskListItem.tsx src/components/timer/FocusTaskActionsMenu.tsx src/components/timer/FocusTaskEmptyState.tsx src/pages/FocusWorkspace.tsx src/components/timer/FocusTaskCard.test.tsx src/components/timer/FocusTaskList.test.tsx src/pages/FocusWorkspace.test.tsx
git commit -m "feat: redesign focus page task preview card"
```

## Self-Review

- **Spec coverage:** 已覆盖头部 `+ 添加任务`、列表前 4 条、当前任务置顶、空状态主按钮、`查看全部任务`、更多操作菜单、复用 `TaskEditorDrawer`。
- **Placeholder scan:** 无 `TODO/TBD`；样式收口步骤用明确执行点描述，没有“自行处理”的占位语句。
- **Type consistency:** 统一使用 `currentTaskId`、`onCreateTask`、`onToggleComplete`、`onSetCurrentTask`、`onStartTask`、`onEditTask`、`onDeleteTask`，后续任务未改名漂移。
