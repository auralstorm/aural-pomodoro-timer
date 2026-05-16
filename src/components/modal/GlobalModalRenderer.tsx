import { useNavigate } from "react-router-dom";

import { useSettingsStore } from "@/stores/settingsStore";
import { useModalStore } from "@/stores/modalStore";
import { useStatsStore } from "@/stores/statsStore";
import { useTaskStore } from "@/stores/taskStore";
import { useTimerStore } from "@/stores/timerStore";
import { minutesToSeconds } from "@/utils/time";

import { AchievementUnlockedModal } from "./modals/AchievementUnlockedModal";
import { ActionConfirmModal } from "./modals/ActionConfirmModal";
import { AllTasksCompleteModal } from "./modals/AllTasksCompleteModal";
import { BreakCompleteModal } from "./modals/BreakCompleteModal";
import { ClearDataConfirmModal } from "./modals/ClearDataConfirmModal";
import { DeleteTaskConfirmModal } from "./modals/DeleteTaskConfirmModal";
import { FocusCompleteModal } from "./modals/FocusCompleteModal";
import { LongBreakRewardModal } from "./modals/LongBreakRewardModal";
import { TaskCompleteModal } from "./modals/TaskCompleteModal";

export function GlobalModalRenderer() {
  const navigate = useNavigate();
  const { activeModal, payload, closeModal } = useModalStore();
  const clearTasks = useTaskStore((state) => state.clearTasks);
  const clearSessions = useStatsStore((state) => state.clearSessions);
  const deleteTask = useTaskStore((state) => state.deleteTask);
  const resetTimer = useTimerStore((state) => state.resetTimer);
  const startTimer = useTimerStore((state) => state.startTimer);
  const switchMode = useTimerStore((state) => state.switchMode);
  const focusMinutes = useSettingsStore((state) => state.focusMinutes);
  const shortBreakMinutes = useSettingsStore((state) => state.shortBreakMinutes);

  if (!activeModal) {
    return null;
  }

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      closeModal();
    }
  };

  switch (activeModal) {
    case "focusComplete":
      return (
        <FocusCompleteModal
          minutes={payload?.minutes ?? focusMinutes}
          onContinueFocus={() => {
            switchMode("focus", minutesToSeconds(focusMinutes));
            closeModal();
          }}
          onOpenChange={handleOpenChange}
          onStartBreak={() => {
            startTimer();
            closeModal();
          }}
          open
          taskTitle={payload?.taskTitle}
        />
      );

    case "breakComplete":
      return (
        <BreakCompleteModal
          breakMode={payload?.breakMode ?? "shortBreak"}
          nextFocusMinutes={focusMinutes}
          onLater={closeModal}
          onOpenChange={handleOpenChange}
          onStartFocus={() => {
            startTimer();
            closeModal();
          }}
          open
          restMinutes={payload?.minutes ?? shortBreakMinutes}
        />
      );

    case "longBreakReward":
      return (
        <LongBreakRewardModal
          onLater={closeModal}
          onOpenChange={handleOpenChange}
          onStartBreak={() => {
            startTimer();
            closeModal();
          }}
          open
          pomodoros={payload?.pomodoros ?? 4}
        />
      );

    case "taskComplete":
      return (
        <TaskCompleteModal
          onContinueFocus={closeModal}
          onOpenChange={handleOpenChange}
          onViewTasks={() => {
            navigate("/tasks");
            closeModal();
          }}
          open
          taskTitle={payload?.taskTitle}
        />
      );

    case "allTasksComplete":
      return (
        <AllTasksCompleteModal
          onBackHome={() => {
            navigate("/dashboard");
            closeModal();
          }}
          onOpenChange={handleOpenChange}
          onViewStatistics={() => {
            navigate("/statistics");
            closeModal();
          }}
          open
        />
      );

    case "achievementUnlocked":
      return (
        <AchievementUnlockedModal
          achievementIds={payload?.achievementIds}
          achievementTitle={payload?.achievementTitle}
          onContinueFocus={closeModal}
          onOpenChange={handleOpenChange}
          onViewAchievements={() => {
            navigate("/statistics");
            closeModal();
          }}
          open
        />
      );

    case "deleteTaskConfirm":
      return (
        <DeleteTaskConfirmModal
          onCancel={closeModal}
          onDelete={() => {
            if (payload?.taskId) {
              deleteTask(payload.taskId);
            }
            closeModal();
          }}
          onOpenChange={handleOpenChange}
          open
        />
      );

    case "actionConfirm":
      return (
        <ActionConfirmModal
          cancelLabel={payload?.cancelLabel}
          confirmLabel={payload?.confirmLabel ?? "确认"}
          confirmVariant={payload?.confirmVariant}
          description={payload?.confirmDescription ?? ""}
          onCancel={closeModal}
          onConfirm={() => {
            payload?.onConfirm?.();
            closeModal();
          }}
          onOpenChange={handleOpenChange}
          open
          title={payload?.confirmTitle ?? "确认继续当前操作？"}
        />
      );

    case "clearDataConfirm":
      return (
        <ClearDataConfirmModal
          onCancel={closeModal}
          onConfirm={() => {
            clearTasks();
            clearSessions();
            resetTimer();
            closeModal();
          }}
          onOpenChange={handleOpenChange}
          open
        />
      );

    default:
      return null;
  }
}
