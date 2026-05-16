import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type TagTone = "focus" | "rest" | "success" | "warning" | "neutral" | "danger";

type TagProps = HTMLAttributes<HTMLSpanElement> & {
  tone?: TagTone;
};

const toneClasses: Record<TagTone, string> = {
  focus: "bg-[var(--color-tomato-soft)] text-primary",
  rest: "bg-[color-mix(in_srgb,var(--color-success)_16%,white)] text-[var(--color-success)]",
  success: "bg-[color-mix(in_srgb,var(--color-success)_16%,white)] text-[var(--color-success)]",
  warning: "bg-[color-mix(in_srgb,var(--color-warning)_18%,white)] text-[var(--color-warning)]",
  neutral: "bg-muted text-muted-foreground",
  danger: "bg-[var(--color-tomato-soft)] text-destructive",
};

export function Tag({ className, tone = "neutral", ...props }: TagProps) {
  return (
    <span
      className={cn(
        "inline-flex min-h-7 items-center rounded-[var(--radius-pill)] px-3 text-sm font-semibold",
        toneClasses[tone],
        className,
      )}
      {...props}
    />
  );
}
