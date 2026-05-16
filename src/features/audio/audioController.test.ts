import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  playReminderTone,
  playWhiteNoise,
  setWhiteNoiseVolume,
  stopWhiteNoise,
} from "./audioController";

type AudioMockInstance = {
  currentTime: number;
  loop: boolean;
  pause: ReturnType<typeof vi.fn>;
  play: ReturnType<typeof vi.fn>;
  src: string;
  volume: number;
};

const audioInstances: AudioMockInstance[] = [];

function decodedAssetUrl(src: string): string {
  return decodeURIComponent(src);
}

class AudioMock {
  currentTime = 0;
  loop = false;
  pause = vi.fn();
  play = vi.fn().mockResolvedValue(undefined);
  src: string;
  volume = 1;

  constructor(src: string) {
    this.src = src;
    audioInstances.push(this);
  }
}

describe("audio controller", () => {
  beforeEach(() => {
    audioInstances.length = 0;
    vi.stubGlobal("Audio", AudioMock);
    stopWhiteNoise();
  });

  it("plays a one-shot reminder tone with normalized volume", async () => {
    await playReminderTone("pikachu", 48);

    expect(audioInstances).toHaveLength(1);
    expect(decodedAssetUrl(audioInstances[0].src)).toContain("皮卡丘");
    expect(audioInstances[0].loop).toBe(false);
    expect(audioInstances[0].volume).toBe(0.48);
    expect(audioInstances[0].play).toHaveBeenCalledTimes(1);
  });

  it("loops one white noise instance and reuses it for volume changes", async () => {
    await playWhiteNoise("stream", 30);
    setWhiteNoiseVolume(75);

    expect(audioInstances).toHaveLength(1);
    expect(decodedAssetUrl(audioInstances[0].src)).toContain("溪流");
    expect(audioInstances[0].loop).toBe(true);
    expect(audioInstances[0].volume).toBe(0.75);
    expect(audioInstances[0].play).toHaveBeenCalledTimes(1);
  });

  it("stops the active white noise when switching to off", async () => {
    await playWhiteNoise("rain", 60);
    await playWhiteNoise("off", 60);

    expect(audioInstances[0].pause).toHaveBeenCalledTimes(1);
    expect(audioInstances[0].currentTime).toBe(0);
  });

  it("replaces the active white noise when preset changes", async () => {
    await playWhiteNoise("rain", 60);
    await playWhiteNoise("forest", 60);

    expect(audioInstances).toHaveLength(2);
    expect(audioInstances[0].pause).toHaveBeenCalledTimes(1);
    expect(decodedAssetUrl(audioInstances[1].src)).toContain("森林");
    expect(audioInstances[1].play).toHaveBeenCalledTimes(1);
  });
});
