import { AppButton } from "@/components/common/AppButton";
import { TaskEditorForm } from "@/components/task/TaskEditorForm";
import type { TaskEditorMode, TaskEditorValues } from "@/components/task/task-editor.types";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

type TaskEditorDrawerProps = {
  open: boolean;
  mode: TaskEditorMode;
  values: TaskEditorValues;
  onOpenChange: (open: boolean) => void;
  onValuesChange: (next: TaskEditorValues) => void;
  onSubmit: () => void;
  onCancel: () => void;
};

export function TaskEditorDrawer({
  open,
  mode,
  values,
  onOpenChange,
  onValuesChange,
  onSubmit,
  onCancel,
}: TaskEditorDrawerProps) {
  const title = mode === "edit" ? "编辑任务" : "新建任务";
  const description =
    mode === "edit" ? "调整任务目标与优先级。" : "拆出一个清晰的小目标，直接开始推进。";

  return (
    <Drawer direction="right" open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="w-[clamp(360px,24vw,420px)] max-w-[30vw] !rounded-l-[10px] border-l border-border bg-card">
        <DrawerHeader className="gap-2 border-b border-border px-8 py-6 text-left">
          <DrawerTitle className="text-[28px] font-black text-foreground">{title}</DrawerTitle>
          <DrawerDescription className="text-sm leading-6 text-muted-foreground">
            {description}
          </DrawerDescription>
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto px-8 py-6">
          <TaskEditorForm onChange={onValuesChange} values={values} />
        </div>

        <DrawerFooter className="border-t border-border px-8 py-5">
          <div className="grid grid-cols-2 gap-3">
            <AppButton onClick={onSubmit}>{mode === "edit" ? "保存任务" : "创建任务"}</AppButton>
            <AppButton onClick={onCancel} variant="ghost">
              取消
            </AppButton>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
