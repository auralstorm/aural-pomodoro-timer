import { createHashRouter, Navigate, useRouteError } from "react-router-dom";
import { lazy, Suspense } from "react";
import type { ReactNode } from "react";

import { AppShell } from "@/components/layout/AppShell";
import { LazyAnimatedPage } from "@/components/layout/LazyAnimatedPage";
import { AppButton } from "@/components/common/AppButton";

const DashboardHome = lazy(() =>
  import("@/pages/DashboardHome").then((module) => ({
    default: module.DashboardHome,
  })),
);
const FocusWorkspace = lazy(() =>
  import("@/pages/FocusWorkspace").then((module) => ({
    default: module.FocusWorkspace,
  })),
);
const TaskManagement = lazy(() =>
  import("@/pages/TaskManagement").then((module) => ({
    default: module.TaskManagement,
  })),
);
const StatisticsDashboard = lazy(() =>
  import("@/pages/statistics").then((module) => ({
    default: module.StatisticsDashboard,
  })),
);
const SettingsPage = lazy(() =>
  import("@/pages/SettingsPage").then((module) => ({
    default: module.SettingsPage,
  })),
);
const DesktopAssistantPage = lazy(() =>
  import("@/pages/DesktopAssistantPage").then((module) => ({
    default: module.DesktopAssistantPage,
  })),
);

function PageSuspense({ children }: { children: ReactNode }) {
  return (
    <Suspense
      fallback={
        <main className="grid min-h-[calc(100dvh-var(--header-height))] place-items-center bg-background text-primary">
          <div className="rounded-[var(--radius-pill)] border border-border bg-card px-6 py-3 font-bold shadow-[var(--shadow-card)]">
            番茄小助手正在准备页面...
          </div>
        </main>
      }
    >
      {children}
    </Suspense>
  );
}

function RouteErrorFallback() {
  const error = useRouteError();
  const message = error instanceof Error ? error.message : "发生了未知错误";

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-6 bg-background p-8 text-center">
      <div className="flex flex-col items-center gap-3">
        <span className="text-4xl">🍅</span>
        <h2 className="text-xl font-bold text-foreground">哎呀，页面出了点问题</h2>
        <p className="max-w-md text-sm leading-6 text-muted-foreground">
          别担心，你的数据不会丢失。请尝试刷新页面。
        </p>
      </div>
      <div className="flex gap-3">
        <AppButton onClick={() => window.location.reload()} variant="primary">
          刷新页面
        </AppButton>
      </div>
      {import.meta.env.DEV && (
        <pre className="mt-4 max-w-lg overflow-auto rounded-lg bg-muted p-3 text-left text-xs text-destructive">
          {message}
        </pre>
      )}
    </div>
  );
}

export const router = createHashRouter([
  {
    path: "/assistant",
    element: (
      <PageSuspense>
        <DesktopAssistantPage />
      </PageSuspense>
    ),
  },
  {
    path: "/",
    element: <AppShell />,
    errorElement: <RouteErrorFallback />,
    children: [
      { index: true, element: <Navigate replace to="focus" /> },
      { path: "focus", element: <LazyAnimatedPage component={<FocusWorkspace />} /> },
      { path: "tasks", element: <LazyAnimatedPage component={<TaskManagement />} /> },
      { path: "dashboard", element: <LazyAnimatedPage component={<DashboardHome />} /> },
      { path: "statistics", element: <LazyAnimatedPage component={<StatisticsDashboard />} /> },
      { path: "settings", element: <LazyAnimatedPage component={<SettingsPage />} /> },
    ],
  },
]);
