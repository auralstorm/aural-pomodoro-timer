import { useEffect, useState } from "react";
import { Minus, Square, X, Copy } from "lucide-react";
import { getCurrentWindow } from "@tauri-apps/api/window";

export function WindowControls() {
  const [maximized, setMaximized] = useState(false);

  useEffect(() => {
    const appWindow = getCurrentWindow();
    let unlisten: (() => void) | undefined;

    appWindow.isMaximized().then(setMaximized);

    appWindow.onResized(() => {
      appWindow.isMaximized().then(setMaximized);
    }).then((fn) => {
      unlisten = fn;
    });

    return () => unlisten?.();
  }, []);

  const appWindow = getCurrentWindow();

  return (
    <div className="fixed right-0 top-0 z-[9999] flex">
      <button
        aria-label="最小化"
        className="inline-flex h-9 w-12 items-center justify-center text-foreground/60 transition hover:bg-foreground/8 hover:text-foreground"
        onClick={() => appWindow.minimize()}
        type="button"
      >
        <Minus className="size-4" />
      </button>
      <button
        aria-label={maximized ? "还原" : "最大化"}
        className="inline-flex h-9 w-12 items-center justify-center text-foreground/60 transition hover:bg-foreground/8 hover:text-foreground"
        onClick={() => appWindow.toggleMaximize()}
        type="button"
      >
        {maximized ? <Copy className="size-3.5" /> : <Square className="size-3.5" />}
      </button>
      <button
        aria-label="关闭"
        className="inline-flex h-9 w-12 items-center justify-center text-foreground/60 transition hover:bg-red-500 hover:text-white"
        onClick={() => appWindow.close()}
        type="button"
      >
        <X className="size-4" />
      </button>
    </div>
  );
}
