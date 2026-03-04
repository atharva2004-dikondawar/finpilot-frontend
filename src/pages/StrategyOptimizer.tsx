import { useEffect, useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Trophy, TrendingUp, TrendingDown, Shield, Clock, BarChart3 } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { getOptimizeStrategy } from "@/api/financialService";

const tt = {
  contentStyle: {
    backgroundColor: "hsl(222 22% 11%)",
    border: "1px solid hsl(222 15% 18%)",
    borderRadius: "8px",
    fontSize: "12px",
    color: "hsl(210 20% 92%)",
  },
};

const StrategyOptimizer = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const result = await getOptimizeStrategy();
        setData(result);
      } catch (err) {
        setError("Cannot reach backend. Make sure FastAPI is running on port 8000.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const best = data?.best_strategy;
  const topStrategies = data?.top_strategies ?? [];

  // Score chart — use top strategies ranked by final_score
  const scoreData = topStrategies.map((s: any, i: number) => ({
    name: `S${i + 1}`,
    score: s.final_score,
    label: `Rev ${s.revenue_change > 0 ? "+" : ""}${s.revenue_change}% / Exp ${s.expense_change > 0 ? "+" : ""}${s.expense_change}%`,
  }));

  return (
    <AppLayout>
      <div className="space-y-6 max-w-[1400px]">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Strategy Optimizer</h1>
          <p className="text-sm text-muted-foreground mt-1">AI-recommended strategies ranked by impact</p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-destructive/15 border border-destructive/30 text-destructive text-sm px-4 py-3 rounded-lg">
            ⚠️ {error}
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="space-y-4 animate-pulse">
            <div className="glow-card h-48 bg-muted/30 rounded-xl" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="glass-card h-64 bg-muted/30 rounded-xl" />
              <div className="glass-card h-64 bg-muted/30 rounded-xl" />
            </div>
          </div>
        ) : data && (
          <>
            {/* Best Strategy Card */}
            <div className="glow-card p-6 animate-fade-in">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-lg bg-primary/15 flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Recommended Strategy</p>
                  <h2 className="text-xl font-bold text-foreground">
                    Revenue {best.revenue_change > 0 ? "+" : ""}{best.revenue_change}% / Expense {best.expense_change > 0 ? "+" : ""}{best.expense_change}%
                  </h2>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                {[
                  {
                    label: "Revenue Change",
                    value: `${best.revenue_change > 0 ? "+" : ""}${best.revenue_change}%`,
                    icon: TrendingUp,
                    color: best.revenue_change >= 0 ? "text-success" : "text-destructive",
                  },
                  {
                    label: "Expense Change",
                    value: `${best.expense_change > 0 ? "+" : ""}${best.expense_change}%`,
                    icon: TrendingDown,
                    color: best.expense_change <= 0 ? "text-success" : "text-destructive",
                  },
                  {
                    label: "Health Score",
                    value: `${best.health_score}`,
                    icon: Shield,
                    color: "text-primary",
                  },
                  {
                    label: "Bankruptcy Risk",
                    value: `${best.bankruptcy_probability}%`,
                    icon: Shield,
                    color: best.bankruptcy_probability <= 20 ? "text-success" : "text-warning",
                  },
                  {
                    label: "Survival",
                    value: `${best.survival_months}mo`,
                    icon: Clock,
                    color: "text-foreground",
                  },
                  {
                    label: "Final Score",
                    value: `${best.final_score}`,
                    icon: BarChart3,
                    color: "text-primary",
                  },
                ].map((item) => (
                  <div key={item.label} className="text-center">
                    <item.icon className={`w-4 h-4 mx-auto mb-1 ${item.color}`} />
                    <p className="text-xs text-muted-foreground">{item.label}</p>
                    <p className={`text-lg font-bold ${item.color}`}>{item.value}</p>
                  </div>
                ))}
              </div>

              {/* Confidence bar */}
              <div className="mt-5">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-muted-foreground">Confidence Score</span>
                  <span className="text-xs text-foreground font-medium">{data.confidence_score?.toFixed(1)}%</span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-1000"
                    style={{ width: `${Math.min(data.confidence_score, 100)}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Strategy Table */}
              <div className="glass-card p-5 animate-fade-in">
                <h3 className="text-sm font-medium text-foreground mb-4">Top Strategies</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left text-xs font-medium text-muted-foreground pb-3">#</th>
                        <th className="text-left text-xs font-medium text-muted-foreground pb-3">Revenue</th>
                        <th className="text-left text-xs font-medium text-muted-foreground pb-3">Expense</th>
                        <th className="text-right text-xs font-medium text-muted-foreground pb-3">Score</th>
                        <th className="text-right text-xs font-medium text-muted-foreground pb-3">Survival</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topStrategies.map((s: any, i: number) => (
                        <tr key={i} className="border-b border-border/50 last:border-0">
                          <td className="py-3 text-sm text-muted-foreground">{i + 1}</td>
                          <td className="py-3 text-sm text-success font-medium">
                            {s.revenue_change > 0 ? "+" : ""}{s.revenue_change}%
                          </td>
                          <td className={`py-3 text-sm font-medium ${s.expense_change <= 0 ? "text-success" : "text-destructive"}`}>
                            {s.expense_change > 0 ? "+" : ""}{s.expense_change}%
                          </td>
                          <td className="py-3 text-sm text-foreground font-medium text-right">{s.final_score}</td>
                          <td className="py-3 text-sm text-muted-foreground text-right">{s.survival_months}mo</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-muted-foreground mt-3">
                  {data.strategies_tested} strategies tested
                </p>
              </div>

              {/* Score chart */}
              <div className="glass-card p-5 animate-fade-in">
                <h3 className="text-sm font-medium text-foreground mb-4">Score Comparison</h3>
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={scoreData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 15% 18%)" />
                    <XAxis dataKey="name" tick={{ fill: "hsl(215 15% 55%)", fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: "hsl(215 15% 55%)", fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 100]} />
                    <Tooltip
                      {...tt}
                      formatter={(v: number, _: string, props: any) => [
                        `Score: ${v}`,
                        props.payload.label,
                      ]}
                    />
                    <Bar dataKey="score" fill="hsl(230 70% 65%)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
};

export default StrategyOptimizer;