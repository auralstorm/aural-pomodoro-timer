import { AnimatedDigit } from "@/components/timer/AnimatedDigit";
import { formatSeconds } from "@/utils/time";

type AnimatedTimeDisplayProps = {
  seconds: number;
  className?: string;
};

export function AnimatedTimeDisplay({ seconds, className }: AnimatedTimeDisplayProps) {
  const [minutesTens, minutesOnes, secondsTens, secondsOnes] = formatSeconds(seconds).replace(":", "").split("");

  return (
    <span
      className={["inline-flex items-center justify-center tabular-nums leading-none", className]
        .filter(Boolean)
        .join(" ")}
      data-testid="animated-time-display"
    >
      <AnimatedDigit value={minutesTens} />
      <AnimatedDigit value={minutesOnes} />
      <span
        className="inline-flex h-[1em] w-[0.28em] items-center justify-center leading-none"
        data-testid="animated-time-colon"
      >
        :
      </span>
      <AnimatedDigit value={secondsTens} />
      <AnimatedDigit value={secondsOnes} />
    </span>
  );
}
