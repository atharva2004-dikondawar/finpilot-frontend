import { AppLayout } from "@/components/layout/AppLayout";
import { useState } from "react";
import { RiskBadge } from "@/components/dashboard/RiskBadge";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

function generateSimulation(revChange: number, expChange: number, months: number) {
  const baseRevenue = 580000;
  const baseExpense = 375000;
  let balance = 2400000;
  const data = [];
  for (let i = 0; i <= months; i++) {
    const rev = baseRevenue * (1 + revChange / 100);
    const exp = baseExpense * (1 + expChange / 100);
    const net = rev - exp;
    balance += net;
    data.push({ month: `M${i}`, cash: Math.round(balance) });
  }
  const breakEven = data.findIndex((d) => d.cash <= 0);
  const survivalMonths = breakEven === -1 ? months : breakEven;
  const riskLevel: "low" | "medium" | "high" | "critical" =
    survivalMonths > 12 ? "low" : survivalMonths > 6 ? "medium" : survivalMonths > 3 ? "high" : "critical";
  return { data, breakEven, survivalMonths, riskLevel };
}

const tt = {
  contentStyle: {
    backgroundColor: "hsl(222 22% 11%)",
    border: "1px solid hsl(222 15% 18%)",
    borderRadius: "8px",
    fontSize: "12px",
    color: "hsl(210 20% 92%)",
  },
};

const StrategySimulator = () => {
  const [revChange, setRevChange] = useState(10);
  const [expChange, setExpChange] = useState(-5);
  const [months, setMonths] = useState(12);
  const sim = generateSimulation(revChange, expChange, months);

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
              <label className="text-sm text-muted-foreground mb-2 block">Revenue Change: <span className="text-foreground font-medium">{revChange > 0 ? "+" : ""}{revChange}%</span></label>
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
              <label className="text-sm text-muted-foreground mb-2 block">Expense Change: <span className="text-foreground font-medium">{expChange > 0 ? "+" : ""}{expChange}%</span></label>
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
        </div>

        {/* Results */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="glass-card p-5 text-center animate-fade-in">
            <p className="text-sm text-muted-foreground mb-1">Break-even Month</p>
            <p className="text-3xl font-bold text-foreground">{sim.breakEven === -1 ? "None" : `M${sim.breakEven}`}</p>
          </div>
          <div className="glass-card p-5 text-center animate-fade-in">
            <p className="text-sm text-muted-foreground mb-1">Survival Months</p>
            <p className="text-3xl font-bold text-foreground">{sim.survivalMonths}</p>
          </div>
          <div className="glass-card p-5 flex flex-col items-center justify-center animate-fade-in">
            <p className="text-sm text-muted-foreground mb-2">Risk Level</p>
            <RiskBadge label="Risk" level={sim.riskLevel} />
          </div>
        </div>

        {/* Chart */}
        <div className="glass-card p-5 animate-fade-in">
          <h3 className="text-sm font-medium text-foreground mb-4">Simulated Cash Curve</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={sim.data}>
              <defs>
                <linearGradient id="simGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(230 70% 65%)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="hsl(230 70% 65%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 15% 18%)" />
              <XAxis dataKey="month" tick={{ fill: "hsl(215 15% 55%)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "hsl(215 15% 55%)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000000).toFixed(1)}M`} />
              <Tooltip {...tt} formatter={(v: number) => [`$${(v / 1000000).toFixed(2)}M`]} />
              <Area type="monotone" dataKey="cash" stroke="hsl(230 70% 65%)" fill="url(#simGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </AppLayout>
  );
};

export default StrategySimulator;
