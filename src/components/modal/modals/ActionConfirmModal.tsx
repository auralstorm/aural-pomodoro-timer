import { AlertTriangle } from "lucide-react";

import { AppDialog } from "@/components/common/AppDialog";

import { ModalActionRow } from "../ModalActionRow";

type ActionConfirmModalProps = {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel?: string;
  confirmVariant?: "primary" | "danger" | "success";
  onConfirm: () => void;
  onCancel: () => void;
  onOpenChange: (open: boolean) => void;
};

export function ActionConfirmModal({
  open,
  title,
  description,
  confirmLabel,
  cancelLabel = "取消",
  confirmVariant = "primary",
  onConfirm,
  onCancel,
  onOpenChange,
}: ActionConfirmModalProps) {
  return (
    <AppDialog
      description={description}
      onOpenChange={onOpenChange}
      open={open}
      size="sm"
      title={title}
    >
      <div className="mt-2 flex items-center gap-3 rounded-[18px] bg-[var(--color-tomato-soft)] px-4 py-3 text-sm font-medium text-primary">
        <AlertTriangle className="size-4 shrink-0" />
        继续后会立即应用当前操作
      </div>
      <ModalActionRow
        className="mt-8"
        primary={{
          label: confirmLabel,
          onClick: onConfirm,
          variant: confirmVariant,
        }}
        secondary={{
          label: cancelLabel,
          onClick: onCancel,
        }}
      />
    </AppDialog>
  );
}
