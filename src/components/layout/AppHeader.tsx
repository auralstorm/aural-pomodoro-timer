import type { CSSProperties } from "react";

import { NavLink, useLocation } from "react-router-dom";

import { cn } from "@/lib/utils";
import IconFocus from "@/assets/icons/icon-focus.svg";
import IconTasks from "@/assets/icons/icon-task.svg";
import IconStatistics from "@/assets/icons/icon-statistics.svg";
import IconSettings from "@/assets/icons/icon-settings.svg";

const navItems = [
  { to: "/focus", label: "专注", icon: IconFocus },
  { to: "/tasks", label: "任务", icon: IconTasks },
  { to: "/statistics", label: "统计", icon: IconStatistics },
  { to: "/settings", label: "设置", icon: IconSettings },
];

export function AppHeader() {
  const { pathname } = useLocation();
  const activeIndex = navItems.findIndex(
    (item) => pathname === item.to || pathname.startsWith(`${item.to}/`),
  );
  const style = {
    "--active-index": Math.max(0, activeIndex),
    "--nav-count": navItems.length,
  } as CSSProperties & Record<`--${string}`, number>;

  return (
    <header className="pointer-events-none fixed inset-x-0 top-9 z-50 flex justify-center px-4">
      <nav
        aria-label="主导航"
        className="pointer-events-auto relative inline-grid rounded-[30px] bg-[rgba(255,252,249,0.58)] p-1.5 shadow-[0_18px_42px_rgba(58,46,42,0.09),inset_0_1px_0_rgba(255,255,255,0.82)] supports-[backdrop-filter]:bg-[rgba(255,252,249,0.42)] backdrop-blur-[22px] backdrop-saturate-[1.35]"
        data-slot="floating-nav"
        style={{
          ...style,
          gridTemplateColumns: `repeat(${navItems.length}, minmax(0, 1fr))`,
        }}
      >
        <span
          aria-hidden="true"
          className={cn(
            "absolute bottom-1.5 left-1.5 top-1.5 z-0 rounded-[24px] bg-[var(--color-tomato-soft)] shadow-[0_10px_24px_rgba(255,107,107,0.14)] transition-[transform,opacity] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
            activeIndex === -1 && "opacity-0",
          )}
          data-slot="floating-nav-indicator"
          style={{
            transform: "translateX(calc(var(--active-index) * 100%))",
            width: "calc((100% - 0.75rem) / var(--nav-count))",
          }}
        />
        {navItems.map((item) => (
          <NavLink
            className={({ isActive }) =>
              cn(
                "relative z-10 flex h-12 min-w-[108px] items-center justify-center gap-2 rounded-[24px] px-5 text-sm font-semibold leading-none text-muted-foreground transition-colors duration-200 hover:text-primary",
                isActive && "text-primary",
              )
            }
            key={item.to}
            to={item.to}
          >
            {({ isActive }) => (
              <>
                <img
                  alt={item.label}
                  className={cn(
                    "size-8 shrink-0 transform-gpu will-change-transform",
                    isActive &&
                      "motion-safe:animate-[nav-icon-pop_500ms_cubic-bezier(0.22,1,0.36,1)]",
                  )}
                  src={item.icon}
                />
                <span className="whitespace-nowrap">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}
