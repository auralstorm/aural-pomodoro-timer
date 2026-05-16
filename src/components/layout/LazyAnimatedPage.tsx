import { Suspense } from "react";
import type { ReactNode } from "react";

const PageSuspenseFallback = () => (
  <main className="grid min-h-[calc(100dvh-var(--header-height))] place-items-center bg-background text-primary">
    <div className="rounded-[var(--radius-pill)] border border-border bg-card px-6 py-3 font-bold shadow-[var(--shadow-card)]">
      番茄小助手正在准备页面...
    </div>
  </main>
);

export function LazyAnimatedPage({ component }: { component: ReactNode }) {
  return (
    <Suspense fallback={<PageSuspenseFallback />}>
      {component}
    </Suspense>
  );
}
