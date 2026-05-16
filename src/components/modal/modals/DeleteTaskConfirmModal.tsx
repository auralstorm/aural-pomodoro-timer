import { Trash2 } from "lucide-react";

import deleteArt from "@/assets/modal/delete.png";
import { AppDialog } from "@/components/common/AppDialog";

import { ModalActionRow } from "../ModalActionRow";

type DeleteTaskConfirmModalProps = {
  open: boolean;
  onDelete: () => void;
  onCancel: () => void;
  onOpenChange: (open: boolean) => void;
};

export function DeleteTaskConfirmModal({
  open,
  onDelete,
  onCancel,
  onOpenChange,
}: DeleteTaskConfirmModalProps) {
  return (
    <AppDialog
      description="删除后将无法恢复，但已记录的专注历史数据仍然保留。"
      onOpenChange={onOpenChange}
      open={open}
      size="sm"
      title="确定删除这个任务吗？"
    >
      <img
        alt=""
        className="mx-auto mt-2 h-32 w-32 object-contain"
        src={deleteArt}
      />
      <ModalActionRow
        primary={{
          label: "删除任务",
          onClick: onDelete,
          icon: <Trash2 className="size-4" />,
          variant: "danger",
        }}
        secondary={{ label: "取消", onClick: onCancel }}
        className="mt-8"
      />
    </AppDialog>
  );
}
