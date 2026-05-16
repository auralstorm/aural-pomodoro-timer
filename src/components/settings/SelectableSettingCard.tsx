import { Check } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type SelectableSettingCardProps = {
  selected: boolean;
  title: string;
  subtitle?: string;
  icon?: string;
  iconClassName?: string;
  children?: ReactNode;
  onClick: () => void;
  className?: string;
};

export function SelectableSettingCard({
  selected,
  title,
  subtitle,
  icon,
  iconClassName,
  children,
  onClick,
  className,
}: SelectableSettingCardProps) {
  return (
    <button
      aria-pressed={selected}
      className={cn(
        "relative flex min-h-20 flex-col items-center justify-center gap-1 rounded-[var(--radius-lg)] border bg-background px-4 py-3 text-center transition hover:border-primary/60",
        selected &&
          "border-primary bg-[var(--color-tomato-soft)] text-primary shadow-[var(--shadow-card)]",
        className,
      )}
      onClick={onClick}
      type="button"
    >
      {selected ? (
        <span className="absolute left-1 top-1 grid size-5 place-items-center rounded-full bg-primary text-black">
          <Check className="size-3.5" />
        </span>
      ) : null}
      {icon ? (
        <img
          alt=""
          className={cn("size-7 object-contain", iconClassName)}
          draggable={false}
          src={icon}
        />
      ) : null}
      <span className="font-bold">{title}</span>
      {subtitle ? <span className="text-sm text-muted-foreground">{subtitle}</span> : null}
      {children}
    </button>
  );
}
