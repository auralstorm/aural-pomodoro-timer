export function formatMinutesLabel(minutes: number) {
  return `${minutes} 分钟`;
}

export function formatFocusHours(minutes: number) {
  if (minutes <= 0) {
    return "0h";
  }

  if (minutes < 60) {
    return `${minutes} 分钟`;
  }

  const hours = minutes / 60;
  const rounded = Number.isInteger(hours) ? String(hours) : hours.toFixed(1);
  return `${rounded}h`;
}
