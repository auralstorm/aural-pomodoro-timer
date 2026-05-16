import { afterEach, describe, expect, it, vi } from "vitest";

import { notifyFocusComplete } from "./notification";

describe("desktop notifications", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("does not request or send a notification when disabled", async () => {
    const requestPermission = vi.fn();
    const NotificationMock = vi.fn();
    Object.assign(NotificationMock, {
      permission: "default",
      requestPermission,
    });
    vi.stubGlobal("Notification", NotificationMock);

    await notifyFocusComplete({ enabled: false });

    expect(requestPermission).not.toHaveBeenCalled();
    expect(NotificationMock).not.toHaveBeenCalled();
  });
});
