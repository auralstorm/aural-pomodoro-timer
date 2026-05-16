import { useEffect, useMemo, useState } from "react";

import { NumberStepperSetting } from "@/components/settings/NumberStepperSetting";
import { PRIORITY_OPTIONS } from "@/constants/task";
import type { TaskEditorValues } from "@/components/task/task-editor.types";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { cn } from "@/lib/utils";

type TaskEditorFormProps = {
  values: TaskEditorValues;
  onChange: (next: TaskEditorValues) => void;
};

export function TaskEditorForm({ values, onChange }: TaskEditorFormProps) {
  const quickPomodoroOptions = useMemo(() => [1, 2, 3, 4], []);
  const isPresetValue = quickPomodoroOptions.includes(values.estimatedPomodoros);
  const [customExpanded, setCustomExpanded] = useState(!isPresetValue);

  useEffect(() => {
    if (!isPresetValue) {
      setCustomExpanded(true);
    }
  }, [isPresetValue]);

  function handleQuickEstimateChange(nextValue: number) {
    setCustomExpanded(false);
    onChange({
      ...values,
      estimatedPomodoros: nextValue,
    });
  }

  function handleCustomEstimateExpand() {
    setCustomExpanded(true);
  }

  function handleCustomEstimateChange(nextValue: string) {
    onChange({
      ...values,
      estimatedPomodoros: Math.max(1, Number(nextValue) || 1),
    });
  }

  return (
    <div className="flex flex-col gap-5">
      <label className="flex flex-col gap-2">
        <span className="text-sm font-bold">任务名称</span>
        <input
          className="h-12 rounded-[var(--radius-md)] border border-border bg-background px-4 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
          onChange={(event) => onChange({ ...values, title: event.target.value })}
          placeholder="例如：阅读《高效能人士的七个习惯》"
          value={values.title}
        />
      </label>

      <label className="flex flex-col gap-2">
        <span className="text-sm font-bold">任务描述</span>
        <textarea
          className="min-h-28 rounded-[var(--radius-md)] border border-border bg-background px-4 py-3 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
          onChange={(event) => onChange({ ...values, description: event.target.value })}
          placeholder="补充任务目标、输出物或上下文"
          value={values.description}
        />
      </label>

      <div className="flex flex-col gap-3">
        <span className="text-sm font-bold">🍅 预计番茄数</span>
        <div className="flex flex-col gap-3">
          <ButtonGroup className="grid w-full grid-cols-5 gap-0 rounded-[var(--radius-md)]">
            {quickPomodoroOptions.map((option) => {
              const isActive = values.estimatedPomodoros === option && !customExpanded;

              return (
                <Button
                  aria-label={`预计 ${option} 个番茄`}
                  aria-pressed={isActive}
                  className={cn(
                    "h-12 rounded-none border text-base font-semibold first:rounded-l-[var(--radius-md)] last:rounded-r-[var(--radius-md)]",
                    isActive
                      ? "bg-[var(--color-tomato-soft)] text-primary"
                      : "bg-background text-muted-foreground",
                  )}
                  key={option}
                  onClick={() => handleQuickEstimateChange(option)}
                  type="button"
                  variant="outline"
                >
                  {option}
                </Button>
              );
            })}
            <Button
              aria-label="切换为自定义预计番茄数"
              aria-pressed={customExpanded}
              className={cn(
                "h-12 rounded-none rounded-r-[var(--radius-md)] border text-sm font-semibold",
                customExpanded
                  ? "bg-[var(--color-tomato-soft)] text-primary"
                  : "border-border bg-background text-muted-foreground",
              )}
              onClick={handleCustomEstimateExpand}
              type="button"
              variant="outline"
            >
              自定义
            </Button>
          </ButtonGroup>

          {customExpanded ? (
            <NumberStepperSetting
              className="w-full"
              label="自定义预计番茄数"
              max={20}
              min={5}
              onChange={(value) => handleCustomEstimateChange(String(value))}
              value={values.estimatedPomodoros}
            />
          ) : null}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-sm font-bold">优先级</span>
        <div className="grid grid-cols-3 gap-2">
          {PRIORITY_OPTIONS.map((option) => (
            <button
              className={cn(
                "h-12 rounded-[var(--radius-md)] border font-semibold transition",
                values.priority === option.value
                  ? "border-primary bg-[var(--color-tomato-soft)] text-primary"
                  : "border-border bg-background text-muted-foreground",
              )}
              key={option.value}
              onClick={() => onChange({ ...values, priority: option.value })}
              type="button"
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
