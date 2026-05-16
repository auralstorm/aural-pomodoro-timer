import type { ReminderTonePreset, WhiteNoisePreset } from "@/types/settings";
import { getReminderToneAudio, getWhiteNoiseAudio } from "./audioConfig";
import { syncWhiteNoiseRuntime } from "./whiteNoiseRuntime";

type PlayableAudio = HTMLAudioElement;

let activeWhiteNoise: PlayableAudio | null = null;
let activeWhiteNoisePreset: Exclude<WhiteNoisePreset, "off"> | null = null;

export async function playReminderTone(preset: ReminderTonePreset, volume: number): Promise<void> {
  const audio = createAudio(getReminderToneAudio(preset).src);
  audio.loop = false;
  audio.currentTime = 0;
  audio.volume = normalizeAudioVolume(volume);

  await playSafely(audio);
}

export async function playWhiteNoise(preset: WhiteNoisePreset, volume: number): Promise<void> {
  if (preset === "off") {
    stopWhiteNoise();
    return;
  }

  if (activeWhiteNoise && activeWhiteNoisePreset === preset) {
    activeWhiteNoise.volume = normalizeAudioVolume(volume);
    await playSafely(activeWhiteNoise, preset);
    return;
  }

  stopWhiteNoise();

  activeWhiteNoise = createAudio(getWhiteNoiseAudio(preset).src);
  activeWhiteNoisePreset = preset;
  activeWhiteNoise.loop = true;
  activeWhiteNoise.currentTime = 0;
  activeWhiteNoise.volume = normalizeAudioVolume(volume);

  await playSafely(activeWhiteNoise, preset);
}

export function stopWhiteNoise(): void {
  if (!activeWhiteNoise) {
    syncWhiteNoiseRuntime(false, null);
    return;
  }

  activeWhiteNoise.pause();
  activeWhiteNoise.currentTime = 0;
  activeWhiteNoise = null;
  activeWhiteNoisePreset = null;
  syncWhiteNoiseRuntime(false, null);
}

export function setWhiteNoiseVolume(volume: number): void {
  if (!activeWhiteNoise) return;

  activeWhiteNoise.volume = normalizeAudioVolume(volume);
}

function createAudio(src: string): PlayableAudio {
  return new Audio(src);
}

function normalizeAudioVolume(volume: number): number {
  return Math.min(1, Math.max(0, volume / 100));
}

async function playSafely(
  audio: PlayableAudio,
  preset?: Exclude<WhiteNoisePreset, "off">,
): Promise<void> {
  try {
    await audio.play();
    if (preset) {
      syncWhiteNoiseRuntime(true, preset);
    }
  } catch {
    // Browsers and WebViews can block playback until after user interaction.
    if (preset) {
      syncWhiteNoiseRuntime(false, null);
    }
  }
}
