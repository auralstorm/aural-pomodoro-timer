import type { WhiteNoisePreset } from "@/types/settings";

import { useAudioRuntimeStore } from "./audioRuntimeStore";

type ActiveWhiteNoisePreset = Exclude<WhiteNoisePreset, "off">;

export function syncWhiteNoiseRuntime(
  isWhiteNoisePlaying: boolean,
  preset: ActiveWhiteNoisePreset | null,
): void {
  useAudioRuntimeStore.getState().setWhiteNoiseRuntime({
    isWhiteNoisePlaying,
    preset,
  });
}
