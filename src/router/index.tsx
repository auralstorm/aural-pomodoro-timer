import { createHashRouter, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import type { ReactNode } from "react";

import { AppShell } from "@/components/layout/AppShell";
import { LazyAnimatedPage } from "@/components/layout/LazyAnimatedPage";

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
  import("@/pages/StatisticsDashboard").then((module) => ({
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
