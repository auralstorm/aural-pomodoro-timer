import { Switch } from "@/components/ui/switch";

type SettingSwitchRowProps = {
  label: string;
  description: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
};

export function SettingSwitchRow({
  label,
  description,
  checked,
  onCheckedChange,
}: SettingSwitchRowProps) {
  return (
    <div className="grid min-h-10 grid-cols-[1fr_auto] items-center gap-4 border-b border-border/70 py-2 last:border-b-0">
      <div className="min-w-0">
        <p className="text-sm font-semibold text-foreground">
          {label} <span className="ml-5 truncate text-xs text-muted-foreground">{description}</span>
        </p>
      </div>
      <Switch aria-label={label} checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
}
