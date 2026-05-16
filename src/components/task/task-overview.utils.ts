export function formatMinutesToChinese(minutes: number): string {
  const safeMinutes = Math.max(0, Math.round(minutes));
  const hours = Math.floor(safeMinutes / 60);
  const restMinutes = safeMinutes % 60;

  if (hours > 0 && restMinutes > 0) {
    return `${hours} 小时 ${restMinutes} 分钟`;
  }

  if (hours > 0) {
    return `${hours} 小时`;
  }

  return `${restMinutes} 分钟`;
}

export function clampPercent(value: number): number {
  return Math.min(100, Math.max(0, Math.round(value)));
}
