import { RollingNumber } from "@/components/common/RollingNumber";

export function StatCardIcon({ src }: { src: string }) {
  return <img alt="" className={`size-16 object-contain`} draggable={false} src={src} />;
}

export function AnimatedStatValue({
  value,
  unit,
  decimalPlaces,
}: {
  value: number | string;
  unit: string;
  decimalPlaces?: number;
}) {
  return (
    <span className="inline-flex gap-1 leading-none">
      <RollingNumber
        aria-label={`${value}${unit}`}
        className="leading-none"
        decimalPlaces={decimalPlaces}
        value={value}
      />
      <span className="leading-none">{unit}</span>
    </span>
  );
}

export function LegendRow({
  color,
  label,
  value,
}: {
  color: string;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3 text-sm">
      <span className="inline-flex min-w-0 items-center gap-2 text-foreground">
        <i className="size-2.5 rounded-full" style={{ backgroundColor: color }} />
        <span className="truncate">{label}</span>
      </span>
      <strong className="shrink-0 font-bold text-foreground">{value}</strong>
    </div>
  );
}
