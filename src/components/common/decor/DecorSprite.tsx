import type { CSSProperties } from "react";

import { motion } from "framer-motion";

import spriteImage from "@/assets/hero/sprite.png";

export type DecorSpriteKind = "leaf" | "star" | "redBubble" | "greenBubble";
export type DecorSpriteAnimation = "leaf" | "star" | "float";

type DecorSpriteAsset = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type DecorSpriteProps = {
  kind: DecorSpriteKind;
  scale: number;
  className?: string;
  style?: CSSProperties;
  opacity?: number;
  animation: DecorSpriteAnimation;
  reducedMotion?: boolean;
  testId?: string;
};

const SPRITE_SHEET_SIZE = {
  width: 1536,
  height: 1024,
} as const;

const SPRITE_ASSETS: Record<DecorSpriteKind, DecorSpriteAsset> = {
  leaf: {
    x: 159,
    y: 151,
    width: 235,
    height: 251,
  },
  star: {
    x: 1194,
    y: 154,
    width: 233,
    height: 250,
  },
  redBubble: {
    x: 204,
    y: 666,
    width: 199,
    height: 199,
  },
  greenBubble: {
    x: 1232,
    y: 688,
    width: 145,
    height: 130,
  },
};

const animationVariants = {
  leaf: {
    y: [0, -5, 0],
    rotate: [-3, 3, -3],
  },
  star: {
    y: [0, -4, 0],
    scale: [1, 0.5, 1],
    opacity: [0.82, 1, 0.82],
  },
  float: {
    y: [0, -6, 0],
    x: [0, 2, 0],
  },
};

export function DecorSprite({
  kind,
  scale,
  className = "",
  style,
  opacity = 1,
  animation,
  reducedMotion = false,
  testId,
}: DecorSpriteProps) {
  const asset = SPRITE_ASSETS[kind];
  const displayWidth = Math.round(asset.width * scale);
  const displayHeight = Math.round(asset.height * scale);

  return (
    <motion.div
      animate={reducedMotion ? undefined : animationVariants[animation]}
      className={`absolute overflow-hidden ${className}`}
      data-testid={testId}
      style={{
        width: displayWidth,
        height: displayHeight,
        opacity,
        ...style,
      }}
      transition={
        reducedMotion
          ? undefined
          : {
              duration: animation === "star" ? 4.8 : 6.2,
              ease: "easeInOut",
              repeat: Number.POSITIVE_INFINITY,
            }
      }
    >
      <div
        style={{
          width: asset.width,
          height: asset.height,
          backgroundImage: `url(${spriteImage})`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: `-${asset.x}px -${asset.y}px`,
          backgroundSize: `${SPRITE_SHEET_SIZE.width}px ${SPRITE_SHEET_SIZE.height}px`,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          filter: "drop-shadow(0 8px 18px rgba(255, 107, 107, 0.08))",
        }}
      />
    </motion.div>
  );
}
