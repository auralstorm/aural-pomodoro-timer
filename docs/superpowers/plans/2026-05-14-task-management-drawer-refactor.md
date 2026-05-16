# Task Management Drawer Refactor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the always-visible task creation form with a right-side task editor drawer so the task list becomes the primary surface and task creation/editing happens in a focused secondary panel.

**Architecture:** Keep `TaskManagement` as the container page, move creation/editing state into a dedicated `TaskEditorDrawer`, and split the current header/form/list/sidebar responsibilities into focused components. Reuse the existing shadcn `Drawer`, current Zustand task store, and existing task actions without changing task persistence semantics.

**Tech Stack:** React, TypeScript, Zustand, React Router, shadcn/ui Drawer (vaul), Vitest, Testing Library, Tailwind utility classes.

---

## File Structure

### New files
- `src/components/task/task-management.constants.ts`
  - Owns task page filter and priority option config used by the page and drawer.
- `src/components/task/TaskToolbar.tsx`
  - Owns page-level actions and filter row; exposes `onCreateTask` and current filter state.
- `src/components/task/TaskOverviewPanel.tsx`
  - Owns right-side summary and hero card rendering.
- `src/components/task/TaskEditorDrawer.tsx`
  - Owns drawer shell, create/edit mode label, save/cancel actions, and form lifecycle.
- `src/components/task/TaskEditorForm.tsx`
  - Owns title, description, estimated pomodoros, and priority controls.
- `src/components/task/task-editor.types.ts`
  - Owns form state and mode types so page and drawer share a stable contract.

### Modified files
- `src/pages/TaskManagement.tsx`
  - Remove inline form and wire drawer-driven create/edit flow.
- `src/components/task/TaskCard.tsx`
  - No behavior redesign expected, but may need smaller prop or action-label adjustments if page toolbar changes copy.
- `src/pages/TaskManagement.test.tsx`
  - Replace inline-form tests with drawer-open/create/edit assertions.

### Existing files referenced only
- `src/components/ui/drawer.tsx`
- `src/stores/taskStore.ts`
- `src/types/task.ts`

---

### Task 1: Extract shared task-page config

**Files:**
- Create: `src/components/task/task-management.constants.ts`
- Modify: `src/pages/TaskManagement.tsx`
- Test: none

- [ ] **Step 1: Create the shared constants file**

```ts
import type { TaskPriority } from "@/types/task";

export type TaskFilterValue = "all" | "today" | "inProgress" | "completed" | "important";

export const taskFilterOptions = [
  { value: "all" as const, label: "全部" },
  { value: "today" as const, label: "今日" },
  { value: "inProgress" as const, label: "进行中" },
  { value: "completed" as const, label: "已完成" },
  { value: "important" as const, label: "高优先级" },
];

export const taskPriorityOptions: { value: TaskPriority; label: string }[] = [
  { value: "normal", label: "普通" },
  { value: "important", label: "重要" },
  { value: "urgent", label: "紧急" },
];
```

- [ ] **Step 2: Replace local constants in the page**

Update `src/pages/TaskManagement.tsx` imports to:

```ts
import {
  taskFilterOptions,
  taskPriorityOptions,
  type TaskFilterValue,
} from "@/components/task/task-management.constants";
```

Then remove the local `FilterValue`, `filterOptions`, and `priorityOptions` declarations from the page.

- [ ] **Step 3: Run typecheck via build to confirm the extraction is safe**

Run: `pnpm build`
Expected: build succeeds with no import or duplicate symbol errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/task/task-management.constants.ts src/pages/TaskManagement.tsx
git commit -m "refactor: extract task page constants"
```

### Task 2: Define drawer form types and form component

**Files:**
- Create: `src/components/task/task-editor.types.ts`
- Create: `src/components/task/TaskEditorForm.tsx`
- Test: covered later through drawer integration test

- [ ] **Step 1: Create the editor types file**

```ts
import type { Task, TaskPriority } from "@/types/task";

export type TaskEditorMode = "create" | "edit";

export type TaskEditorValues = {
  title: string;
  description: string;
  estimatedPomodoros: number;
  priority: TaskPriority;
};

export type TaskEditorState = {
  mode: TaskEditorMode;
  task: Task | null;
  values: TaskEditorValues;
};

export const DEFAULT_TASK_EDITOR_VALUES: TaskEditorValues = {
  title: "",
  description: "",
  estimatedPomodoros: 2,
  priority: "normal",
};
```

- [ ] **Step 2: Create the form presentation component**

```tsx
import { taskPriorityOptions } from "@/components/task/task-management.constants";
import type { TaskEditorValues } from "@/components/task/task-editor.types";
import { cn } from "@/lib/utils";

type TaskEditorFormProps = {
  values: TaskEditorValues;
  onChange: (next: TaskEditorValues) => void;
};

export function TaskEditorForm({ values, onChange }: TaskEditorFormProps) {
  return (
    <div className="flex flex-col gap-5">
      <label className="flex flex-col gap-2">
        <span className="text-sm font-bold">任务名称</span>
        <input
          className="h-12 rounded-[var(--radius-md)] border border-border bg-background px-4 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
          placeholder="例如：阅读《高效能人士的七个习惯》"
          value={values.title}
          onChange={(event) => onChange({ ...values, title: event.target.value })}
        />
      </label>

      <label className="flex flex-col gap-2">
        <span className="text-sm font-bold">任务描述</span>
        <textarea
          className="min-h-28 rounded-[var(--radius-md)] border border-border bg-background px-4 py-3 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
          placeholder="补充任务目标、输出物或上下文"
          value={values.description}
          onChange={(event) => onChange({ ...values, description: event.target.value })}
        />
      </label>

      <label className="flex flex-col gap-2">
        <span className="text-sm font-bold">预计番茄数</span>
        <input
          className="h-12 rounded-[var(--radius-md)] border border-border bg-background px-4 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
          min={1}
          type="number"
          value={values.estimatedPomodoros}
          onChange={(event) =>
            onChange({
              ...values,
              estimatedPomodoros: Math.max(1, Number(event.target.value) || 1),
            })
          }
        />
      </label>

      <div className="flex flex-col gap-2">
        <span className="text-sm font-bold">优先级</span>
        <div className="grid grid-cols-3 gap-2">
          {taskPriorityOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange({ ...values, priority: option.value })}
              className={cn(
                "h-12 rounded-[var(--radius-md)] border font-semibold transition",
                values.priority === option.value
                  ? "border-primary bg-[var(--color-tomato-soft)] text-primary"
                  : "border-border bg-background text-muted-foreground",
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Run build to verify the standalone form compiles**

Run: `pnpm build`
Expected: build succeeds; no unresolved imports from the new task editor files.

- [ ] **Step 4: Commit**

```bash
git add src/components/task/task-editor.types.ts src/components/task/TaskEditorForm.tsx
git commit -m "feat: add task editor form component"
```

### Task 3: Add the drawer container component

**Files:**
- Create: `src/components/task/TaskEditorDrawer.tsx`
- Modify: `src/components/ui/drawer.tsx` (only if wider right-side width is needed)
- Test: covered later through page integration

- [ ] **Step 1: Create the drawer component**

```tsx
import { Drawer, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { AppButton } from "@/components/common/AppButton";
import { TaskEditorForm } from "@/components/task/TaskEditorForm";
import type { TaskEditorMode, TaskEditorValues } from "@/components/task/task-editor.types";

type TaskEditorDrawerProps = {
  open: boolean;
  mode: TaskEditorMode;
  values: TaskEditorValues;
  onOpenChange: (open: boolean) => void;
  onValuesChange: (next: TaskEditorValues) => void;
  onSubmit: () => void;
  onCancel: () => void;
};

export function TaskEditorDrawer({
  open,
  mode,
  values,
  onOpenChange,
  onValuesChange,
  onSubmit,
  onCancel,
}: TaskEditorDrawerProps) {
  const title = mode === "edit" ? "编辑任务" : "新建任务";
  const description =
    mode === "edit" ? "调整任务目标与优先级。" : "拆出一个清晰的小目标，直接开始推进。";

  return (
    <Drawer direction="right" open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="w-[min(760px,72vw)] max-w-none rounded-l-[32px] border-l border-border bg-card">
        <DrawerHeader className="gap-2 border-b border-border px-8 py-6 text-left">
          <DrawerTitle className="text-[28px] font-black text-foreground">{title}</DrawerTitle>
          <DrawerDescription className="text-sm leading-6 text-muted-foreground">
            {description}
          </DrawerDescription>
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto px-8 py-6">
          <TaskEditorForm onChange={onValuesChange} values={values} />
        </div>

        <DrawerFooter className="border-t border-border px-8 py-5">
          <div className="grid grid-cols-2 gap-3">
            <AppButton onClick={onSubmit}>{mode === "edit" ? "保存任务" : "创建任务"}</AppButton>
            <AppButton onClick={onCancel} variant="ghost">取消</AppButton>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
```

- [ ] **Step 2: If the default drawer width clamps at `sm:max-w-sm`, remove that right-side max-width**

In `src/components/ui/drawer.tsx`, change the `DrawerContent` right-side class segment from:

```ts
"... data-[vaul-drawer-direction=right]:sm:max-w-sm"
```

to:

```ts
"..."
```

so the custom `w-[min(760px,72vw)]` from `TaskEditorDrawer` can control the desktop width.

- [ ] **Step 3: Run build to verify drawer shell compiles**

Run: `pnpm build`
Expected: build succeeds; no invalid class or type errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/task/TaskEditorDrawer.tsx src/components/ui/drawer.tsx
git commit -m "feat: add task editor drawer"
```

### Task 4: Extract the task toolbar and right-side overview panel

**Files:**
- Create: `src/components/task/TaskToolbar.tsx`
- Create: `src/components/task/TaskOverviewPanel.tsx`
- Modify: `src/pages/TaskManagement.tsx`
- Test: covered later through page integration

- [ ] **Step 1: Create the toolbar component**

```tsx
import { Filter, Plus } from "lucide-react";

import { AppButton } from "@/components/common/AppButton";
import { SegmentedTabs } from "@/components/common/SegmentedTabs";
import { taskFilterOptions, type TaskFilterValue } from "@/components/task/task-management.constants";

type TaskToolbarProps = {
  filter: TaskFilterValue;
  onFilterChange: (value: TaskFilterValue) => void;
  onCreateTask: () => void;
};

export function TaskToolbar({ filter, onFilterChange, onCreateTask }: TaskToolbarProps) {
  return (
    <div className="flex items-center justify-between gap-4 max-md:flex-col max-md:items-stretch">
      <SegmentedTabs value={filter} options={taskFilterOptions} onChange={onFilterChange} />
      <div className="flex items-center gap-3 self-end max-md:self-stretch">
        <AppButton icon={<Filter aria-hidden="true" className="size-4" />} size="sm" variant="ghost">
          筛选
        </AppButton>
        <AppButton icon={<Plus aria-hidden="true" className="size-5" />} onClick={onCreateTask}>
          新建任务
        </AppButton>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create the overview panel component**

```tsx
import { AppCard } from "@/components/common/AppCard";
import illusFocus from "@/assets/illustrations/illus-focus-session.png";

type TaskOverviewPanelProps = {
  totalTasks: number;
  completedCount: number;
  totalEstimatedPomodoros: number;
  totalCompletedPomodoros: number;
};

export function TaskOverviewPanel({
  totalTasks,
  completedCount,
  totalEstimatedPomodoros,
  totalCompletedPomodoros,
}: TaskOverviewPanelProps) {
  const todayRemaining = totalTasks - completedCount;
  const completionRate = totalTasks ? Math.round((completedCount / totalTasks) * 100) : 0;

  return (
    <aside className="flex flex-col gap-5">
      <AppCard className="flex flex-col gap-4">
        <h2 className="text-xl font-bold">任务概览</h2>
        <div className="grid gap-3">
          <SummaryRow label="今日任务完成率" value={`${completionRate}%`} />
          <SummaryRow label="今日预计番茄数" value={`${totalEstimatedPomodoros} 个`} />
          <SummaryRow label="已完成番茄数" value={`${totalCompletedPomodoros} 个`} />
          <SummaryRow label="剩余任务数" value={`${todayRemaining} 个`} />
        </div>
      </AppCard>
      <AppCard className="overflow-hidden p-0" tone="hero">
        <div className="p-6">
          <h2 className="text-xl font-black">把今天的小目标安排好吧</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">完成一颗番茄，就靠近目标一点。</p>
        </div>
        <img alt="" className="w-full object-contain" src={illusFocus} />
      </AppCard>
    </aside>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-[var(--radius-lg)] border border-border bg-background p-4">
      <span className="text-sm text-muted-foreground">{label}</span>
      <strong className="text-xl text-primary">{value}</strong>
    </div>
  );
}
```

- [ ] **Step 3: Replace the inline toolbar/sidebar in `TaskManagement` with the new components**

Update imports and use:

```tsx
import { TaskEditorDrawer } from "@/components/task/TaskEditorDrawer";
import { TaskOverviewPanel } from "@/components/task/TaskOverviewPanel";
import { TaskToolbar } from "@/components/task/TaskToolbar";
```

and render:

```tsx
<TaskToolbar filter={filter} onCreateTask={openCreateDrawer} onFilterChange={setFilter} />
```

plus:

```tsx
<TaskOverviewPanel
  completedCount={completedCount}
  totalCompletedPomodoros={tasks.reduce((sum, task) => sum + task.completedPomodoros, 0)}
  totalEstimatedPomodoros={tasks.reduce((sum, task) => sum + task.estimatedPomodoros, 0)}
  totalTasks={tasks.length}
/>
```

- [ ] **Step 4: Run build to verify the extraction is clean**

Run: `pnpm build`
Expected: build succeeds and `TaskManagement` no longer contains inline summary-card duplication.

- [ ] **Step 5: Commit**

```bash
git add src/components/task/TaskToolbar.tsx src/components/task/TaskOverviewPanel.tsx src/pages/TaskManagement.tsx
git commit -m "refactor: split task toolbar and overview panel"
```

### Task 5: Convert `TaskManagement` to drawer-driven create and edit flow

**Files:**
- Modify: `src/pages/TaskManagement.tsx`
- Test: `src/pages/TaskManagement.test.tsx`

- [ ] **Step 1: Add drawer state and editor helpers to the page**

In `TaskManagement`, replace the individual form fields with a single editor state:

```ts
const [editorOpen, setEditorOpen] = useState(false);
const [editorMode, setEditorMode] = useState<TaskEditorMode>("create");
const [editorValues, setEditorValues] = useState<TaskEditorValues>(DEFAULT_TASK_EDITOR_VALUES);
const [editingTask, setEditingTask] = useState<Task | null>(null);
```

Add helpers:

```ts
function resetEditor() {
  setEditorMode("create");
  setEditingTask(null);
  setEditorValues(DEFAULT_TASK_EDITOR_VALUES);
}

function openCreateDrawer() {
  resetEditor();
  setEditorOpen(true);
}

function openEditDrawer(task: Task) {
  setEditorMode("edit");
  setEditingTask(task);
  setEditorValues({
    title: task.title,
    description: task.description ?? "",
    estimatedPomodoros: task.estimatedPomodoros,
    priority: task.priority,
  });
  setEditorOpen(true);
}

function closeEditor() {
  setEditorOpen(false);
  resetEditor();
}
```

- [ ] **Step 2: Rewrite submit logic to use editor values**

```ts
function submitTask() {
  if (!editorValues.title.trim()) return;

  if (editingTask) {
    updateTask(editingTask.id, editorValues);
  } else {
    createTask(editorValues);
  }

  closeEditor();
}
```

- [ ] **Step 3: Remove the top inline form card and render the drawer**

Delete the `AppCard` containing the current `任务名称 / 预计番茄数 / 优先级 / 描述` form.

Then mount:

```tsx
<TaskEditorDrawer
  mode={editorMode}
  onCancel={closeEditor}
  onOpenChange={(open) => {
    setEditorOpen(open);
    if (!open) resetEditor();
  }}
  onSubmit={submitTask}
  onValuesChange={setEditorValues}
  open={editorOpen}
  values={editorValues}
/>
```

and update task-card edit binding:

```tsx
onEdit={openEditDrawer}
```

- [ ] **Step 4: Rewrite tests to target the drawer flow**

Replace `src/pages/TaskManagement.test.tsx` with at least these tests:

```tsx
it("opens the task drawer and creates a task", () => {
  renderTaskManagement();

  fireEvent.click(screen.getByRole("button", { name: "新建任务" }));
  fireEvent.change(screen.getByPlaceholderText("例如：阅读《高效能人士的七个习惯》"), {
    target: { value: "实现番茄钟计时功能" },
  });
  fireEvent.click(screen.getByRole("button", { name: "创建任务" }));

  expect(screen.getByText("实现番茄钟计时功能")).toBeInTheDocument();
});

it("opens the task drawer in edit mode from a task card", () => {
  useTaskStore.getState().createTask({
    title: "写日报",
    priority: "important",
    estimatedPomodoros: 2,
  });

  renderTaskManagement();

  fireEvent.click(screen.getByRole("button", { name: "编辑任务：写日报" }));

  expect(screen.getByText("编辑任务")).toBeInTheDocument();
  expect(screen.getByDisplayValue("写日报")).toBeInTheDocument();
});
```

Keep the existing start-focus navigation test.

- [ ] **Step 5: Run the focused tests**

Run: `pnpm test -- src/pages/TaskManagement.test.tsx`
Expected: all task-management tests pass; no old assertions looking for the inline form remain.

- [ ] **Step 6: Commit**

```bash
git add src/pages/TaskManagement.tsx src/pages/TaskManagement.test.tsx
git commit -m "feat: move task creation into drawer workflow"
```

### Task 6: Polish the page layout so the list becomes first-class

**Files:**
- Modify: `src/pages/TaskManagement.tsx`
- Test: visual/manual validation only

- [ ] **Step 1: Tighten the left-column vertical order**

Ensure the left column order is:

```tsx
<div className="flex flex-col gap-5">
  <TaskToolbar ... />
  {filteredTasks.length === 0 ? <EmptyState ... /> : <TaskList />}
</div>
```

This means the page opens directly into controls plus list, with no large creation card above the list.

- [ ] **Step 2: Keep page header lightweight**

Do not reintroduce a top-right `PageLayout.action`. The task-page primary action should live in `TaskToolbar`, because it belongs to the list context rather than the app shell.

- [ ] **Step 3: Run build and visually check the route**

Run: `pnpm build`
Expected: build succeeds.

Then run the app and confirm manually:
- `/tasks` opens with list-first layout
- `新建任务` opens a right-side drawer
- edit action opens same drawer with task data prefilled
- closing drawer does not lose the task list context

- [ ] **Step 4: Commit**

```bash
git add src/pages/TaskManagement.tsx
git commit -m "style: promote task list over inline form"
```

---

## Self-Review

### Spec coverage
- Replace inline creation surface with drawer: covered by Tasks 3 and 5.
- Keep task list as primary page content: covered by Tasks 4, 5, and 6.
- Keep create and edit unified: covered by Task 5.
- Avoid introducing global floating create button: enforced in Task 6 by keeping create action inside `TaskToolbar`.

### Placeholder scan
- No `TODO`, `TBD`, or “implement later” placeholders remain.
- Every task names exact files and includes exact code/commands.

### Type consistency
- `TaskFilterValue`, `TaskEditorMode`, and `TaskEditorValues` are defined once and reused consistently.
- Drawer callbacks (`onSubmit`, `onCancel`, `onValuesChange`, `onOpenChange`) are aligned across tasks.

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-05-14-task-management-drawer-refactor.md`. Two execution options:

**1. Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

**Which approach?**
