import { useEffect } from "react";
import { safeListen } from "@/desktop/event";
import { useNavigate } from "react-router-dom";
import { AssistantCommand } from "@/constants/assistant";
import { showMainWindow } from "@/desktop/window";
import { useSettingsStore } from "@/stores/settingsStore";
import { useTimerStore } from "@/stores/timerStore";
import { usePomodoroTimer } from "@/hooks/usePomodoroTimer";

export function useAssistantCommands() {
  const { start, pause, reset, switchMode, mode } = usePomodoroTimer();
  const navigate = useNavigate();

  useEffect(() => {
    const unlisteners = Promise.all([
      safeListen(AssistantCommand.StartFocus, () => {
        const state = useTimerStore.getState();
        if (state.mode !== "focus") {
          switchMode("focus");
        }
        start();
      }),
      safeListen(AssistantCommand.Pause, () => {
        pause();
      }),
      safeListen(AssistantCommand.Reset, () => {
        reset();
      }),
      safeListen(AssistantCommand.SwitchMode, () => {
        const state = useTimerStore.getState();
        const next = state.mode === "focus" ? "shortBreak" : "focus";
        switchMode(next);
      }),
      safeListen(AssistantCommand.ShowStats, async () => {
        navigate("/statistics");
        await showMainWindow();
      }),
      safeListen(AssistantCommand.OpenSettings, async () => {
        navigate("/settings");
        await showMainWindow();
      }),
      safeListen(AssistantCommand.HideAssistant, () => {
        useSettingsStore.getState().updateSettings({ assistantEnabled: false });
      }),
    ]);

    return () => {
      unlisteners.then((fns) => fns.forEach((fn) => fn()));
    };
  }, [start, pause, reset, switchMode, navigate, mode]);
}
