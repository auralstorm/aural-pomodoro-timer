import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const setAlwaysOnTop = vi.fn();
const hide = vi.fn();
const show = vi.fn();
const unminimize = vi.fn();
const setFocus = vi.fn();
const onCloseRequested = vi.fn();
let closeHandler: ((event: { preventDefault: () => void }) => void | Promise<void>) | undefined;
const unlisten = vi.fn();

vi.mock("@tauri-apps/api/window", () => ({
  getCurrentWindow: () => ({
    setAlwaysOnTop,
    hide,
    show,
    unminimize,
    setFocus,
    onCloseRequested,
  }),
  Window: {
    getByLabel: vi.fn().mockResolvedValue(null),
  },
}));

describe("desktop window utilities", () => {
  beforeEach(() => {
    setAlwaysOnTop.mockReset();
    hide.mockReset();
    show.mockReset();
    unminimize.mockReset();
    setFocus.mockReset();
    unlisten.mockReset();
    closeHandler = undefined;
    onCloseRequested.mockReset();
    onCloseRequested.mockImplementation(async (handler) => {
      closeHandler = handler;
      return unlisten;
    });
  });

  afterEach(() => {
    vi.resetModules();
  });

  it("sets the current Tauri window always-on-top state", async () => {
    const { setWindowAlwaysOnTop } = await import("./window");

    await setWindowAlwaysOnTop(true);

    expect(setAlwaysOnTop).toHaveBeenCalledWith(true);
  });

  it("registers minimize-to-tray close interception when enabled", async () => {
    const { setMinimizeToTrayEnabled } = await import("./window");
    const preventDefault = vi.fn();

    await setMinimizeToTrayEnabled(true);
    await closeHandler?.({ preventDefault });

    expect(onCloseRequested).toHaveBeenCalledTimes(1);
    expect(preventDefault).toHaveBeenCalledTimes(1);
    expect(hide).toHaveBeenCalledTimes(1);
  });

  it("cleans up the close interception when minimize-to-tray is disabled", async () => {
    const { setMinimizeToTrayEnabled } = await import("./window");

    await setMinimizeToTrayEnabled(true);
    await setMinimizeToTrayEnabled(false);

    expect(unlisten).toHaveBeenCalledTimes(1);
  });

  it("restores the current window from the tray", async () => {
    const { showMainWindow } = await import("./window");

    await showMainWindow();

    expect(show).toHaveBeenCalledTimes(1);
    expect(unminimize).toHaveBeenCalledTimes(1);
    expect(setFocus).toHaveBeenCalledTimes(1);
  });
});
