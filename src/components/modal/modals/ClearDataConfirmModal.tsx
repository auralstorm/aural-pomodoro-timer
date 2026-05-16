import { AlertTriangle, Trash2 } from "lucide-react";
import { useState } from "react";

import { AppDialog } from "@/components/common/AppDialog";

import { ModalActionRow } from "../ModalActionRow";

type ClearDataConfirmModalProps = {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  onOpenChange: (open: boolean) => void;
};

export function ClearDataConfirmModal({
  open,
  onConfirm,
  onCancel,
  onOpenChange,
}: ClearDataConfirmModalProps) {
  const [confirmText, setConfirmText] = useState("");
  const canClear = confirmText === "清除";

  return (
    <AppDialog
      description="这将清除所有本地专注记录、任务缓存等数据，此操作不可恢复，请谨慎操作。"
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          setConfirmText("");
        }
        onOpenChange(nextOpen);
      }}
      open={open}
      size="md"
      title="确认清除本地数据？"
    >
      <div className="mt-2 flex flex-col gap-4">
        <div className="flex items-center gap-3 rounded-[18px] bg-[color-mix(in_srgb,var(--color-warning)_15%,white)] px-4 py-3 text-sm font-semibold text-[var(--color-warning)]">
          <AlertTriangle className="size-4 shrink-0" />
          清除后将无法找回历史数据
        </div>
        <input
          className="h-12 rounded-[16px] border border-border bg-background px-4 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
          onChange={(event) => setConfirmText(event.target.value)}
          placeholder="输入“清除”进行确认"
          value={confirmText}
        />
      </div>
      <ModalActionRow
        className="mt-5"
        primary={{
          label: "确认清除",
          onClick: () => {
            setConfirmText("");
            onConfirm();
          },
          icon: <Trash2 className="size-4" />,
          disabled: !canClear,
          variant: "danger",
        }}
        secondary={{
          label: "取消",
          onClick: () => {
            setConfirmText("");
            onCancel();
          },
        }}
      />
    </AppDialog>
  );
}
