下面是你这套 **可爱风番茄时钟桌面端 / PC Web 产品设计规范完整总结**。
这份可以直接作为后续开发时的 **Design Guideline / UI Spec** 使用。

---

# 可爱风番茄时钟设计规范总结

## 1. 产品定位

项目名称可以暂定为：

```txt
Cute Tomato Focus / 番茄时钟
```

产品类型：

```txt
Tauri 桌面端番茄时钟效率工具
```

核心功能：

```txt
专注计时
任务管理
数据统计
个性化设置
桌面通知
弹窗反馈
系统托盘
```

产品气质：

```txt
可爱
温暖
治愈
圆润
轻效率工具
桌面端陪伴感
番茄拟人化
低压力专注
```

整体设计目标不是做成儿童 App，而是：

```txt
可爱但不幼稚
治愈但不杂乱
轻松但仍然像真实效率工具
适合桌面端长期使用
```

---

# 2. 核心视觉方向

## 2.1 风格关键词

```txt
可爱风
温暖治愈
圆润卡片化
柔和阴影
轻 2.5D 插画
番茄吉祥物
低饱和辅助色
奶油白背景
桌面端工具产品
```

## 2.2 推荐视觉风格

```txt
轻 2.5D 可爱插画 + 卡片化 PC Web UI + 柔和番茄红品牌色
```

具体表现：

```txt
页面背景使用奶油白
主体内容使用白色大圆角卡片
核心操作使用番茄红
辅助信息使用奶油橙、薄荷绿、暖黄色
图标采用圆润线性风格
吉祥物采用圆润番茄小助手
插画保持透明背景、可复用
页面信息结构清晰，不能像海报
```

---

# 3. 色彩规范

## 3.1 主品牌色

| 名称           | 色值        | 用途                |
| ------------ | --------- | ----------------- |
| Tomato Red   | `#FF6B6B` | 主按钮、当前状态、品牌强调、进度环 |
| Tomato Deep  | `#F25555` | Hover、强强调、按钮按下态   |
| Tomato Light | `#FFE1DD` | 浅色标签、浅色背景、选中态底色   |
| Tomato Soft  | `#FFF0EE` | 当前任务高亮、浅番茄卡片背景    |

---

## 3.2 辅助色

| 名称           | 色值        | 用途             |
| ------------ | --------- | -------------- |
| Cream Orange | `#FFD6A5` | 次级强调、插画高光、温暖装饰 |
| Warm Yellow  | `#FFE89A` | 成就、奖励、星星、徽章    |
| Mint Green   | `#BEECC4` | 成功状态、休息状态、完成状态 |
| Sky Blue     | `#BFE9FF` | 信息类图表辅助色       |
| Lavender     | `#DCCBFF` | 成就徽章、少量装饰点缀    |

---

## 3.3 背景与中性色

| 名称              | 色值        | 用途          |
| --------------- | --------- | ----------- |
| Page Background | `#FFF8F3` | 页面主背景       |
| Card White      | `#FFFFFF` | 卡片、弹窗、输入框背景 |
| Soft Border     | `#F1E4DC` | 卡片边框、输入框描边  |
| Divider         | `#F6EDE8` | 分割线         |
| Text Primary    | `#3A2E2A` | 主标题、重要正文    |
| Text Secondary  | `#7B6F6A` | 次级正文        |
| Text Tertiary   | `#A99C96` | 辅助说明、弱提示    |
| Disabled        | `#D8CEC8` | 禁用态         |

---

## 3.4 功能色

| 状态      | 色值        | 用途      |
| ------- | --------- | ------- |
| Success | `#6BCB77` | 成功、已完成  |
| Warning | `#FFB84C` | 提醒、高优先级 |
| Danger  | `#FF7A7A` | 删除、清除数据 |
| Info    | `#7EC8E3` | 信息提示    |

---

## 3.5 色彩使用比例

建议整体比例：

```txt
奶油白背景：60%
白色卡片：25%
番茄红主色：10%
辅助装饰色：5%
```

重点原则：

```txt
不要大面积使用红色
番茄红只用于重点操作和状态强调
页面整体要轻、暖、干净
统计页和设置页装饰更克制
首页、弹窗可以更活泼
```

---

# 4. 字体规范

## 4.1 字体建议

| 场景    | 字体                                   |
| ----- | ------------------------------------ |
| 中文 UI | `Noto Sans SC` / `HarmonyOS Sans SC` |
| 英文 UI | `Inter`                              |
| 倒计时数字 | `Nunito` / `Baloo 2` / `Inter`       |

开发时如果想简单统一，可以先使用：

```css
font-family: Inter, "Noto Sans SC", "HarmonyOS Sans SC", sans-serif;
```

---

## 4.2 字号层级

| 层级      |          字号 |        字重 | 用途    |
| ------- | ----------: | --------: | ----- |
| Display | 64px - 72px |       700 | 倒计时数字 |
| H1      |        36px |       700 | 页面主标题 |
| H2      |        28px |       700 | 大模块标题 |
| H3      |        22px |       600 | 卡片标题  |
| Title   |        18px |       600 | 小模块标题 |
| Body    |        16px | 400 / 500 | 正文    |
| Small   |        14px |       400 | 辅助信息  |
| Caption |        12px |       400 | 标签、说明 |

---

## 4.3 文本颜色规则

```css
--text-primary: #3A2E2A;
--text-secondary: #7B6F6A;
--text-tertiary: #A99C96;
--text-inverse: #FFFFFF;
```

使用规则：

```txt
页面标题：Text Primary
正文内容：Text Secondary
说明文字：Text Tertiary
主按钮文字：White
危险操作文字：Danger
```

---

# 5. 圆角规范

可爱风项目的核心视觉之一是圆角。
整体要大圆角，但不能失控。

| 元素              |    圆角 |
| --------------- | ----: |
| 小组件             |  12px |
| 按钮 / 输入框        |  16px |
| 小卡片             |  20px |
| 普通卡片            |  24px |
| 大卡片 / Hero Card |  28px |
| 弹窗              |  32px |
| 胶囊标签            | 999px |

开发变量建议：

```css
--radius-sm: 12px;
--radius-md: 16px;
--radius-lg: 20px;
--radius-xl: 24px;
--radius-2xl: 28px;
--radius-modal: 32px;
--radius-pill: 999px;
```

---

# 6. 阴影规范

整体阴影要柔，不要硬，不要像传统后台系统。

## 6.1 阴影 Token

```css
--shadow-card: 0 8px 24px rgba(58, 46, 42, 0.06);
--shadow-card-hover: 0 12px 32px rgba(58, 46, 42, 0.10);
--shadow-button: 0 6px 16px rgba(255, 107, 107, 0.25);
--shadow-modal: 0 20px 60px rgba(58, 46, 42, 0.16);
```

## 6.2 使用规则

| 阴影                  | 用途       |
| ------------------- | -------- |
| `shadow-card`       | 普通卡片     |
| `shadow-card-hover` | 卡片 hover |
| `shadow-button`     | 主按钮      |
| `shadow-modal`      | 弹窗       |

---

# 7. 桌面端布局规范

## 7.1 页面基础尺寸

| 项目       |          规格 |
| -------- | ----------: |
| 设计稿尺寸    | 1920 × 1080 |
| 内容最大宽度   |      1440px |
| 页面左右安全边距 |        48px |
| 顶部导航高度   |        72px |
| 主内容顶部间距  |        32px |
| 卡片间距     |        24px |
| 页面背景     |   `#FFF8F3` |

---

## 7.2 页面结构

统一采用：

```txt
AppHeader
+
PageLayout
+
卡片式内容区域
```

基础结构：

```txt
AppShell
├── AppHeader
└── PageLayout
    ├── PageTitle
    ├── MainContent
    └── SidePanel
```

---

## 7.3 各页面布局基准

| 页面             | 推荐布局                        |
| -------------- | --------------------------- |
| Dashboard 首页   | Hero 区 + 数据概览 + 快捷计时 + 任务预览 |
| Focus 专注页      | 左侧大计时器 + 右侧任务 / 工具侧栏        |
| Tasks 任务页      | 左侧任务列表 + 右侧任务概览             |
| Statistics 统计页 | 上方指标卡 + 中部图表 + 右侧成就插画       |
| Settings 设置页   | 左侧设置表单 + 右侧账户 / 插画 / 预设     |
| Modal States   | 多个弹窗组件平铺展示                  |

---

# 8. 组件视觉规范

## 8.1 Button 按钮

### Primary Button

用途：

```txt
开始专注
保存设置
查看统计
开始休息
添加任务
```

样式：

```css
height: 48px;
padding: 0 24px;
border-radius: 16px;
background: #FF6B6B;
color: #FFFFFF;
font-size: 16px;
font-weight: 600;
box-shadow: 0 6px 16px rgba(255, 107, 107, 0.25);
```

状态：

| 状态       | 样式        |
| -------- | --------- |
| Default  | `#FF6B6B` |
| Hover    | `#F25555` |
| Active   | `#E94B4B` |
| Disabled | `#D8CEC8` |

---

### Secondary Button

用途：

```txt
查看任务
重置
继续专注
返回首页
恢复默认
```

样式：

```css
background: #FFF0EE;
color: #F25555;
border: 1px solid #FFE1DD;
```

---

### Ghost Button

用途：

```txt
取消
筛选
更多
查看全部
轻操作
```

样式：

```css
background: #FFFFFF;
color: #7B6F6A;
border: 1px solid #F1E4DC;
```

---

### Danger Button

用途：

```txt
删除任务
清除数据
确认清除
```

样式建议：

```css
background: #FF7A7A;
color: #FFFFFF;
```

危险操作不要过度可爱，要清晰、克制。

---

# 9. Card 卡片规范

## 9.1 普通卡片

```css
background: #FFFFFF;
border: 1px solid #F1E4DC;
border-radius: 24px;
padding: 24px;
box-shadow: 0 8px 24px rgba(58, 46, 42, 0.06);
```

适用：

```txt
统计卡片
任务卡片
设置卡片
图表卡片
侧栏卡片
```

---

## 9.2 强调卡片 / Hero Card

```css
background: linear-gradient(135deg, #FFF0EE 0%, #FFFFFF 100%);
border-radius: 28px;
padding: 32px;
```

适用：

```txt
首页 Hero
主计时器区域
设置页右侧插画卡
成就展示卡
```

---

# 10. Input 输入框规范

```css
height: 48px;
border-radius: 16px;
border: 1px solid #F1E4DC;
background: #FFFFFF;
padding: 0 16px;
font-size: 16px;
color: #3A2E2A;
```

Focus 状态：

```css
border-color: #FF6B6B;
box-shadow: 0 0 0 4px rgba(255, 107, 107, 0.12);
```

适用：

```txt
任务名称输入
搜索框
设置输入框
确认输入框
```

---

# 11. Tag / Badge 标签规范

## 11.1 状态标签

| 类型   | 背景        | 文字        |
| ---- | --------- | --------- |
| 专注中  | `#FFF0EE` | `#F25555` |
| 休息中  | `#EAF9ED` | `#4FAE5D` |
| 已完成  | `#EAF9ED` | `#4FAE5D` |
| 待开始  | `#F7F1ED` | `#7B6F6A` |
| 高优先级 | `#FFF3DF` | `#E99528` |
| 危险   | `#FFF0EE` | `#FF7A7A` |

基础样式：

```css
height: 28px;
padding: 0 12px;
border-radius: 999px;
font-size: 13px;
font-weight: 500;
```

---

# 12. Tabs / SegmentedTabs 规范

适用：

```txt
专注 / 短休息 / 长休息
全部 / 今日 / 进行中 / 已完成
今日 / 本周 / 本月 / 自定义
```

样式：

```txt
胶囊型
大圆角
当前项浅番茄红背景
当前项番茄红文字
非当前项白色或透明背景
```

建议高度：

```txt
36px - 40px
```

---

# 13. Switch 开关规范

适用：

```txt
桌面通知
声音提醒
自动开始
自动记录
窗口置顶
最小化到托盘
```

视觉规则：

```txt
开启：番茄红或薄荷绿
关闭：浅灰色
圆润滑块
切换动作轻柔
```

---

# 14. Slider 滑块规范

适用：

```txt
音量调节
专注时长
休息时长
```

视觉规则：

```txt
轨道浅色
已选部分番茄红
圆形滑块
整体高度轻量
```

---

# 15. TimerPanel 计时器规范

这是产品核心组件。

## 15.1 结构

```txt
TimerPanel
├── 当前状态标签
├── 当前任务标题
├── 圆形进度环
├── 倒计时数字
├── 模式切换 Tabs
├── 操作按钮
└── 专注吉祥物
```

## 15.2 视觉规则

| 项目    | 规格            |
| ----- | ------------- |
| 卡片圆角  | 32px          |
| 卡片内边距 | 40px          |
| 倒计时字号 | 64px - 72px   |
| 进度环尺寸 | 280px - 340px |
| 进度环颜色 | `#FF6B6B`     |
| 背景    | 白色 / 浅番茄渐变    |

重点：

```txt
25:00 必须是页面最强视觉焦点
按钮要清晰
吉祥物不能遮挡倒计时
装饰要克制，不能影响专注
```

---

# 16. TaskCard 任务卡片规范

## 16.1 结构

```txt
TaskCard
├── checkbox
├── 任务标题
├── 任务描述
├── 优先级标签
├── 预估番茄数
├── 已完成番茄数
├── 状态标签
├── 开始专注按钮
├── 编辑按钮
├── 删除按钮
└── 更多按钮
```

## 16.2 普通任务卡片

```css
background: #FFFFFF;
border-radius: 20px;
padding: 18px 20px;
border: 1px solid #F1E4DC;
```

Hover：

```css
box-shadow: 0 8px 24px rgba(58, 46, 42, 0.08);
transform: translateY(-2px);
```

## 16.3 当前专注任务

```css
background: #FFF0EE;
border: 1px solid #FF6B6B;
```

带标签：

```txt
当前专注
专注中
```

## 16.4 已完成任务

```txt
使用浅绿色状态
checkbox 使用绿色勾选
文字可轻微弱化
保留历史信息
```

---

# 17. StatsCard 统计卡片规范

适用：

```txt
今日专注时长
完成番茄数
完成任务数
连续打卡天数
任务完成率
```

结构：

```txt
图标
标题
大号数字
单位
变化趋势
```

规则：

```txt
数字要突出
图标作为辅助
变化趋势使用绿色 / 红色
不要像企业后台报表
```

---

# 18. 图表规范

适用页面：

```txt
Dashboard 首页
Statistics 数据统计页
```

图表类型：

```txt
折线图
面积图
柱状图
环形图
横向条形图
```

视觉规则：

```txt
线条圆润
颜色柔和
使用番茄红作为主趋势色
使用薄荷绿表示完成 / 成功
使用暖黄色表示成就 / 高效
减少网格线
不要高饱和撞色
不要复杂后台化
```

推荐图表库：

```txt
Recharts
```

---

# 19. Modal 弹窗规范

## 19.1 弹窗尺寸

| 类型   |    宽度 |
| ---- | ----: |
| 小弹窗  | 420px |
| 标准弹窗 | 520px |
| 插画弹窗 | 600px |

## 19.2 弹窗样式

```css
background: #FFFFFF;
border-radius: 32px;
padding: 32px 40px;
box-shadow: 0 20px 60px rgba(58, 46, 42, 0.16);
```

## 19.3 内容结构

```txt
Modal
├── 插画 / 图标
├── 标题
├── 说明文案
├── 状态信息
└── 按钮区
```

## 19.4 按钮规则

```txt
成功类：主按钮番茄红，次按钮白底
休息类：可用薄荷绿辅助
奖励类：暖黄色 + 番茄红
危险类：危险按钮柔和红，次按钮取消
```

## 19.5 弹窗类型

```txt
FocusCompleteModal：专注完成
ShortBreakModal：短休息开始
LongBreakRewardModal：长休息奖励
TaskCompleteModal：今日任务完成
DeleteTaskConfirmModal：删除任务确认
ClearDataConfirmModal：清除数据确认
AchievementUnlockedModal：成就解锁
```

---

# 20. 图标规范

## 20.1 风格方向

```txt
圆润线性图标
描边粗细一致
线帽圆角
转角圆角
简洁清晰
少量番茄红点缀
不做复杂 3D
不做真实质感
```

## 20.2 尺寸

| 场景   |      尺寸 |
| ---- | ------: |
| 常规图标 | 24 × 24 |
| 大图标  | 32 × 32 |
| 小图标  | 16 × 16 |
| 描边宽度 |     2px |

## 20.3 颜色

```txt
默认：#7B6F6A
激活：#FF6B6B
成功：#6BCB77
警告：#FFB84C
危险：#FF7A7A
```

---

# 21. 吉祥物规范

## 21.1 角色设定

角色名可以是：

```txt
番茄小助手
```

特征：

```txt
圆润番茄身体
顶部小叶子
简单小手小脚
大眼睛
友好表情
微立体光影
柔和高光
可爱但不幼稚
```

## 21.2 吉祥物状态

| 状态           | 用途      |
| ------------ | ------- |
| Happy 开心番茄   | 首页、欢迎区  |
| Focus 专注番茄   | 专注工作台   |
| Rest 休息番茄    | 休息弹窗    |
| Success 完成番茄 | 完成弹窗、成就 |
| Sleepy 困困番茄  | 空状态     |
| Cheer 加油番茄   | 成就、鼓励   |

## 21.3 使用规则

```txt
作为品牌陪伴，不要抢主功能信息
透明背景
可独立复用
统一光影和比例
避免每个页面生成不同长相
不要加入大段文字
不要复杂背景
```

---

# 22. 插画规范

## 22.1 插画风格

```txt
轻 2.5D
圆润
柔和渐变
简单场景
主体清晰
透明背景优先
```

## 22.2 核心插画

| 插画                    | 用途      |
| --------------------- | ------- |
| `illus-hero-home`     | 首页 Hero |
| `illus-focus-session` | 专注页     |
| `illus-break-time`    | 休息弹窗    |
| `illus-task-success`  | 完成弹窗    |
| `illus-stats-growth`  | 统计页     |

## 22.3 空状态插画

| 插画                   | 用途    |
| -------------------- | ----- |
| `illus-empty-task`   | 暂无任务  |
| `illus-empty-stats`  | 暂无统计  |
| `illus-empty-focus`  | 未开始专注 |
| `illus-empty-search` | 搜索无结果 |

使用规则：

```txt
情绪友好
不要表达失败
不要让用户焦虑
主视觉清晰
适合 EmptyState 组件
```

---

# 23. 背景装饰规范

## 23.1 装饰元素

| 元素                   | 用途            |
| -------------------- | ------------- |
| `decor-tomato-slice` | 页面角落、卡片边缘     |
| `decor-leaf-small`   | 按钮、卡片、空状态点缀   |
| `decor-star-soft`    | 完成、奖励、成就      |
| `decor-cloud-round`  | 休息、空状态        |
| `decor-bubble-soft`  | 页面背景 pattern  |
| `decor-line-soft`    | Hero、卡片背景、过渡区 |

## 23.2 使用规则

```txt
每个页面最多 3 - 5 个明显装饰元素
首页和弹窗可以稍活泼
统计页、设置页要更克制
装饰不能影响阅读
装饰不能喧宾夺主
```

---

# 24. 页面级规范总结

## 24.1 Dashboard 首页

重点：

```txt
欢迎用户
展示今日专注概览
提供开始专注入口
展示今日任务预览
展示本周趋势
```

组件：

```txt
HomeHero
TodayOverview
QuickTimerCard
TodayTaskPreview
WeeklyTrendMiniChart
```

---

## 24.2 Focus 专注工作台

重点：

```txt
倒计时最大
操作按钮清晰
当前任务明确
右侧任务列表辅助
页面更安静
```

组件：

```txt
TimerPanel
ProgressRing
TimerControls
ModeTabs
TaskMiniList
FocusTools
```

---

## 24.3 Tasks 任务管理页

重点：

```txt
任务增删改查
筛选任务
设置番茄数
当前专注任务高亮
右侧任务概览
```

组件：

```txt
TaskInputPanel
TaskFilterTabs
TaskCard
TaskSummarySidebar
```

---

## 24.4 Statistics 数据统计页

重点：

```txt
专注成果
成长反馈
趋势图
任务完成率
高效时段
成就徽章
```

组件：

```txt
StatsOverview
FocusTrendChart
TaskCompletionCard
FocusTimeDistribution
AchievementPanel
```

---

## 24.5 Settings 设置页

重点：

```txt
专注时长设置
休息设置
提醒设置
声音设置
自动化设置
主题外观
数据与账号
```

组件：

```txt
TimerSettingCard
NotificationSettingCard
SoundSettingCard
AutoFocusSettingCard
ThemeSettingCard
AccountSettingCard
```

---

## 24.6 Modal 状态合集

重点：

```txt
专注完成
休息开始
长休息奖励
今日任务完成
删除确认
清除数据确认
成就解锁
```

组件：

```txt
FocusCompleteModal
ShortBreakModal
LongBreakRewardModal
TaskCompleteModal
DeleteTaskConfirmModal
ClearDataConfirmModal
AchievementUnlockedModal
```

---

# 25. 前端 Design Tokens 汇总

开发时可以先放到：

```txt
src/styles/tokens.css
```

内容：

```css
:root {
  /* Brand */
  --color-tomato-red: #FF6B6B;
  --color-tomato-deep: #F25555;
  --color-tomato-light: #FFE1DD;
  --color-tomato-soft: #FFF0EE;

  /* Accent */
  --color-cream-orange: #FFD6A5;
  --color-warm-yellow: #FFE89A;
  --color-mint-green: #BEECC4;
  --color-sky-blue: #BFE9FF;
  --color-lavender: #DCCBFF;

  /* Neutral */
  --color-page-bg: #FFF8F3;
  --color-card-bg: #FFFFFF;
  --color-border: #F1E4DC;
  --color-divider: #F6EDE8;

  /* Text */
  --color-text-primary: #3A2E2A;
  --color-text-secondary: #7B6F6A;
  --color-text-tertiary: #A99C96;
  --color-text-inverse: #FFFFFF;

  /* Status */
  --color-success: #6BCB77;
  --color-warning: #FFB84C;
  --color-danger: #FF7A7A;
  --color-info: #7EC8E3;

  /* Radius */
  --radius-sm: 12px;
  --radius-md: 16px;
  --radius-lg: 20px;
  --radius-xl: 24px;
  --radius-2xl: 28px;
  --radius-modal: 32px;
  --radius-pill: 999px;

  /* Shadow */
  --shadow-card: 0 8px 24px rgba(58, 46, 42, 0.06);
  --shadow-card-hover: 0 12px 32px rgba(58, 46, 42, 0.10);
  --shadow-button: 0 6px 16px rgba(255, 107, 107, 0.25);
  --shadow-modal: 0 20px 60px rgba(58, 46, 42, 0.16);

  /* Layout */
  --layout-max-width: 1440px;
  --header-height: 72px;
  --page-padding-x: 48px;
  --page-padding-y: 32px;
  --card-gap: 24px;
}
```

---

# 26. 开发落地注意事项

## 26.1 不要完全照图写死

设计稿是视觉参考，开发时要组件化：

```txt
不要把每页写成一整块
不要把颜色写死在每个组件里
不要把图标当作大图切
不要把弹窗写成多个重复组件
```

---

## 26.2 优先抽象这些组件

```txt
Button
Card
Tag
Modal
Input
Switch
Slider
SegmentedTabs
ProgressRing
EmptyState
StatsCard
TaskCard
SettingCard
```

---

## 26.3 桌面端额外注意

因为你要做 Tauri 桌面端，需要考虑：

```txt
窗口尺寸适配
最小宽度
窗口置顶
桌面通知
托盘菜单
本地存储
离线使用
快捷键操作
```

建议主窗口最小尺寸：

```txt
1280 × 800
```

最佳体验尺寸：

```txt
1440 × 900 以上
```

---

# 27. 最终设计规范一句话总结

```txt
这是一套以奶油白为背景、番茄红为品牌主色、白色圆角卡片为主体、轻 2.5D 番茄吉祥物为记忆点的桌面端番茄时钟设计系统，强调温暖、治愈、低压力和真实可开发的效率工具体验。
```

后续开发时只要保证：

```txt
颜色统一
圆角统一
阴影统一
卡片统一
按钮统一
图标统一
吉祥物统一
页面结构真实
```

这套设计就不会散。
