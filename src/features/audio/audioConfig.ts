import type { ReminderTonePreset, WhiteNoisePreset } from "@/types/settings";

import doraemonTone from "@/assets/audio/哆啦A梦.mp3";
import fireNoise from "@/assets/audio/火焰.mp3";
import pikachuTone from "@/assets/audio/皮卡丘.mp3";
import softTone from "@/assets/audio/轻柔.wav";
import forestNoise from "@/assets/audio/森林.mp3";
import soothingTone from "@/assets/audio/舒缓.mp3";
import streamNoise from "@/assets/audio/溪流.mp3";
import rainNoise from "@/assets/audio/雨声.mp3";

export type AudioAssetConfig = {
  label: string;
  src: string;
};

export const reminderToneAudioConfig: Record<ReminderTonePreset, AudioAssetConfig> = {
  soft: {
    label: "轻柔",
    src: softTone,
  },
  soothing: {
    label: "舒缓",
    src: soothingTone,
  },
  pikachu: {
    label: "皮卡丘",
    src: pikachuTone,
  },
  doraemon: {
    label: "多啦A梦",
    src: doraemonTone,
  },
};

export const whiteNoiseAudioConfig: Record<
  Exclude<WhiteNoisePreset, "off">,
  AudioAssetConfig
> = {
  rain: {
    label: "雷声",
    src: rainNoise,
  },
  forest: {
    label: "森林",
    src: forestNoise,
  },
  stream: {
    label: "溪流",
    src: streamNoise,
  },
  fire: {
    label: "火焰",
    src: fireNoise,
  },
};

export function getReminderToneAudio(preset: ReminderTonePreset): AudioAssetConfig {
  return reminderToneAudioConfig[preset];
}

export function getWhiteNoiseAudio(
  preset: Exclude<WhiteNoisePreset, "off">,
): AudioAssetConfig {
  return whiteNoiseAudioConfig[preset];
}

export function getWhiteNoiseLabel(preset: WhiteNoisePreset): string {
  if (preset === "off") return "关闭";
  return getWhiteNoiseAudio(preset).label;
}
