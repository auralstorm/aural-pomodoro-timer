import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Slot } from "radix-ui";

import { cn } from "@/lib/utils";

type AppButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "success";
type AppButtonSize = "sm" | "md" | "lg" | "icon";

type AppButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: AppButtonVariant;
  size?: AppButtonSize;
  icon?: ReactNode;
  asChild?: boolean;
};

const variantClasses: Record<AppButtonVariant, string> = {
  primary:
    "border-transparent bg-primary text-primary-foreground shadow-[var(--shadow-button)] hover:bg-[var(--color-tomato-deep)]",
  secondary:
    "border-[var(--color-tomato-light)] bg-[var(--color-tomato-soft)] text-primary hover:bg-[var(--color-tomato-light)]",
  ghost:
    "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground",
  danger:
    "border-transparent bg-destructive text-white hover:bg-destructive/90",
  success:
    "border-transparent bg-[var(--color-success)] text-white hover:bg-[color-mix(in_srgb,var(--color-success)_88%,black)]",
};

const sizeClasses: Record<AppButtonSize, string> = {
  sm: "h-9 gap-2 rounded-[var(--radius-md)] px-4 text-sm",
  md: "h-12 gap-2 rounded-[var(--radius-md)] px-6 text-base",
  lg: "h-14 gap-3 rounded-[var(--radius-lg)] px-8 text-lg",
  icon: "size-10 rounded-[var(--radius-md)] p-0",
};

export function AppButton({
  className,
  variant = "primary",
  size = "md",
  icon,
  asChild = false,
  children,
  type = "button",
  ...props
}: AppButtonProps) {
  const Comp = asChild ? Slot.Root : "button";
  const content = asChild ? children : (
    <>
      {icon}
      {children}
    </>
  );

  return (
    <Comp
      className={cn(
        "inline-flex shrink-0 items-center justify-center border font-semibold transition active:translate-y-px disabled:pointer-events-none disabled:opacity-50",
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      type={asChild ? undefined : type}
      {...props}
    >
      {content}
    </Comp>
  );
}
