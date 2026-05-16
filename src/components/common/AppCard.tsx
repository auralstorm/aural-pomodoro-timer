import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type AppCardProps = HTMLAttributes<HTMLDivElement> & {
  tone?: "default" | "soft" | "hero";
};

const toneClasses = {
  default: "bg-card",
  soft: "bg-[var(--color-tomato-soft)]",
  hero: "bg-[linear-gradient(135deg,var(--color-tomato-soft)_0%,var(--color-card-bg)_62%,var(--color-cream-orange)_160%)]",
};

export function AppCard({ className, tone = "default", ...props }: AppCardProps) {
  return (
    <section
      className={cn(
        "rounded-[var(--radius-xl)] border border-border p-4 text-card-foreground shadow-[var(--shadow-card)]",
        toneClasses[tone],
        className,
      )}
      {...props}
    />
  );
}
