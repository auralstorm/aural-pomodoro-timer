/**
 * Tauri 事件 API 的平台安全封装。
 * 在浏览器开发/测试环境中优雅降级：emit 静默忽略，listen 返回空卸载函数。
 */
import {
  emit,
  listen,
  type EventCallback,
  type EventName,
  type Options,
  type UnlistenFn,
} from "@tauri-apps/api/event";

export async function safeEmit<T>(event: string, payload?: T): Promise<void> {
  try {
    await emit(event, payload);
  } catch {
    // 浏览器开发/测试环境不支持 Tauri 事件后端
  }
}

export async function safeListen<T>(
  event: EventName,
  handler: EventCallback<T>,
  options?: Options,
): Promise<UnlistenFn> {
  try {
    return await listen(event, handler, options);
  } catch {
    return () => {};
  }
}

export type { UnlistenFn };
