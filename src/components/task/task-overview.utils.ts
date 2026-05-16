// 已迁移至 @/utils/time — 此文件仅保留 re-export 和本地工具
export { formatMinutesToChinese } from "@/utils/time";

export function clampPercent(value: number): number {
  return Math.min(100, Math.max(0, Math.round(value)));
}
