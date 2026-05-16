import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type EmptyStateProps = {
  title: string;
  description: string;
  image?: string;
  children?: ReactNode;
  className?: string;
};

export function EmptyState({ title, description, image, children, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4 rounded-[var(--radius-xl)] border border-dashed border-border bg-card/70 p-8 text-center",
        className,
      )}
    >
      {image ? <img alt="" className="size-28 object-contain" loading="lazy" src={image} /> : null}
      <div className="flex flex-col gap-2">
        <h3 className="text-xl font-bold text-foreground">{title}</h3>
        <p className="max-w-md text-sm leading-6 text-muted-foreground">{description}</p>
      </div>
      {children}
    </div>
  );
}
