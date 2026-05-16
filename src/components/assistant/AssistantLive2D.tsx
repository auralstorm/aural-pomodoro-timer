import { useEffect, useRef, useCallback, useState } from "react";

import * as PIXI from "pixi.js";
import { Live2DModel, MotionPriority } from "pixi-live2d-display/cubism4";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { invoke } from "@tauri-apps/api/core";
import { safeEmit, safeListen, type UnlistenFn } from "@/desktop/event";
import { AssistantEvent, AssistantCommand, AssistantBubbleMessages } from "@/constants/assistant";

export function Live2DCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const modelRef = useRef<Live2DModel | null>(null);
  const unlistenersRef = useRef<UnlistenFn[]>([]);
  const bubbleTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const [bubble, setBubble] = useState<string | null>(null);
  const [positionLocked, setPositionLocked] = useState(false);
  const [alwaysOnTop, setAlwaysOnTop] = useState(true);

  const positionLockedRef = useRef(positionLocked);
  positionLockedRef.current = positionLocked;

  const alwaysOnTopRef = useRef(alwaysOnTop);
  alwaysOnTopRef.current = alwaysOnTop;

  const showBubble = useCallback((eventKey: string) => {
    const getMessage = AssistantBubbleMessages[eventKey];
    if (!getMessage) return;

    clearTimeout(bubbleTimerRef.current);
    setBubble(getMessage());
    bubbleTimerRef.current = setTimeout(() => setBubble(null), 4000);
  }, []);

  const setupEventListeners = useCallback(
    async (model: Live2DModel) => {
      const bind = (
        event: string,
        motionGroup: string,
        motionIndex?: number,
        priority = MotionPriority.FORCE,
      ) =>
        safeListen(event, () => {
          model.motion(motionGroup, motionIndex, priority);
          showBubble(event);
        });

      const listeners = await Promise.all([
        bind(AssistantEvent.FocusStart, "Idle", 0),
        bind(AssistantEvent.TimerPause, "TapBody", 0),
        bind(AssistantEvent.TimerResume, "Idle", 1, MotionPriority.NORMAL),
        bind(AssistantEvent.FocusComplete, "TapBody", 0),
        bind(AssistantEvent.BreakStart, "Idle", 3, MotionPriority.NORMAL),
        bind(AssistantEvent.BreakComplete, "TapBody", 0),
        bind(AssistantEvent.TaskComplete, "TapBody", 0),
        bind(AssistantEvent.AllTasksComplete, "TapBody", 0),
        bind(AssistantEvent.Achievement, "TapBody", 0),
        bind(AssistantEvent.TimerReset, "Idle", 5, MotionPriority.NORMAL),
      ]);

      unlistenersRef.current = listeners;
    },
    [showBubble],
  );

  useEffect(() => {
    const unlisten = safeListen<string>("assistant-menu-action", (event) => {
      const action = event.payload;
      switch (action) {
        case "toggle_lock":
          setPositionLocked((v) => !v);
          break;
        case "toggle_top": {
          const next = !alwaysOnTopRef.current;
          setAlwaysOnTop(next);
          void getCurrentWindow().setAlwaysOnTop(next);
          break;
        }
        case "start_focus":
          void safeEmit(AssistantCommand.StartFocus);
          break;
        case "pause":
          void safeEmit(AssistantCommand.Pause);
          break;
        case "reset":
          void safeEmit(AssistantCommand.Reset);
          break;
        case "switch_mode":
          void safeEmit(AssistantCommand.SwitchMode);
          break;
        case "show_stats":
          void safeEmit(AssistantCommand.ShowStats);
          break;
        case "headpat":
          modelRef.current?.motion("Idle", undefined, MotionPriority.FORCE);
          showBubble("headpat");
          break;
        case "cheer":
          modelRef.current?.motion("TapBody", 0, MotionPriority.FORCE);
          showBubble("cheer");
          break;
        case "celebrate":
          modelRef.current?.motion("TapBody", 0, MotionPriority.FORCE);
          showBubble("celebrate");
          break;
        case "open_settings":
          void safeEmit(AssistantCommand.OpenSettings);
          break;
        case "exit_assistant":
          void safeEmit(AssistantCommand.HideAssistant);
          void getCurrentWindow().close();
          break;
      }
    });

    return () => {
      unlisten.then((fn) => fn());
    };
  }, [showBubble]);

  useEffect(() => {
    if (!containerRef.current) return;

    let app: PIXI.Application;

    const init = async () => {
      app = new PIXI.Application({
        resizeTo: containerRef.current!,
        backgroundAlpha: 0,
        antialias: true,
        autoDensity: true,
      });

      containerRef.current!.appendChild(app.view as HTMLCanvasElement);

      const model = await Live2DModel.from("/resources/Hiyori/Hiyori.model3.json");

      modelRef.current = model;

      model.anchor.set(0.5);
      model.x = app.screen.width / 2;
      model.y = app.screen.height / 2;
      model.scale.set(0.1);

      model.interactive = true;
      model.cursor = "grab";

      model.on("pointerdown", () => {
        const dragTimer = setTimeout(() => {
          if (!positionLockedRef.current) {
            getCurrentWindow().startDragging();
          }
        }, 150);

        const cancelDrag = () => {
          clearTimeout(dragTimer);
          model.motion("TapBody", 0, MotionPriority.NORMAL);
          showBubble("tap");
          model.off("pointerup", cancelDrag);
          model.off("pointerupoutside", cleanup);
        };

        const cleanup = () => {
          clearTimeout(dragTimer);
          model.off("pointerup", cancelDrag);
          model.off("pointerupoutside", cleanup);
        };

        model.once("pointerup", cancelDrag);
        model.once("pointerupoutside", cleanup);
      });

      app.stage.addChild(model);
      await setupEventListeners(model);

      const win = getCurrentWindow();
      await win.show();
      await win.setFocus();
    };

    const timer = setTimeout(() => {
      init();
    }, 300);

    return () => {
      clearTimeout(timer);
      clearTimeout(bubbleTimerRef.current);
      unlistenersRef.current.forEach((fn) => fn());
      unlistenersRef.current = [];
      app?.destroy(true, true);
      modelRef.current = null;
    };
  }, [setupEventListeners, showBubble]);

  return (
    <div
      ref={containerRef}
      onContextMenu={(e) => {
        e.preventDefault();
        void invoke("show_assistant_menu", {
          positionLocked,
          alwaysOnTop,
        });
      }}
      style={{
        width: "100%",
        height: "100vh",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {bubble && (
        <div
          style={{
            position: "absolute",
            top: 12,
            left: "50%",
            transform: "translateX(-50%)",
            background: "rgba(255, 255, 255, 0.92)",
            color: "#4a3728",
            borderRadius: 14,
            padding: "8px 16px",
            fontSize: 13,
            fontWeight: 500,
            lineHeight: 1.5,
            maxWidth: "85%",
            textAlign: "center",
            boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
            pointerEvents: "none",
            animation: "bubbleFadeIn 0.25s ease",
            whiteSpace: "nowrap",
            zIndex: 100,
          }}
        >
          {bubble}
          <div
            style={{
              position: "absolute",
              bottom: -6,
              left: "50%",
              transform: "translateX(-50%)",
              width: 0,
              height: 0,
              borderLeft: "6px solid transparent",
              borderRight: "6px solid transparent",
              borderTop: "6px solid rgba(255, 255, 255, 0.92)",
            }}
          />
        </div>
      )}
    </div>
  );
}
