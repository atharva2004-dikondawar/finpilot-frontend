interface RiskBadgeProps {
  label: string;
  level: "low" | "medium" | "high" | "critical";
}

const levelStyles = {
  low: "bg-success/15 text-success border-success/20",
  medium: "bg-warning/15 text-warning border-warning/20",
  high: "bg-destructive/15 text-destructive border-destructive/20",
  critical: "bg-destructive/20 text-destructive border-destructive/30",
};

const levelLabels = {
  low: "Low",
  medium: "Medium",
  high: "High",
  critical: "Critical",
};

export function RiskBadge({ label, level }: RiskBadgeProps) {
  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium ${levelStyles[level]}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse-slow" />
      {label}: {levelLabels[level]}
    </div>
  );
}
