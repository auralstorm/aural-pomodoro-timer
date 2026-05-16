import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import { useLocation, useOutlet } from "react-router-dom";

import { GlobalModalRenderer } from "@/components/modal/GlobalModalRenderer";
import { Toaster } from "@/components/ui/sonner";
import {
  setAssistantWindowEnabled,
  setMinimizeToTrayEnabled,
  setWindowAlwaysOnTop,
} from "@/desktop/window";
import { useAssistantCommands } from "@/hooks/useAssistantCommands";
import { useSettingsStore } from "@/stores/settingsStore";
import { applyAppTheme } from "@/utils/theme";
import { AppHeader } from "./AppHeader";

export function AppShell() {
  const theme = useSettingsStore((state) => state.theme);
  const alwaysOnTop = useSettingsStore((state) => state.alwaysOnTop);
  const assistantEnabled = useSettingsStore((state) => state.assistantEnabled);
  const minimizeToTray = useSettingsStore((state) => state.minimizeToTray);
  const location = useLocation();
  const outlet = useOutlet();

  useAssistantCommands();

  useEffect(() => {
    applyAppTheme(theme);
  }, [theme]);

  useEffect(() => {
    void setWindowAlwaysOnTop(alwaysOnTop);
  }, [alwaysOnTop]);

  useEffect(() => {
    void setMinimizeToTrayEnabled(minimizeToTray);
  }, [minimizeToTray]);

  useEffect(() => {
    void setAssistantWindowEnabled(assistantEnabled);
  }, [assistantEnabled]);

  return (
    <div className="relative min-h-dvh overflow-x-clip bg-background text-foreground">
      <div className="relative z-10">
        <AppHeader />
        <div className="pt-[calc(var(--header-height))]">
          <AnimatePresence initial={false} mode="wait">
            <motion.div
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              initial={{ opacity: 0 }}
              key={location.pathname}
              transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            >
              {outlet}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      <GlobalModalRenderer />
      <Toaster />
    </div>
  );
}
