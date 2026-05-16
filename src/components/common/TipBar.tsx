import type { ReactNode } from "react";

import logoSymbol from "@/assets/logo/logo-symbol-tomato.png";

type TipBarProps = {
  children: ReactNode;
};

export function TipBar({ children }: TipBarProps) {
  return (
    <div className="mx-auto flex min-h-11 max-w-5xl items-center justify-center gap-3 rounded-[var(--radius-pill)] border border-border bg-[var(--color-tomato-soft)] px-6 text-sm font-medium text-muted-foreground">
      <img alt="" className="size-7 object-contain" src={logoSymbol} />
      <span>{children}</span>
    </div>
  );
}
