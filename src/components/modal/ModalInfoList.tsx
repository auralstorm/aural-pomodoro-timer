import type { ReactNode } from "react";

type ModalInfoItem = {
  icon: ReactNode;
  label: string;
  value: string;
  accentClassName?: string;
};

type ModalInfoListProps = {
  items: ModalInfoItem[];
};

export function ModalInfoList({ items }: ModalInfoListProps) {
  return (
    <div className="grid gap-3">
      {items.map((item) => (
        <div
          className="flex items-center gap-3 rounded-[20px] border border-border/70 bg-[color-mix(in_srgb,var(--color-tomato-soft)_45%,white)] px-4 py-3"
          key={`${item.label}-${item.value}`}
        >
          <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white text-primary shadow-[0_6px_20px_rgba(255,107,107,0.08)]">
            {item.icon}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-muted-foreground">{item.label}</p>
            <p className={item.accentClassName ?? "text-sm font-semibold text-foreground"}>
              {item.value}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
