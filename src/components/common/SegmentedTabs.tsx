import type { CSSProperties, ReactNode } from "react";

import { cn } from "@/lib/utils";

export type SegmentedTabOption<T extends string> = {
  value: T;
  label: string;
  icon?: ReactNode;
  helper?: string;
  disabled?: boolean;
};

type SegmentedTabsProps<T extends string> = {
  value: T;
  options: SegmentedTabOption<T>[];
  onChange: (value: T) => void;
  className?: string;
};

export function SegmentedTabs<T extends string>({
  value,
  options,
  onChange,
  className,
}: SegmentedTabsProps<T>) {
  const activeIndex = Math.max(
    0,
    options.findIndex((option) => option.value === value),
  );
  const style = {
    "--active-index": activeIndex,
    "--tab-count": options.length,
  } as CSSProperties & Record<`--${string}`, number>;

  return (
    <div
      className={cn(
        "relative inline-grid rounded-[var(--radius-pill)] border border-border bg-card p-1",
        className,
      )}
      style={{
        ...style,
        gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))`,
      }}
    >
      <span
        aria-hidden="true"
        className="absolute left-1 top-1 bottom-1 z-0 rounded-[var(--radius-pill)] bg-[var(--color-tomato-soft)] shadow-sm transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
        data-slot="segmented-tabs-indicator"
        style={{
          transform: "translateX(calc(var(--active-index) * 100%))",
          width: "calc((100% - 0.5rem) / var(--tab-count))",
        }}
      />
      {options.map((option) => (
        <button
          aria-pressed={value === option.value}
          disabled={option.disabled}
          className={cn(
            "relative z-10 inline-flex min-h-9 items-center justify-center gap-1.5 rounded-[var(--radius-pill)] px-5 text-sm font-semibold text-muted-foreground transition-colors duration-200",
            value === option.value && "text-primary",
            option.disabled && "cursor-not-allowed opacity-45",
          )}
          key={option.value}
          onClick={() => {
            if (!option.disabled) {
              onChange(option.value);
            }
          }}
          type="button"
        >
          {option.icon
            ? // <span className="inline-flex size-4 shrink-0 items-center justify-center">
              option.icon
            : // </span>
              null}
          {option.label}
          {option.helper ? <span className="ml-1 text-xs font-medium">{option.helper}</span> : null}
        </button>
      ))}
    </div>
  );
}
