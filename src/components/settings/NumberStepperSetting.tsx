import { Minus, Plus } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";

type NumberStepperSettingProps = {
  icon?: string;
  label: string;
  suffix?: string;
  value: number;
  min?: number;
  max?: number;
  className?: string;
  compact?: boolean;
  onChange: (value: number) => void;
};

export function NumberStepperSetting({
  icon,
  label,
  suffix,
  value,
  min = 1,
  max,
  className,
  compact = false,
  onChange,
}: NumberStepperSettingProps) {
  const nextValue = (candidate: number) => {
    const clamped = Math.max(min, candidate);
    return typeof max === "number" ? Math.min(max, clamped) : clamped;
  };

  return (
    <div
      aria-label={`${label}设置`}
      className={cn(
        compact
          ? "flex flex-col gap-2"
          : "grid min-h-11 grid-cols-[120px_1fr] items-center gap-4 rounded-[var(--radius-lg)] border border-border bg-background px-4 py-2",
        className,
      )}
      role="group"
    >
      <span className="inline-flex items-center gap-2 text-sm font-semibold">
        {icon ? (
          <img alt="" className="size-5 object-contain" draggable={false} src={icon} />
        ) : null}
        {label}
      </span>
      <div className={cn("flex items-center gap-2", compact ? "justify-start" : "justify-end")}>
        <InputGroup className={cn("bg-card", compact ? "h-12 w-[140px]" : "h-8 w-[112px]")}>
          <InputGroupAddon align="inline-start">
            <InputGroupButton
              aria-label={`减少${label}`}
              onClick={() => onChange(nextValue(value - 1))}
              size="icon-xs"
            >
              <Minus />
            </InputGroupButton>
          </InputGroupAddon>
          <InputGroupInput
            aria-label={label}
            className={cn(
              "px-0 text-center font-bold [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none",
              compact ? "text-base" : "text-sm",
            )}
            min={min}
            max={max}
            onChange={(event) => onChange(nextValue(Number(event.target.value) || min))}
            type="number"
            value={value}
          />
          <InputGroupAddon align="inline-end">
            <InputGroupButton
              aria-label={`增加${label}`}
              onClick={() => onChange(nextValue(value + 1))}
              size="icon-xs"
            >
              <Plus />
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
        {suffix ? (
          <InputGroupText
            className={cn(compact ? "min-w-0 text-sm" : "min-w-14 justify-end text-xs")}
          >
            {suffix}
          </InputGroupText>
        ) : null}
      </div>
    </div>
  );
}
