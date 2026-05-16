import type { ReactNode } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

type AppDialogProps = {
  open: boolean;
  title: string;
  description?: string;
  children?: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  contentClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  headerClassName?: string;
  onOpenChange: (open: boolean) => void;
};

const dialogSizeClasses = {
  sm: "max-w-[420px] sm:max-w-[420px]",
  md: "max-w-[520px] sm:max-w-[520px]",
  lg: "max-w-[600px] sm:max-w-[600px]",
  xl: "max-w-[680px] sm:max-w-[680px]",
} as const;

export function AppDialog({
  open,
  title,
  description,
  children,
  size = "md",
  contentClassName,
  titleClassName,
  descriptionClassName,
  headerClassName,
  onOpenChange,
}: AppDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          dialogSizeClasses[size],
          "rounded-[var(--radius-modal)] border-border bg-card p-8 shadow-[var(--shadow-modal)]",
          "[&_[data-slot=dialog-close]]:right-6 [&_[data-slot=dialog-close]]:top-6 [&_[data-slot=dialog-close]>button]:rounded-full [&_[data-slot=dialog-close]>button]:border [&_[data-slot=dialog-close]>button]:border-border [&_[data-slot=dialog-close]>button]:bg-card [&_[data-slot=dialog-close]>button]:text-muted-foreground [&_[data-slot=dialog-close]>button]:shadow-none",
          contentClassName,
        )}
      >
        <DialogHeader className={cn("items-center text-center", headerClassName)}>
          <DialogTitle className={cn("text-2xl font-bold text-foreground", titleClassName)}>
            {title}
          </DialogTitle>
          {description ? (
            <DialogDescription className={cn("text-base leading-7", descriptionClassName)}>
              {description}
            </DialogDescription>
          ) : null}
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}
