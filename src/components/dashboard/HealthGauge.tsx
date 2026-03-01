interface HealthGaugeProps {
  score: number;
  label?: string;
}

export function HealthGauge({ score, label = "Health Score" }: HealthGaugeProps) {
  const circumference = 2 * Math.PI * 54;
  const progress = (score / 100) * circumference;
  const color =
    score >= 70 ? "hsl(var(--success))" : score >= 40 ? "hsl(var(--warning))" : "hsl(var(--destructive))";

  return (
    <div className="glow-card p-6 flex flex-col items-center justify-center animate-fade-in">
      <div className="relative w-36 h-36">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
          <circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth="8"
          />
          <circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - progress}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-foreground">{score}</span>
          <span className="text-xs text-muted-foreground">/100</span>
        </div>
      </div>
      <p className="mt-3 text-sm font-medium text-muted-foreground">{label}</p>
    </div>
  );
}
