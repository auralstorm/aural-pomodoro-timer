下面是这套 **Tauri 桌面端番茄时钟项目开发规范总结**。
这份偏前端工程落地，可以作为你正式开发前的 **Development Guideline**。

---

# 一、项目技术栈规范

## 1.1 最终技术栈

```txt
桌面框架：Tauri 2
前端框架：React
构建工具：Vite
开发语言：TypeScript
样式方案：Tailwind CSS
组件基础：shadcn/ui
状态管理：Zustand
路由：React Router
图表：Recharts
动画：Framer Motion
图标：Lucide React
时间处理：dayjs
本地存储：localStorage 起步，后续可升级 IndexedDB / SQLite
```

## 1.2 项目定位

```txt
一款基于 Tauri + React + TypeScript 开发的桌面端番茄时钟效率工具，
支持专注计时、任务管理、数据统计、个性化设置、桌面通知、系统托盘和本地数据持久化。
```

---

# 二、开发阶段规划

建议不要一开始就把所有页面都做完，而是按核心业务闭环推进。

## P0：基础框架与计时核心

```txt
1. 项目基础配置
2. Tailwind / shadcn/ui / tokens.css
3. AppHeader / PageLayout / 基础组件
4. FocusWorkspace 页面静态还原
5. timerStore
6. usePomodoroTimer
7. 开始 / 暂停 / 重置 / 跳过
8. 专注完成弹窗
9. localStorage 持久化
```

## P1：任务闭环

```txt
1. TaskManagement 页面
2. taskStore
3. 任务新增 / 编辑 / 删除 / 完成
4. 当前任务绑定计时器
5. 完成一个番茄后更新任务进度
6. 生成 PomodoroSession 记录
```

## P2：页面完善

```txt
1. Dashboard 首页
2. Statistics 数据统计页
3. Settings 设置页
4. Modal 状态合集
5. EmptyState 状态
```

## P3：桌面端能力

```txt
1. Tauri 桌面通知
2. 系统托盘
3. 最小化到托盘
4. 窗口置顶
5. 全屏专注模式
6. 快捷键控制
7. 应用打包
```

---

# 三、目录结构规范

推荐目录：

```txt
tomato-focus-desktop/
├── src/
│   ├── assets/
│   │   ├── logo/
│   │   ├── mascot/
│   │   ├── icons/
│   │   ├── illustrations/
│   │   ├── empty/
│   │   └── decorations/
│   │
│   ├── components/
│   │   ├── layout/
│   │   ├── common/
│   │   ├── timer/
│   │   ├── task/
│   │   ├── stats/
│   │   ├── settings/
│   │   └── modal/
│   │
│   ├── pages/
│   │   ├── DashboardHome.tsx
│   │   ├── FocusWorkspace.tsx
│   │   ├── TaskManagement.tsx
│   │   ├── StatisticsDashboard.tsx
│   │   └── SettingsPage.tsx
│   │
│   ├── stores/
│   │   ├── timerStore.ts
│   │   ├── taskStore.ts
│   │   ├── settingsStore.ts
│   │   ├── statsStore.ts
│   │   └── modalStore.ts
│   │
│   ├── hooks/
│   │   ├── usePomodoroTimer.ts
│   │   ├── useTaskFilters.ts
│   │   ├── useStats.ts
│   │   ├── useSettings.ts
│   │   ├── useDesktopNotification.ts
│   │   └── useKeyboardShortcuts.ts
│   │
│   ├── types/
│   │   ├── task.ts
│   │   ├── timer.ts
│   │   ├── settings.ts
│   │   ├── stats.ts
│   │   ├── modal.ts
│   │   └── desktop.ts
│   │
│   ├── utils/
│   │   ├── time.ts
│   │   ├── stats.ts
│   │   ├── storage.ts
│   │   ├── task.ts
│   │   ├── id.ts
│   │   └── format.ts
│   │
│   ├── desktop/
│   │   ├── notification.ts
│   │   ├── tray.ts
│   │   ├── window.ts
│   │   ├── shortcut.ts
│   │   └── appLifecycle.ts
│   │
│   ├── router/
│   │   └── index.tsx
│   │
│   ├── styles/
│   │   ├── tokens.css
│   │   └── globals.css
│   │
│   ├── lib/
│   │   └── utils.ts
│   │
│   ├── App.tsx
│   └── main.tsx
│
├── src-tauri/
│   ├── capabilities/
│   ├── icons/
│   ├── src/
│   ├── tauri.conf.json
│   └── Cargo.toml
```

---

# 四、命名规范

## 4.1 文件命名

### React 组件

使用 PascalCase：

```txt
AppHeader.tsx
PageLayout.tsx
TimerPanel.tsx
TaskCard.tsx
StatsCard.tsx
SettingsPage.tsx
```

### Store / Hooks / Utils

使用 camelCase：

```txt
timerStore.ts
taskStore.ts
settingsStore.ts
usePomodoroTimer.ts
useTaskFilters.ts
storage.ts
time.ts
```

### 类型文件

使用模块名：

```txt
task.ts
timer.ts
settings.ts
stats.ts
modal.ts
```

---

## 4.2 组件命名

组件名必须表达职责：

```txt
好的命名：
TimerPanel
TimerControls
TaskInputPanel
TaskSummarySidebar
FocusTrendChart
ThemeSettingCard

不建议：
Box1
RightCard
TomatoPanel
ListItem
ContentCard
```

---

## 4.3 变量命名

状态变量尽量语义化：

```ts
const remainingSeconds = 1500
const currentTaskId = "task-001"
const isTimerRunning = true
const completedPomodoros = 3
```

不要写：

```ts
const time = 1500
const id = "task-001"
const flag = true
const count = 3
```

---

# 五、组件拆分规范

## 5.1 拆分原则

组件拆分遵循：

```txt
页面只负责布局和组合
业务组件负责业务展示
通用组件负责基础 UI
状态逻辑放 store / hooks
工具逻辑放 utils
```

不要把所有逻辑写在页面里。

---

## 5.2 页面组件规范

页面文件只做三件事：

```txt
1. 读取页面需要的状态
2. 组合业务组件
3. 处理页面级交互
```

示例结构：

```tsx
export function FocusWorkspace() {
  return (
    <PageLayout>
      <PageTitle title="专注工作台" subtitle="开始一轮番茄专注" />

      <div className="grid grid-cols-[1fr_380px] gap-6">
        <TimerPanel />
        <div className="space-y-6">
          <TaskMiniList />
          <FocusTools />
        </div>
      </div>
    </PageLayout>
  )
}
```

页面中不要写大量倒计时逻辑、任务筛选逻辑、统计计算逻辑。

---

## 5.3 通用组件规范

通用组件放在：

```txt
src/components/common/
```

常见组件：

```txt
Button
Card
Modal
Tag
Input
Switch
Slider
SegmentedTabs
EmptyState
TipBar
ProgressRing
Dropdown
```

通用组件应该：

```txt
不绑定具体业务
通过 props 控制内容
通过 variant 控制样式
不直接读取 Zustand store
```

---

## 5.4 业务组件规范

业务组件可以读取 store，也可以通过 props 接收数据。

例如：

```txt
timer/TimerPanel
task/TaskCard
stats/FocusTrendChart
settings/TimerSettingCard
modal/FocusCompleteModal
```

业务组件要避免过度通用化。比如 `TaskCard` 就是任务业务组件，不必强行做成万能列表卡片。

---

# 六、状态管理规范

## 6.1 Store 拆分

Zustand store 按业务域拆：

```txt
timerStore：计时器状态
taskStore：任务状态
settingsStore：设置状态
statsStore：专注记录和统计
modalStore：全局弹窗状态
appStore：桌面应用全局状态
```

不要把所有状态塞进一个 `useAppStore`。

---

## 6.2 timerStore 规范

```ts
export type TimerMode = "focus" | "shortBreak" | "longBreak"
export type TimerStatus = "idle" | "running" | "paused" | "completed"

export type TimerState = {
  mode: TimerMode
  status: TimerStatus
  remainingSeconds: number
  totalSeconds: number
  currentTaskId?: string
  completedPomodorosInCycle: number

  start: () => void
  pause: () => void
  reset: () => void
  skip: () => void
  switchMode: (mode: TimerMode) => void
  setCurrentTask: (taskId?: string) => void
}
```

计时器核心状态只放必要字段：

```txt
当前模式
当前状态
剩余秒数
总秒数
当前任务
当前周期完成番茄数
```

不要把 UI 状态、弹窗状态混进 timerStore。

---

## 6.3 taskStore 规范

```ts
export type TaskPriority = "normal" | "important" | "urgent"
export type TaskStatus = "pending" | "inProgress" | "completed"

export type Task = {
  id: string
  title: string
  description?: string
  priority: TaskPriority
  status: TaskStatus
  estimatedPomodoros: number
  completedPomodoros: number
  createdAt: string
  completedAt?: string
}
```

任务操作：

```ts
createTask(payload)
updateTask(taskId, payload)
deleteTask(taskId)
completeTask(taskId)
setTaskInProgress(taskId)
```

任务状态变更要统一从 store action 走，不要在组件里直接改数组。

---

## 6.4 settingsStore 规范

```ts
export type AppTheme = "cream" | "tomato" | "mint" | "darkFocus"

export type SettingsState = {
  focusMinutes: number
  shortBreakMinutes: number
  longBreakMinutes: number
  longBreakInterval: number

  notificationEnabled: boolean
  soundEnabled: boolean
  whiteNoiseEnabled: boolean
  autoStartNextRound: boolean
  autoStartBreak: boolean
  alwaysOnTop: boolean
  minimizeToTray: boolean

  theme: AppTheme

  updateSettings: (payload: Partial<SettingsState>) => void
  resetSettings: () => void
}
```

设置项要统一影响业务逻辑，比如：

```txt
focusMinutes 影响专注模式总时长
shortBreakMinutes 影响短休息
autoStartBreak 影响专注完成后的行为
notificationEnabled 控制桌面通知
alwaysOnTop 控制 Tauri 窗口置顶
```

---

## 6.5 modalStore 规范

```ts
export type ModalType =
  | "focusComplete"
  | "shortBreak"
  | "longBreakReward"
  | "taskComplete"
  | "deleteTaskConfirm"
  | "clearDataConfirm"
  | "achievementUnlocked"

export type ModalState = {
  activeModal: ModalType | null
  payload?: unknown
  openModal: (type: ModalType, payload?: unknown) => void
  closeModal: () => void
}
```

所有业务弹窗统一走：

```txt
modalStore.openModal(type, payload)
modalStore.closeModal()
```

不要在各个页面里各自维护 `isDeleteModalOpen`、`isCompleteModalOpen` 之类的状态。

---

# 七、倒计时逻辑规范

## 7.1 核心原则

倒计时逻辑不要写在组件 JSX 里，应该放在：

```txt
usePomodoroTimer.ts
timerStore.ts
```

推荐分工：

```txt
timerStore：保存状态和 action
usePomodoroTimer：处理 setInterval / 副作用 / 完成逻辑
```

---

## 7.2 倒计时状态流转

```txt
idle
↓ start
running
↓ pause
paused
↓ start
running
↓ remainingSeconds === 0
completed
↓ switchMode / reset
idle
```

---

## 7.3 模式切换规则

```txt
focus 专注结束：
- 记录一次 PomodoroSession
- 当前任务 completedPomodoros + 1
- 如果达到 longBreakInterval，进入 longBreak
- 否则进入 shortBreak
- 触发专注完成弹窗
- 触发桌面通知

shortBreak 结束：
- 提示回到专注
- 如果 autoStartNextRound 开启，自动进入 focus running
- 否则进入 focus idle

longBreak 结束：
- 重置 cycle 计数
- 回到 focus idle
```

---

## 7.4 计时器注意事项

桌面端要注意：

```txt
窗口失焦后计时仍然要准确
不要只依赖 setInterval 累减
可以记录 startedAt，用当前时间差修正 remainingSeconds
避免电脑休眠后时间不准
```

更稳的计算方式：

```txt
remainingSeconds = totalSeconds - elapsedSeconds
elapsedSeconds = now - startedAt - pausedDuration
```

V1 可以先用 `setInterval`，但后续最好升级成基于时间戳计算。

---

# 八、数据持久化规范

## 8.1 V1 存储方案

先用 localStorage：

```txt
tasks
settings
sessions
timerState
```

封装工具：

```ts
export function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

export function saveToStorage<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value))
}
```

---

## 8.2 存储 key 规范

```ts
export const STORAGE_KEYS = {
  TASKS: "tomato-focus:tasks",
  SETTINGS: "tomato-focus:settings",
  SESSIONS: "tomato-focus:sessions",
  TIMER: "tomato-focus:timer",
}
```

不要在不同文件随便写字符串 key。

---

## 8.3 后续升级

后面如果数据多，可以升级：

```txt
IndexedDB / Dexie
SQLite Tauri plugin
```

建议升级时机：

```txt
专注记录超过几千条
需要复杂查询
需要按日期筛选大量数据
需要导出和备份
```

---

# 九、类型定义规范

所有核心业务对象都要有类型：

```txt
Task
PomodoroSession
TimerMode
TimerStatus
SettingsState
StatsOverview
Achievement
ModalType
```

## 示例

```ts
export type PomodoroSession = {
  id: string
  taskId?: string
  mode: TimerMode
  startedAt: string
  endedAt: string
  durationMinutes: number
  completed: boolean
}
```

时间字段统一使用 ISO 字符串：

```txt
createdAt: string
updatedAt: string
startedAt: string
endedAt: string
```

不要有的地方用 Date，有的地方用 timestamp，有的地方用字符串。

---

# 十、样式开发规范

## 10.1 设计变量优先

颜色、圆角、阴影要尽量从 token 走。

```css
:root {
  --color-tomato-red: #FF6B6B;
  --color-page-bg: #FFF8F3;
  --color-card-bg: #FFFFFF;
  --radius-xl: 24px;
  --shadow-card: 0 8px 24px rgba(58, 46, 42, 0.06);
}
```

## 10.2 Tailwind 使用规范

推荐 Tailwind 做布局和快速样式：

```tsx
<div className="rounded-3xl bg-white p-6 shadow-[var(--shadow-card)]">
  ...
</div>
```

但颜色建议用自定义变量或 Tailwind theme 扩展，避免到处硬编码。

---

## 10.3 className 合并

统一使用 `cn`：

```ts
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

组件里：

```tsx
<div className={cn("rounded-3xl bg-white", className)} />
```

---

# 十一、组件 Props 规范

## 11.1 Props 要明确

```ts
type TaskCardProps = {
  task: Task
  isCurrent?: boolean
  onStartFocus: (taskId: string) => void
  onComplete: (taskId: string) => void
  onEdit: (taskId: string) => void
  onDelete: (taskId: string) => void
}
```

不要写：

```ts
type Props = {
  data: any
  onClick: any
}
```

---

## 11.2 组件内部不要偷偷改全局状态

通用组件不能直接调用 store。

比如 `Button` 不应该知道 timerStore。
业务组件可以调用 store，或者由页面传 action。

---

## 11.3 variant 枚举化

```ts
type ButtonVariant = "primary" | "secondary" | "ghost" | "danger"
type ButtonSize = "sm" | "md" | "lg"
```

不要通过很多 boolean 控制：

```tsx
<Button primary danger big red />
```

应该：

```tsx
<Button variant="danger" size="lg" />
```

---

# 十二、路由规范

桌面端仍然建议用 React Router。

```txt
/dashboard
/focus
/tasks
/statistics
/settings
```

路由文件：

```txt
src/router/index.tsx
```

建议：

```tsx
import { createBrowserRouter } from "react-router-dom"

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <DashboardHome /> },
      { path: "dashboard", element: <DashboardHome /> },
      { path: "focus", element: <FocusWorkspace /> },
      { path: "tasks", element: <TaskManagement /> },
      { path: "statistics", element: <StatisticsDashboard /> },
      { path: "settings", element: <SettingsPage /> },
    ],
  },
])
```

Tauri 桌面端一般不需要复杂嵌套路由。

---

# 十三、桌面端能力规范

## 13.1 桌面通知

通知触发场景：

```txt
专注完成
休息结束
长休息开始
任务完成
成就解锁
```

封装在：

```txt
src/desktop/notification.ts
```

前端业务不要直接到处调用 Tauri API，统一走封装方法。

```ts
export function notifyFocusComplete() {}
export function notifyBreakComplete() {}
```

---

## 13.2 系统托盘

托盘功能建议 P2 再做。

托盘菜单：

```txt
打开主窗口
开始 / 暂停
重置
今日专注时长
退出应用
```

封装：

```txt
src/desktop/tray.ts
```

---

## 13.3 窗口控制

封装：

```txt
src/desktop/window.ts
```

功能：

```txt
最小化
最大化
关闭
置顶
取消置顶
进入全屏专注
退出全屏专注
```

设置页中的 `alwaysOnTop` 需要调用这里的方法。

---

## 13.4 快捷键

快捷键建议：

```txt
Ctrl + Alt + Space：开始 / 暂停
Ctrl + Alt + R：重置
Ctrl + Alt + F：全屏专注
```

封装：

```txt
src/desktop/shortcut.ts
```

---

# 十四、统计计算规范

统计数据不要手写在页面里，要通过工具函数统一计算。

目录：

```txt
src/utils/stats.ts
```

建议函数：

```ts
export function calculateTodayStats(sessions: PomodoroSession[]) {}
export function calculateWeeklyTrend(sessions: PomodoroSession[]) {}
export function calculateTaskCompletionRate(tasks: Task[]) {}
export function calculateFocusTimeDistribution(sessions: PomodoroSession[]) {}
```

统计页只负责展示：

```tsx
const weeklyTrend = useStatsStore((state) => state.getWeeklyTrend())
return <FocusTrendChart data={weeklyTrend} />
```

---

# 十五、弹窗开发规范

## 15.1 全局弹窗渲染

放在：

```txt
src/components/modal/GlobalModalRenderer.tsx
```

示例：

```tsx
export function GlobalModalRenderer() {
  const { activeModal } = useModalStore()

  if (activeModal === "focusComplete") return <FocusCompleteModal />
  if (activeModal === "shortBreak") return <ShortBreakModal />
  if (activeModal === "longBreakReward") return <LongBreakRewardModal />
  if (activeModal === "deleteTaskConfirm") return <DeleteTaskConfirmModal />

  return null
}
```

`GlobalModalRenderer` 放在 `App.tsx` 里，保证任何页面都能打开弹窗。

---

## 15.2 弹窗按钮规则

成功类：

```txt
主按钮：番茄红
次按钮：白底描边
```

危险类：

```txt
危险按钮：柔和红
取消按钮：白底描边
```

休息类：

```txt
可以用薄荷绿作为辅助，但主操作仍可保持番茄红
```

---

# 十六、资源管理规范

## 16.1 素材目录

```txt
src/assets/
├── logo/
├── mascot/
├── icons/
├── illustrations/
├── empty/
└── decorations/
```

## 16.2 命名规范

```txt
logo-main-horizontal.png
logo-symbol-tomato.png

mascot-tomato-happy.png
mascot-tomato-focus.png
mascot-tomato-rest.png
mascot-tomato-success.png

illus-hero-home.png
illus-focus-session.png
illus-break-time.png
illus-task-success.png
illus-stats-growth.png

illus-empty-task.png
illus-empty-stats.png
illus-empty-focus.png
illus-empty-search.png

decor-tomato-slice.png
decor-leaf-small.png
decor-star-soft.png
decor-cloud-round.png
decor-bubble-soft.png
decor-line-soft.png
```

## 16.3 图标建议

如果是长期项目，图标最终建议用：

```txt
lucide-react + 自定义 SVG
```

不要长期依赖一整张图标合集切图。

---

# 十七、代码质量规范

## 17.1 禁止 any 滥用

可以临时用，但业务类型必须补齐。

不建议：

```ts
const task: any = {}
```

建议：

```ts
const task: Task = {}
```

---

## 17.2 函数单一职责

不要写一个巨大函数同时做：

```txt
更新计时器
更新任务
写 session
弹窗
通知
跳转页面
```

应该拆成：

```txt
completeFocusSession()
addPomodoroSession()
incrementTaskPomodoro()
openFocusCompleteModal()
notifyFocusComplete()
```

---

## 17.3 避免页面过胖

如果页面文件超过 300 行，就应该考虑拆组件。

---

## 17.4 常量集中管理

例如：

```ts
export const DEFAULT_SETTINGS = {
  focusMinutes: 25,
  shortBreakMinutes: 5,
  longBreakMinutes: 15,
  longBreakInterval: 4,
}
```

放在：

```txt
src/constants/settings.ts
```

不要在多个组件里重复写 `25`、`5`、`15`、`4`。

---

# 十八、开发顺序规范

最推荐顺序：

```txt
1. tokens.css / globals.css
2. lib/utils.ts
3. 基础组件：Button / Card / Tag / Modal / Input
4. AppHeader / PageLayout
5. timerStore
6. usePomodoroTimer
7. FocusWorkspace
8. 弹窗：FocusCompleteModal / ShortBreakModal
9. taskStore
10. TaskManagement
11. 当前任务绑定计时器
12. sessions 记录
13. DashboardHome
14. StatisticsDashboard
15. SettingsPage
16. Tauri notification
17. Tauri tray
18. window alwaysOnTop / fullscreen
19. 打包
```

重点：**先做 FocusWorkspace，不要先做首页。**

原因：

```txt
番茄时钟的核心是计时器
计时器跑通后，任务、统计、首页都能围绕它扩展
如果先做首页，容易变成只有 UI 没有核心逻辑
```

---

# 十九、最小可运行 MVP

第一版最小 MVP 只需要：

```txt
FocusWorkspace
TaskManagement
timerStore
taskStore
settingsStore
modalStore
localStorage
FocusCompleteModal
ShortBreakModal
```

MVP 功能：

```txt
添加任务
选择当前任务
开始专注
暂停专注
重置
完成专注后记录一个番茄
任务番茄数 +1
弹出完成弹窗
本地保存
```

Dashboard、统计页、设置页可以在核心跑通后补。

---

# 二十、桌面端 MVP

Tauri 桌面端 MVP 加这些：

```txt
应用窗口可运行
本地存储
桌面通知
打包安装
```

暂时可以不做：

```txt
托盘
快捷键
窗口置顶
开机自启动
SQLite
```

这些放到 P2 / P3。

---

# 二十一、开发验收标准

## 21.1 UI 验收

```txt
页面风格是否统一
颜色是否使用 token
圆角是否一致
按钮层级是否清楚
卡片间距是否一致
图标风格是否统一
页面是否适合桌面端
```

## 21.2 功能验收

```txt
计时器开始 / 暂停 / 重置正常
模式切换正常
专注完成能写入 session
当前任务能绑定计时
任务新增 / 编辑 / 删除 / 完成正常
设置能保存
统计能根据 session 计算
弹窗状态正确
```

## 21.3 桌面能力验收

```txt
Tauri 应用能正常启动
桌面通知能触发
窗口尺寸合理
打包成功
关闭 / 最小化行为符合预期
```

---

# 二十二、最终开发规范一句话总结

```txt
这个项目开发时要以“计时器业务闭环”为核心，以 React 组件化拆分 UI，以 Zustand 管理业务状态，以 tokens.css 保持设计统一，以 Tauri 封装桌面端能力，先跑通本地 MVP，再逐步增强通知、托盘、快捷键和数据统计。
```
