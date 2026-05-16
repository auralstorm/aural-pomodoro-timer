import { WebviewWindow } from "@tauri-apps/api/webviewWindow";
import { Window, getCurrentWindow, currentMonitor } from "@tauri-apps/api/window";

let minimizeToTrayUnlisten: (() => void) | undefined;
const ASSISTANT_WINDOW_LABEL = "assistant";
const MAIN_WINDOW_LABEL = "main";

export async function setWindowAlwaysOnTop(enabled: boolean): Promise<void> {
  try {
    await getCurrentWindow().setAlwaysOnTop(enabled);
  } catch {
    // Browser dev/test environments do not expose the Tauri window backend.
  }
}

export async function setMinimizeToTrayEnabled(enabled: boolean): Promise<void> {
  try {
    minimizeToTrayUnlisten?.();
    minimizeToTrayUnlisten = undefined;

    if (!enabled) {
      return;
    }

    const appWindow = getCurrentWindow();
    minimizeToTrayUnlisten = await appWindow.onCloseRequested(async (event) => {
      event.preventDefault();
      await appWindow.hide();
    });
  } catch {
    // Browser dev/test environments do not expose the Tauri window backend.
  }
}

export async function showMainWindow(): Promise<void> {
  try {
    const appWindow = (await Window.getByLabel(MAIN_WINDOW_LABEL)) ?? getCurrentWindow();
    await appWindow.show();
    await appWindow.unminimize();
    await appWindow.setFocus();
  } catch {
    // Browser dev/test environments do not expose the Tauri window backend.
  }
}

export async function setAssistantWindowEnabled(enabled: boolean): Promise<void> {
  try {
    const existingWindow = await WebviewWindow.getByLabel(ASSISTANT_WINDOW_LABEL);

    if (!enabled) {
      if (existingWindow) {
        await existingWindow.destroy();
      }
      return;
    }

    if (existingWindow) {
      await existingWindow.show();
      await existingWindow.setFocus();
      return;
    }

    // ===================== 核心：获取显示器信息并计算右下角坐标 =====================
    const WINDOW_WIDTH = 200;
    const WINDOW_HEIGHT = 480;
    // 1.使用正确的函数名 currentMonitor() 获取当前显示器信息
    const monitor = await currentMonitor();
    if (!monitor) {
      throw new Error("无法获取当前显示器信息");
    }

    const monitorPos = monitor.position;
    const monitorWorkSize = monitor.size; // 工作区（排除任务栏，不被遮挡）

    // 2. 计算右下角定位坐标
    const x = monitorPos.x + monitorWorkSize.width - WINDOW_WIDTH;
    const y = monitorPos.y + monitorWorkSize.height - WINDOW_HEIGHT;
    // ========================================================================

    const assistantWindow = new WebviewWindow(ASSISTANT_WINDOW_LABEL, {
      title: "番茄助手",
      url: "/#/assistant",

      width: WINDOW_WIDTH,
      height: WINDOW_HEIGHT,
      // 注入右下角坐标
      x: x,
      y: y,

      decorations: false,
      transparent: true,
      shadow: false,
      skipTaskbar: true,
      alwaysOnTop: true,
      visible: false,
      resizable: false,
    });

    assistantWindow.once("tauri://error", (error) => {
      console.error("Failed to create assistant window:", error);
    });
  } catch (error) {
    console.error("Failed to toggle assistant window:", error);
  }
}
