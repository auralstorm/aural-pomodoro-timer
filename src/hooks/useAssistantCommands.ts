import { useEffect } from "react";
import { listen } from "@tauri-apps/api/event";
import { useNavigate } from "react-router-dom";
import { AssistantCommand } from "@/types/assistant";
import { showMainWindow } from "@/desktop/window";
import { useSettingsStore } from "@/stores/settingsStore";
import { useTimerStore } from "@/stores/timerStore";
import { usePomodoroTimer } from "@/hooks/usePomodoroTimer";

export function useAssistantCommands() {
  const { start, pause, reset, switchMode, mode } = usePomodoroTimer();
  const navigate = useNavigate();

  useEffect(() => {
    const unlisteners = Promise.all([
      listen(AssistantCommand.StartFocus, () => {
        const state = useTimerStore.getState();
        if (state.mode !== "focus") {
          switchMode("focus");
        }
        start();
      }),
      listen(AssistantCommand.Pause, () => {
        pause();
      }),
      listen(AssistantCommand.Reset, () => {
        reset();
      }),
      listen(AssistantCommand.SwitchMode, () => {
        const state = useTimerStore.getState();
        const next = state.mode === "focus" ? "shortBreak" : "focus";
        switchMode(next);
      }),
      listen(AssistantCommand.ShowStats, async () => {
        navigate("/statistics");
        await showMainWindow();
      }),
      listen(AssistantCommand.OpenSettings, async () => {
        navigate("/settings");
        await showMainWindow();
      }),
      listen(AssistantCommand.HideAssistant, () => {
        useSettingsStore.getState().updateSettings({ assistantEnabled: false });
      }),
    ]);

    return () => {
      unlisteners.then((fns) => fns.forEach((fn) => fn()));
    };
  }, [start, pause, reset, switchMode, navigate, mode]);
}
