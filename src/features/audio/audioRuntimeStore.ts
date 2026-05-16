import { create } from "zustand";

import type { WhiteNoisePreset } from "@/types/settings";

type ActiveWhiteNoisePreset = Exclude<WhiteNoisePreset, "off">;

type AudioRuntimeStore = {
  activeWhiteNoisePreset: ActiveWhiteNoisePreset | null;
  isWhiteNoisePlaying: boolean;
  setWhiteNoiseRuntime: (payload: {
    isWhiteNoisePlaying: boolean;
    preset: ActiveWhiteNoisePreset | null;
  }) => void;
};

export const useAudioRuntimeStore = create<AudioRuntimeStore>()((set) => ({
  activeWhiteNoisePreset: null,
  isWhiteNoisePlaying: false,
  setWhiteNoiseRuntime: ({ isWhiteNoisePlaying, preset }) =>
    set({
      activeWhiteNoisePreset: preset,
      isWhiteNoisePlaying,
    }),
}));
