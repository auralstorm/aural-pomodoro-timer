import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type PageLayoutProps = {
  title?: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
};

export function PageLayout({ title, subtitle, action, children, className }: PageLayoutProps) {
  return (
    <main className="min-h-[calc(100dvh-var(--header-height))] bg-background">
      <div
        className={cn(
          "mx-auto flex w-full max-w-(--layout-max-width) flex-col gap-6 px-(--page-padding-x) py-(--page-padding-y)",
          className,
        )}
      >
        {(title || subtitle || action) && (
          <header className="flex items-end justify-between gap-6">
            <div className="flex flex-col gap-2">
              {title ? (
                <h1 className="text-4xl font-black tracking-normal text-foreground">{title}</h1>
              ) : null}
              {subtitle ? <p className="text-base text-muted-foreground">{subtitle}</p> : null}
            </div>
            {action}
          </header>
        )}
        {children}
      </div>
    </main>
  );
}
