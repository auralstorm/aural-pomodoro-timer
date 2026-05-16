import { cn } from "@/lib/utils";

type ProgressRingProps = {
  value: number;
  size?: number;
  strokeWidth?: number;
  children?: React.ReactNode;
  className?: string;
};

export function ProgressRing({
  value,
  size = 320,
  strokeWidth = 16,
  children,
  className,
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const normalized = Math.min(100, Math.max(0, value));
  const offset = circumference - (normalized / 100) * circumference;

  return (
    <div
      className={cn("relative grid place-items-center", className)}
      style={{ inlineSize: size, blockSize: size }}
    >
      <svg className="-rotate-90" height={size} width={size} aria-hidden="true">
        <circle
          cx={size / 2}
          cy={size / 2}
          fill="none"
          r={radius}
          stroke="var(--color-tomato-light)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          fill="none"
          r={radius}
          stroke="var(--color-tomato-red)"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          strokeWidth={strokeWidth}
          className="transition-[stroke-dashoffset] duration-500"
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">{children}</div>
    </div>
  );
}
