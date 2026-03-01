interface RiskMeterProps {
  probability: number;
  label?: string;
}

export function RiskMeter({ probability, label = "Bankruptcy Probability" }: RiskMeterProps) {
  const color =
    probability <= 20
      ? "hsl(var(--success))"
      : probability <= 50
      ? "hsl(var(--warning))"
      : "hsl(var(--destructive))";

  return (
    <div className="glass-card p-5 animate-fade-in">
      <p className="text-sm text-muted-foreground mb-3">{label}</p>
      <div className="flex items-end gap-2 mb-3">
        <span className="text-3xl font-bold text-foreground">{probability}%</span>
        <span className="text-xs text-muted-foreground mb-1">risk</span>
      </div>
      <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${probability}%`, backgroundColor: color }}
        />
      </div>
      <div className="flex justify-between mt-1.5">
        <span className="text-[10px] text-muted-foreground">Safe</span>
        <span className="text-[10px] text-muted-foreground">Critical</span>
      </div>
    </div>
  );
}
