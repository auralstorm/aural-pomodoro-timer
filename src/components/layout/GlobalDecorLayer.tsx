import { useMemo } from "react";

import { useReducedMotion } from "framer-motion";

import {
  DecorSprite,
  type DecorSpriteAnimation,
  type DecorSpriteKind,
} from "@/components/common/decor/DecorSprite";

type DecorAnchor = {
  id: string;
  kind: DecorSpriteKind;
  animation: DecorSpriteAnimation;
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  baseScale: number;
  opacity: number;
};

const GLOBAL_DECOR_ANCHORS: DecorAnchor[] = [
  {
    id: "top-left-leaf",
    kind: "leaf",
    animation: "leaf",
    top: "10.2%",
    left: "2.4%",
    baseScale: 0.165,
    opacity: 0.84,
  },
  {
    id: "top-left-star",
    kind: "star",
    animation: "star",
    top: "11.8%",
    left: "16.8%",
    baseScale: 0.102,
    opacity: 0.72,
  },
  {
    id: "top-mid-leaf",
    kind: "leaf",
    animation: "leaf",
    top: "10.6%",
    left: "31.8%",
    baseScale: 0.118,
    opacity: 0.76,
  },
  {
    id: "top-right-star",
    kind: "star",
    animation: "star",
    top: "12.4%",
    right: "23.6%",
    baseScale: 0.114,
    opacity: 0.76,
  },
  {
    id: "top-right-bubble",
    kind: "redBubble",
    animation: "float",
    top: "10.9%",
    right: "9.4%",
    baseScale: 0.092,
    opacity: 0.66,
  },
  {
    id: "top-far-right-leaf",
    kind: "leaf",
    animation: "leaf",
    top: "11.3%",
    right: "2.2%",
    baseScale: 0.172,
    opacity: 0.8,
  },
  {
    id: "left-upper-star",
    kind: "star",
    animation: "star",
    top: "28.4%",
    left: "2.8%",
    baseScale: 0.106,
    opacity: 0.72,
  },
  {
    id: "left-mid-red-bubble",
    kind: "redBubble",
    animation: "float",
    top: "43.6%",
    left: "1.8%",
    baseScale: 0.126,
    opacity: 0.68,
  },
  {
    id: "left-lower-star",
    kind: "star",
    animation: "star",
    bottom: "22.6%",
    left: "3.2%",
    baseScale: 0.11,
    opacity: 0.7,
  },
  {
    id: "left-bottom-green",
    kind: "greenBubble",
    animation: "float",
    bottom: "8.8%",
    left: "4.1%",
    baseScale: 0.19,
    opacity: 0.74,
  },
  {
    id: "right-upper-bubble",
    kind: "redBubble",
    animation: "float",
    top: "42.4%",
    right: "2.2%",
    baseScale: 0.122,
    opacity: 0.68,
  },
  {
    id: "right-mid-leaf",
    kind: "leaf",
    animation: "leaf",
    top: "59.4%",
    right: "3.1%",
    baseScale: 0.124,
    opacity: 0.72,
  },
  {
    id: "right-lower-star",
    kind: "star",
    animation: "star",
    bottom: "25.8%",
    right: "2.2%",
    baseScale: 0.112,
    opacity: 0.76,
  },
  {
    id: "right-bottom-green",
    kind: "greenBubble",
    animation: "float",
    bottom: "8.2%",
    right: "2.1%",
    baseScale: 0.194,
    opacity: 0.78,
  },
  {
    id: "bottom-mid-red",
    kind: "redBubble",
    animation: "float",
    bottom: "6.8%",
    left: "49.8%",
    baseScale: 0.11,
    opacity: 0.62,
  },
];

function getDeterministicOffset(seed: string, min: number, max: number) {
  let hash = 0;

  for (let index = 0; index < seed.length; index += 1) {
    hash = (hash * 33 + seed.charCodeAt(index)) >>> 0;
  }

  const normalized = hash / 4294967295;
  return min + (max - min) * normalized;
}

export function GlobalDecorLayer() {
  const reducedMotion = useReducedMotion();
  const spriteInstances = useMemo(
    () =>
      GLOBAL_DECOR_ANCHORS.map((anchor) => {
        const scale = anchor.baseScale + getDeterministicOffset(anchor.id, -0.014, 0.03);
        const opacity = Math.min(
          0.92,
          Math.max(0.5, anchor.opacity + getDeterministicOffset(`${anchor.id}-opacity`, -0.06, 0.06)),
        );
        const translateX = getDeterministicOffset(`${anchor.id}-x`, -14, 14);
        const translateY = getDeterministicOffset(`${anchor.id}-y`, -10, 10);

        return {
          ...anchor,
          opacity,
          scale,
          style: {
            top: anchor.top,
            left: anchor.left,
            right: anchor.right,
            bottom: anchor.bottom,
            transform: `translate(${translateX}px, ${translateY}px)`,
          },
        };
      }),
    [],
  );

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      data-testid="global-decor-layer"
    >
      {spriteInstances.map((sprite) => (
        <DecorSprite
          key={sprite.id}
          animation={sprite.animation}
          kind={sprite.kind}
          opacity={sprite.opacity}
          reducedMotion={Boolean(reducedMotion)}
          scale={sprite.scale}
          style={sprite.style}
        />
      ))}
    </div>
  );
}
