import {
  isPermissionGranted,
  requestPermission,
  sendNotification,
} from "@tauri-apps/plugin-notification";

type NotificationInput = {
  title: string;
  body: string;
};

type NotificationOptions = {
  enabled?: boolean;
};

async function showBrowserNotification({ title, body }: NotificationInput): Promise<void> {
  if (typeof Notification === "undefined") {
    return;
  }

  if (Notification.permission === "default") {
    await Notification.requestPermission();
  }

  if (Notification.permission === "granted") {
    new Notification(title, { body });
  }
}

async function showTauriNotification({ title, body }: NotificationInput): Promise<void> {
  let permissionGranted = await isPermissionGranted();

  if (!permissionGranted) {
    const permission = await requestPermission();
    permissionGranted = permission === "granted";
  }

  if (permissionGranted) {
    sendNotification({ title, body });
  }
}

async function showNotification(
  input: NotificationInput,
  { enabled = true }: NotificationOptions = {},
): Promise<void> {
  if (!enabled) {
    return;
  }

  try {
    await showTauriNotification(input);
  } catch {
    await showBrowserNotification(input);
  }
}

export function notifyFocusComplete(options?: NotificationOptions): Promise<void> {
  return showNotification({
    title: "专注完成啦",
    body: "一颗番茄已经记录，休息一下再继续。",
  }, options);
}

export function notifyBreakComplete(options?: NotificationOptions): Promise<void> {
  return showNotification({
    title: "休息结束",
    body: "准备回到下一轮专注。",
  }, options);
}
