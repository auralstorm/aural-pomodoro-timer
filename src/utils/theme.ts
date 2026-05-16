import type { AppTheme } from "@/types/settings";

export function applyAppTheme(theme: AppTheme, root: HTMLElement = document.documentElement): void {
  root.dataset.theme = theme;
  root.classList.toggle("dark", theme === "darkFocus");
}
