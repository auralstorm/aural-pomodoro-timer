export const AssistantEvent = {
  FocusStart: "assistant:focus-start",
  TimerPause: "assistant:timer-pause",
  TimerResume: "assistant:timer-resume",
  FocusComplete: "assistant:focus-complete",
  BreakStart: "assistant:break-start",
  BreakComplete: "assistant:break-complete",
  TaskComplete: "assistant:task-complete",
  AllTasksComplete: "assistant:all-tasks-complete",
  Achievement: "assistant:achievement",
  TimerReset: "assistant:timer-reset",
} as const;

export const AssistantCommand = {
  StartFocus: "command:start-focus",
  Pause: "command:pause",
  Reset: "command:reset",
  SwitchMode: "command:switch-mode",
  ShowStats: "command:show-stats",
  OpenSettings: "command:open-settings",
  HideAssistant: "command:hide-assistant",
} as const;

function pick(arr: string[]): string {
  return arr[Math.floor(Math.random() * arr.length)]!;
}

export const AssistantBubbleMessages: Record<string, () => string> = {
  [AssistantEvent.FocusStart]: () =>
    pick(["加油！专注时间开始啦~", "集中精力，你可以的！", "开始专注吧，我陪着你~"]),
  [AssistantEvent.TimerPause]: () =>
    pick(["暂停了，记得回来哦~", "休息一下？别忘了我在等你~", "去喝杯水吧~"]),
  [AssistantEvent.TimerResume]: () =>
    pick(["欢迎回来！继续加油~", "回来啦！一起冲~", "准备好了吗？出发！"]),
  [AssistantEvent.FocusComplete]: () =>
    pick(["太棒了！专注完成！", "辛苦了！又完成一个番茄~", "厉害呀，坚持住了！"]),
  [AssistantEvent.BreakStart]: () =>
    pick(["休息一下吧~", "放松放松，活动活动~", "去喝杯水、伸个懒腰吧~"]),
  [AssistantEvent.BreakComplete]: () =>
    pick(["休息结束，准备好了吗？", "该回来工作啦~", "充好电了，继续出发！"]),
  [AssistantEvent.TaskComplete]: () =>
    pick(["任务完成！你真厉害！", "搞定了！太棒了！", "又解决一个，好有成就感~"]),
  [AssistantEvent.AllTasksComplete]: () =>
    pick(["全部任务都完成了！今天超棒！", "大功告成！今天的你太强了！"]),
  [AssistantEvent.Achievement]: () =>
    pick(["哇！解锁了新成就！", "恭喜获得成就！继续加油~"]),
  [AssistantEvent.TimerReset]: () =>
    pick(["重新开始也没关系~", "调整一下再出发！", "没关系，重新来过~"]),
  tap: () =>
    pick(["嗨~有什么事吗？", "别戳我啦~", "在呢在呢~", "专心工作啦！", "今天也要加油哦~"]),
  headpat: () =>
    pick(["呜…别摸头啦！", "好舒服…再摸一下~", "头发会乱的！", "嘿嘿~"]),
  cheer: () =>
    pick(["你是最棒的！加油！", "冲冲冲！我相信你！", "今天也要元气满满！"]),
  celebrate: () =>
    pick(["撒花~ 🎉", "太棒啦！庆祝一下！", "耶！开心！🎊"]),
};
