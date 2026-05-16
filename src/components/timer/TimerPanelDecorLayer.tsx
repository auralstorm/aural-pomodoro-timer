import { useReducedMotion } from "framer-motion";

import focusImage from "@/assets/illustrations/illus-focus-session.png";
import {
  DecorSprite,
  type DecorSpriteAnimation,
  type DecorSpriteKind,
} from "@/components/common/decor/DecorSprite";

type TimerDecorSpriteConfig = {
  id: string;
  kind: DecorSpriteKind;
  scale: number;
  className: string;
  opacity?: number;
  animation: DecorSpriteAnimation;
};

const sprites: TimerDecorSpriteConfig[] = [
  {
    id: "leaf-top-left",
    kind: "leaf",
    scale: 0.16,
    className: "left-[56px] top-[44px]",
    opacity: 0.82,
    animation: "leaf",
  },
  {
    id: "star-top-right",
    kind: "star",
    scale: 0.15,
    className: "right-[116px] top-[50px]",
    opacity: 0.9,
    animation: "star",
  },
  {
    id: "star-red-mid-left",
    kind: "star",
    scale: 0.1,
    className: "left-[80px] top-[240px]",
    opacity: 0.64,
    animation: "star",
  },
  {
    id: "circle-red-bottom-left",
    kind: "redBubble",
    scale: 0.22,
    className: "left-[18px] bottom-[162px]",
    opacity: 0.72,
    animation: "float",
  },
  {
    id: "circle-green-bottom-right",
    kind: "greenBubble",
    scale: 0.26,
    className: "right-[72px] bottom-[118px]",
    opacity: 0.8,
    animation: "float",
  },
  {
    id: "circle-red-top-right",
    kind: "redBubble",
    scale: 0.15,
    className: "right-[80px] top-[162px]",
    opacity: 0.72,
    animation: "float",
  },
];

export function TimerPanelDecorLayer() {
  const reducedMotion = useReducedMotion();

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]"
      data-testid="timer-panel-decor"
    >
      {sprites.map((sprite) => (
        <DecorSprite
          key={sprite.id}
          className={sprite.className}
          testId={`timer-panel-sprite-${sprite.id}`}
          {...sprite}
          reducedMotion={Boolean(reducedMotion)}
        />
      ))}

      <img
        alt=""
        className="absolute top-[35%] right-[2%] w-[250px] hidden xl:block"
        src={focusImage}
      />
    </div>
  );
}
