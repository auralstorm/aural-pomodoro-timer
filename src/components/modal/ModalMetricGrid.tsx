type ModalMetric = {
  label: string;
  value: string;
  tone?: "primary" | "success" | "warning" | "default";
};

type ModalMetricGridProps = {
  metrics: ModalMetric[];
};

const toneClasses = {
  primary: "text-primary",
  success: "text-[var(--color-success)]",
  warning: "text-[var(--color-warning)]",
  default: "text-foreground",
} as const;

export function ModalMetricGrid({ metrics }: ModalMetricGridProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {metrics.map((metric) => (
        <div
          className="rounded-[20px] border border-border/70 bg-[color-mix(in_srgb,var(--color-tomato-soft)_38%,white)] px-4 py-3"
          key={`${metric.label}-${metric.value}`}
        >
          <p className="text-xs font-medium text-muted-foreground">{metric.label}</p>
          <p className={`mt-1 text-2xl font-black ${toneClasses[metric.tone ?? "default"]}`}>
            {metric.value}
          </p>
        </div>
      ))}
    </div>
  );
}
