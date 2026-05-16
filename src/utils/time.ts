type RemainingInput = {
  totalSeconds: number;
  startedAt?: string;
  pausedAt?: string;
  now?: string | Date;
  pausedAccumulatedMs?: number;
};

export function minutesToSeconds(minutes: number): number {
  return Math.round(minutes * 60);
}

export function secondsToMinutes(seconds: number): number {
  return Math.round(seconds / 60);
}

export function formatSeconds(seconds: number): string {
  const safeSeconds = Math.max(0, Math.floor(seconds));
  const minutes = Math.floor(safeSeconds / 60);
  const remainder = safeSeconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(remainder).padStart(2, "0")}`;
}

export function calculateRemainingSeconds({
  totalSeconds,
  startedAt,
  pausedAt,
  now = new Date(),
  pausedAccumulatedMs = 0,
}: RemainingInput): number {
  if (!startedAt) {
    return totalSeconds;
  }

  const nowMs = typeof now === "string" ? Date.parse(now) : now.getTime();
  const effectiveNowMs = pausedAt ? Math.min(nowMs, Date.parse(pausedAt)) : nowMs;
  const startedMs = Date.parse(startedAt);
  const elapsedMs = Math.max(0, effectiveNowMs - startedMs - pausedAccumulatedMs);
  const elapsedSeconds = Math.floor(elapsedMs / 1000);

  return Math.max(0, totalSeconds - elapsedSeconds);
}

export function getModeLabel(mode: "focus" | "shortBreak" | "longBreak"): string {
  if (mode === "focus") return "专注";
  if (mode === "shortBreak") return "短休息";
  return "长休息";
}
