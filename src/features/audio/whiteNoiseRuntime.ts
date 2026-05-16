import type { ActiveWhiteNoisePreset } from "@/types/settings";

import { useAudioRuntimeStore } from "./audioRuntimeStore";

export function syncWhiteNoiseRuntime(
  isWhiteNoisePlaying: boolean,
  preset: ActiveWhiteNoisePreset | null,
): void {
  useAudioRuntimeStore.getState().setWhiteNoiseRuntime({
    isWhiteNoisePlaying,
    preset,
  });
}
