import { AppLayout } from "@/components/layout/AppLayout";
import { Trophy, TrendingUp, TrendingDown, Shield, Clock, BarChart3 } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

const bestStrategy = {
  name: "Balanced Growth",
  revenueChange: "+15%",
  expenseChange: "-8%",
  healthImpact: "+22 pts",
  bankruptcyReduction: "-14%",
  survivalMonths: 24,
  confidence: 87,
};

const strategies = [
  { rank: 1, name: "Balanced Growth", score: 92, revenue: "+15%", expense: "-8%", survival: 24 },
  { rank: 2, name: "Aggressive Expansion", score: 78, revenue: "+30%", expense: "+10%", survival: 16 },
  { rank: 3, name: "Cost Optimization", score: 75, revenue: "+5%", expense: "-20%", survival: 28 },
  { rank: 4, name: "Conservative Hold", score: 68, revenue: "0%", expense: "-5%", survival: 20 },
  { rank: 5, name: "Revenue Focus", score: 64, revenue: "+25%", expense: "+5%", survival: 14 },
];

const scoreData = strategies.map((s) => ({ name: s.name.split(" ")[0], score: s.score }));

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
  return (
    <AppLayout>
      <div className="space-y-6 max-w-[1400px]">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Strategy Optimizer</h1>
          <p className="text-sm text-muted-foreground mt-1">AI-recommended strategies ranked by impact</p>
        </div>

        {/* Best Strategy */}
        <div className="glow-card p-6 animate-fade-in">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-lg bg-primary/15 flex items-center justify-center">
              <Trophy className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Recommended Strategy</p>
              <h2 className="text-xl font-bold text-foreground">{bestStrategy.name}</h2>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { label: "Revenue", value: bestStrategy.revenueChange, icon: TrendingUp, color: "text-success" },
              { label: "Expense", value: bestStrategy.expenseChange, icon: TrendingDown, color: "text-success" },
              { label: "Health Impact", value: bestStrategy.healthImpact, icon: Shield, color: "text-primary" },
              { label: "Bankruptcy ↓", value: bestStrategy.bankruptcyReduction, icon: Shield, color: "text-success" },
              { label: "Survival", value: `${bestStrategy.survivalMonths}mo`, icon: Clock, color: "text-foreground" },
              { label: "Confidence", value: `${bestStrategy.confidence}%`, icon: BarChart3, color: "text-primary" },
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
              <span className="text-xs text-foreground font-medium">{bestStrategy.confidence}%</span>
            </div>
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full rounded-full bg-primary transition-all duration-1000" style={{ width: `${bestStrategy.confidence}%` }} />
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
                    <th className="text-left text-xs font-medium text-muted-foreground pb-3">Strategy</th>
                    <th className="text-right text-xs font-medium text-muted-foreground pb-3">Score</th>
                    <th className="text-right text-xs font-medium text-muted-foreground pb-3">Survival</th>
                  </tr>
                </thead>
                <tbody>
                  {strategies.map((s) => (
                    <tr key={s.rank} className="border-b border-border/50 last:border-0">
                      <td className="py-3 text-sm text-muted-foreground">{s.rank}</td>
                      <td className="py-3 text-sm text-foreground">{s.name}</td>
                      <td className="py-3 text-sm text-foreground font-medium text-right">{s.score}</td>
                      <td className="py-3 text-sm text-muted-foreground text-right">{s.survival}mo</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Score chart */}
          <div className="glass-card p-5 animate-fade-in">
            <h3 className="text-sm font-medium text-foreground mb-4">Score Comparison</h3>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={scoreData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 15% 18%)" />
                <XAxis dataKey="name" tick={{ fill: "hsl(215 15% 55%)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "hsl(215 15% 55%)", fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 100]} />
                <Tooltip {...tt} />
                <Bar dataKey="score" fill="hsl(230 70% 65%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default StrategyOptimizer;
