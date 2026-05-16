export function formatAchievementProgress(current: number, target: number, unit: string) {
  if (unit === "分钟") {
    return `${Math.floor(current / 60)} / ${Math.floor(target / 60)} 小时`;
  }

  return `${current} / ${target} ${unit}`;
}
