import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useRef } from "react";

import { cn } from "@/lib/utils";

const DEFAULT_DURATION = 0.26;
const DEFAULT_STAGGER = 0.025;
const DIGIT_STACK = Array.from({ length: 20 }, (_, index) => index % 10);
const EASING: [number, number, number, number] = [0.22, 1, 0.36, 1];

type RollingNumberDirection = "auto" | "up" | "down";

type RollingNumberProps = {
  value: number | string;
  className?: string;
  digitClassName?: string;
  glyphClassName?: string;
  duration?: number;
  stagger?: number;
  animateOnMount?: boolean;
  animateOnChange?: boolean;
  padStart?: number;
  decimalPlaces?: number;
  direction?: RollingNumberDirection;
  "aria-label"?: string;
};

type DigitSlot = {
  type: "digit";
  char: string;
  digit: number;
  previousDigit: number;
  digitOrder: number;
};

type GlyphSlot = {
  type: "glyph";
  char: string;
};

type RollingSlot = DigitSlot | GlyphSlot;

export type { RollingNumberProps };

export function RollingNumber({
  value,
  className,
  digitClassName,
  glyphClassName,
  duration = DEFAULT_DURATION,
  stagger = DEFAULT_STAGGER,
  animateOnMount = true,
  animateOnChange = true,
  padStart,
  decimalPlaces,
  direction = "auto",
  "aria-label": ariaLabel,
}: RollingNumberProps) {
  const prefersReducedMotion = useReducedMotion();
  const formattedValue = useMemo(
    () => formatRollingValue(value, { decimalPlaces, padStart }),
    [decimalPlaces, padStart, value],
  );
  const numericValue = useMemo(() => normalizeNumericValue(value), [value]);

  const hasMountedRef = useRef(false);
  const previousFormattedRef = useRef(formattedValue);
  const previousNumericRef = useRef(numericValue);

  const isMountAnimation = !hasMountedRef.current && animateOnMount;
  const isValueChanged = hasMountedRef.current && previousFormattedRef.current !== formattedValue;
  const shouldAnimate =
    !prefersReducedMotion && (isMountAnimation || (isValueChanged && animateOnChange));

  const resolvedDirection = useMemo<Exclude<RollingNumberDirection, "auto">>(() => {
    if (direction !== "auto") {
      return direction;
    }

    const previous = hasMountedRef.current ? previousNumericRef.current : 0;
    const current = numericValue;

    if (current < previous) {
      return "down";
    }

    return "up";
  }, [direction, numericValue]);

  const slots = useMemo<RollingSlot[]>(() => {
    const digitCount = countDigits(formattedValue);
    const previousDigits = isMountAnimation
      ? Array.from({ length: digitCount }, () => 0)
      : extractDigits(previousFormattedRef.current);

    return buildSlots(formattedValue, previousDigits);
  }, [formattedValue, isMountAnimation]);

  useEffect(() => {
    hasMountedRef.current = true;
    previousFormattedRef.current = formattedValue;
    previousNumericRef.current = numericValue;
  }, [formattedValue, numericValue]);

  return (
    <span
      aria-label={ariaLabel ?? formattedValue}
      className={cn("inline-flex items-baseline tabular-nums", className)}
      role="text"
    >
      {slots.map((slot) =>
        slot.type === "digit" ? (
          <RollingDigitColumn
            key={`${slot.digitOrder}-${slot.previousDigit}-${slot.digit}-${resolvedDirection}-${shouldAnimate ? "motion" : "static"}`}
            delay={slot.digitOrder * stagger}
            digit={slot.digit}
            direction={resolvedDirection}
            duration={duration}
            previousDigit={slot.previousDigit}
            shouldAnimate={shouldAnimate}
            className={digitClassName}
          />
        ) : (
          <RollingGlyph key={`${slot.char}-${formattedValue}`} className={glyphClassName}>
            {slot.char}
          </RollingGlyph>
        ),
      )}
    </span>
  );
}

function RollingDigitColumn({
  digit,
  previousDigit,
  shouldAnimate,
  duration,
  delay,
  direction,
  className,
}: {
  digit: number;
  previousDigit: number;
  shouldAnimate: boolean;
  duration: number;
  delay: number;
  direction: "up" | "down";
  className?: string;
}) {
  const { fromIndex, toIndex } = getDigitWindow(previousDigit, digit, direction, shouldAnimate);
  const targetY = `-${toIndex}em`;
  const initialY = `-${fromIndex}em`;

  return (
    <span
      aria-hidden="true"
      className={cn(
        "relative inline-flex h-[1em] w-[0.68em] overflow-hidden leading-none align-baseline tabular-nums",
        className,
      )}
    >
      <motion.span
        animate={{ y: targetY }}
        className="absolute left-0 top-0 flex w-full flex-col will-change-transform"
        initial={{ y: shouldAnimate ? initialY : targetY }}
        transition={shouldAnimate ? { delay, duration, ease: EASING } : { duration: 0 }}
      >
        {DIGIT_STACK.map((stackDigit, index) => (
          <span key={`${stackDigit}-${index}`} className="flex h-[1em] items-center justify-center">
            {stackDigit}
          </span>
        ))}
      </motion.span>
    </span>
  );
}

function RollingGlyph({ children, className }: { children: string; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-flex h-[1em] items-center justify-center leading-none align-baseline",
        getGlyphWidthClassName(children),
        className,
      )}
    >
      {children}
    </span>
  );
}

function getGlyphWidthClassName(char: string) {
  switch (char) {
    case ".":
      return "w-[0.28em]";
    case ",":
      return "w-[0.3em]";
    case "-":
      return "w-[0.42em]";
    default:
      return "w-[0.4em]";
  }
}

function buildSlots(value: string, previousDigits: number[]): RollingSlot[] {
  const digits = value.split("");
  let nextDigitIndex = previousDigits.length - 1;
  let digitOrder = 0;

  return digits.map<RollingSlot>((char) => {
    if (!isDigit(char)) {
      return { type: "glyph", char };
    }

    const previousDigit = nextDigitIndex >= 0 ? previousDigits[nextDigitIndex] : 0;
    nextDigitIndex -= 1;

    return {
      type: "digit",
      char,
      digit: Number(char),
      previousDigit,
      digitOrder: digitOrder++,
    };
  });
}

function getDigitWindow(
  previousDigit: number,
  nextDigit: number,
  direction: "up" | "down",
  shouldAnimate: boolean,
) {
  if (!shouldAnimate || previousDigit === nextDigit) {
    return { fromIndex: nextDigit, toIndex: nextDigit };
  }

  if (direction === "down") {
    return {
      fromIndex: previousDigit + 10,
      toIndex: nextDigit,
    };
  }

  return {
    fromIndex: previousDigit,
    toIndex: nextDigit >= previousDigit ? nextDigit : nextDigit + 10,
  };
}

function formatRollingValue(
  value: number | string,
  {
    decimalPlaces,
    padStart,
  }: {
    decimalPlaces?: number;
    padStart?: number;
  },
) {
  const normalized =
    typeof value === "number" ? formatNumberValue(value, decimalPlaces) : String(value);

  if (!padStart || padStart <= 0) {
    return normalized;
  }

  const sign = normalized.startsWith("-") ? "-" : "";
  const unsignedValue = sign ? normalized.slice(1) : normalized;
  const [integerPart, decimalPart] = unsignedValue.split(".");
  const paddedInteger = integerPart.padStart(padStart, "0");

  return `${sign}${decimalPart === undefined ? paddedInteger : `${paddedInteger}.${decimalPart}`}`;
}

function formatNumberValue(value: number, decimalPlaces?: number) {
  if (Number.isNaN(value)) {
    if (typeof console !== "undefined" && typeof console.warn === "function") {
      console.warn("[RollingNumber] Received NaN value. Falling back to 0.");
    }

    return decimalPlaces !== undefined ? (0).toFixed(decimalPlaces) : "0";
  }

  return decimalPlaces !== undefined ? value.toFixed(decimalPlaces) : String(value);
}

function normalizeNumericValue(value: number | string) {
  if (typeof value === "number") {
    return Number.isNaN(value) ? 0 : value;
  }

  const parsedValue = Number(value.replace(/,/g, ""));
  return Number.isNaN(parsedValue) ? 0 : parsedValue;
}

function countDigits(value: string) {
  return value.split("").filter(isDigit).length;
}

function extractDigits(value: string) {
  return value.split("").filter(isDigit).map(Number);
}

function isDigit(char: string) {
  return /^\d$/.test(char);
}
