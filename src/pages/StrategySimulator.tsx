import { AppLayout } from "@/components/layout/AppLayout";
import { useState, useCallback } from "react";
import { RiskBadge } from "@/components/dashboard/RiskBadge";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import api from "@/api/client";

const tt = {
  contentStyle: {
    backgroundColor: "hsl(222 22% 11%)",
    border: "1px solid hsl(222 15% 18%)",
    borderRadius: "8px",
    fontSize: "12px",
    color: "hsl(210 20% 92%)",
  },
};

const getRiskLevel = (riskStr: string): "low" | "medium" | "high" | "critical" => {
  switch (riskStr?.toUpperCase()) {
    case "SAFE": return "low";
    case "LOW": return "low";
    case "MEDIUM": return "medium";
    case "HIGH": return "high";
    case "CRITICAL": return "critical";
    default: return "medium";
  }
};

const StrategySimulator = () => {
  const [revChange, setRevChange] = useState(10);
  const [expChange, setExpChange] = useState(-5);
  const [months, setMonths] = useState(12);
  const [simResult, setSimResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasRun, setHasRun] = useState(false);

  const runSimulation = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/simulate", {
        params: {
          revenue_change: revChange,
          expense_change: expChange,
          months,
        },
      });
      setSimResult(res.data);
      setHasRun(true);
    } catch (err) {
      setError("Simulation failed. Make sure FastAPI is running on port 8000.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [revChange, expChange, months]);

  // Build chart data from simulated_cash array
  const chartData = simResult
    ? simResult.simulated_cash.map((cash: number, i: number) => ({
        month: `M${i + 1}`,
        cash: Math.round(cash),
      }))
    : [];

  const riskLevel = simResult ? getRiskLevel(simResult.risk_level) : "medium";
  const breakEvenMonth = simResult?.break_even_month;
  const survivalMonths = simResult?.cash_runway_months;

  return (
    <AppLayout>
      <div className="space-y-6 max-w-[1400px]">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Strategy Simulator</h1>
          <p className="text-sm text-muted-foreground mt-1">Model financial scenarios and assess impact</p>
        </div>

        {/* Controls */}
        <div className="glass-card p-6 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">
                Revenue Change: <span className="text-foreground font-medium">{revChange > 0 ? "+" : ""}{revChange}%</span>
              </label>
              <input
                type="range" min={-20} max={40} value={revChange}
                onChange={(e) => setRevChange(Number(e.target.value))}
                className="w-full h-1.5 bg-muted rounded-full appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                <span>-20%</span><span>+40%</span>
              </div>
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">
                Expense Change: <span className="text-foreground font-medium">{expChange > 0 ? "+" : ""}{expChange}%</span>
              </label>
              <input
                type="range" min={-40} max={20} value={expChange}
                onChange={(e) => setExpChange(Number(e.target.value))}
                className="w-full h-1.5 bg-muted rounded-full appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                <span>-40%</span><span>+20%</span>
              </div>
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Forecast Months</label>
              <input
                type="number" min={3} max={36} value={months}
                onChange={(e) => setMonths(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          {/* Run Button */}
          <div className="mt-6 flex justify-end">
            <button
              onClick={runSimulation}
              disabled={loading}
              className="px-6 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Running..." : "Run Simulation"}
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-destructive/15 border border-destructive/30 text-destructive text-sm px-4 py-3 rounded-lg">
            ⚠️ {error}
          </div>
        )}

        {/* Prompt to run */}
        {!hasRun && !loading && (
          <div className="glass-card p-8 text-center animate-fade-in">
            <p className="text-muted-foreground text-sm">Adjust the sliders above and click <span className="text-foreground font-medium">Run Simulation</span> to see results.</p>
          </div>
        )}

        {/* Results */}
        {hasRun && simResult && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="glass-card p-5 text-center animate-fade-in">
                <p className="text-sm text-muted-foreground mb-1">Break-even</p>
                <p className="text-xl font-bold text-foreground">
                  {breakEvenMonth === 1 ? "Already profitable" : breakEvenMonth ? `Month ${breakEvenMonth}` : "Never"}
                </p>
              </div>
              <div className="glass-card p-5 text-center animate-fade-in">
                <p className="text-sm text-muted-foreground mb-1">Cash Runway</p>
                <p className="text-xl font-bold text-foreground">
                  {survivalMonths >= 120 ? "120+ mo" : `${survivalMonths} mo`}
                </p>
              </div>
              <div className="glass-card p-5 text-center animate-fade-in">
                <p className="text-sm text-muted-foreground mb-1">Cash Change</p>
                <p className={`text-xl font-bold ${
                  (simResult?.cash_change_pct ?? 0) >= 0 ? "text-success" : "text-destructive"
                }`}>
                  {simResult?.cash_change_pct >= 0 ? "+" : ""}{simResult?.cash_change_pct?.toFixed(1)}%
                </p>
              </div>
              <div className="glass-card p-5 flex flex-col items-center justify-center animate-fade-in">
                <p className="text-sm text-muted-foreground mb-2">Risk Level</p>
                <RiskBadge label="Risk" level={riskLevel} />
              </div>
            </div>

            {/* Chart */}
            <div className="glass-card p-5 animate-fade-in">
              <h3 className="text-sm font-medium text-foreground mb-4">Simulated Cash Curve</h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="simGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(230 70% 65%)" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="hsl(230 70% 65%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 15% 18%)" />
                  <XAxis dataKey="month" tick={{ fill: "hsl(215 15% 55%)", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "hsl(215 15% 55%)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1_000_000).toFixed(1)}M`} />
                  <Tooltip {...tt} formatter={(v: number) => [`$${(v / 1_000_000).toFixed(2)}M`]} />
                  <Area type="monotone" dataKey="cash" stroke="hsl(230 70% 65%)" fill="url(#simGrad)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
};

export default StrategySimulator;