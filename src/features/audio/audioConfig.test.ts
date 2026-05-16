import { describe, expect, it } from "vitest";

import type { ReminderTonePreset, WhiteNoisePreset } from "@/types/settings";
import {
  getReminderToneAudio,
  getWhiteNoiseAudio,
  getWhiteNoiseLabel,
  reminderToneAudioConfig,
  whiteNoiseAudioConfig,
} from "./audioConfig";

function decodedAssetUrl(src: string): string {
  return decodeURIComponent(src);
}

describe("audio config", () => {
  it("maps every reminder tone preset to its local audio asset", () => {
    const presets: ReminderTonePreset[] = ["soft", "soothing", "pikachu", "doraemon"];

    expect(Object.keys(reminderToneAudioConfig)).toEqual(presets);
    expect(getReminderToneAudio("soft")).toMatchObject({ label: "轻柔" });
    expect(decodedAssetUrl(getReminderToneAudio("soothing").src)).toContain("舒缓");
    expect(decodedAssetUrl(getReminderToneAudio("pikachu").src)).toContain("皮卡丘");
    expect(decodedAssetUrl(getReminderToneAudio("doraemon").src)).toContain("哆啦A梦");
  });

  it("maps every white noise preset to labels and local audio assets", () => {
    const playablePresets: Exclude<WhiteNoisePreset, "off">[] = [
      "rain",
      "forest",
      "stream",
      "fire",
    ];

    expect(Object.keys(whiteNoiseAudioConfig)).toEqual(playablePresets);
    expect(getWhiteNoiseLabel("off")).toBe("关闭");
    expect(getWhiteNoiseLabel("stream")).toBe("溪流");
    expect(decodedAssetUrl(getWhiteNoiseAudio("fire").src)).toContain("火焰");
  });
});
