import type { ReactNode } from "react";

import { AppButton } from "@/components/common/AppButton";
import { cn } from "@/lib/utils";

type ActionVariant = "primary" | "danger" | "success";

type ModalAction = {
  label: string;
  onClick: () => void;
  icon?: ReactNode;
  disabled?: boolean;
  variant?: ActionVariant;
};

type ModalActionRowProps = {
  primary: ModalAction;
  secondary?: Omit<ModalAction, "variant">;
  className?: string;
};

export function ModalActionRow({ primary, secondary, className }: ModalActionRowProps) {
  return (
    <div className={cn("mt-6 grid grid-cols-2 gap-3", className)}>
      <AppButton
        className="w-full"
        disabled={primary.disabled}
        icon={primary.icon}
        onClick={primary.onClick}
        variant={primary.variant ?? "primary"}
      >
        {primary.label}
      </AppButton>
      {secondary ? (
        <AppButton
          className="w-full"
          disabled={secondary.disabled}
          icon={secondary.icon}
          onClick={secondary.onClick}
          variant="ghost"
        >
          {secondary.label}
        </AppButton>
      ) : (
        <div />
      )}
    </div>
  );
}
