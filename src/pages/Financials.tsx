import { useEffect, useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area,
} from "recharts";
import { Download } from "lucide-react";
import api from "@/api/client";

const DEPT_COLORS = [
  "hsl(230 70% 65%)",
  "hsl(152 60% 48%)",
  "hsl(38 92% 55%)",
  "hsl(280 60% 60%)",
  "hsl(205 80% 56%)",
];

const tt = {
  contentStyle: {
    backgroundColor: "hsl(222 22% 11%)",
    border: "1px solid hsl(222 15% 18%)",
    borderRadius: "8px",
    fontSize: "12px",
    color: "hsl(210 20% 92%)",
  },
};

const formatCurrency = (value: number): string => {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}K`;
  return `$${value}`;
};

const Financials = () => {
  const [snapshot, setSnapshot] = useState<any>(null);
  const [profitLoss, setProfitLoss] = useState<any>(null);
  const [forecast, setForecast] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [snapRes, plRes, forecastRes] = await Promise.all([
          api.get("/financial-snapshot"),
          api.get("/profit-loss"),
          api.get("/forecast"),
        ]);
        setSnapshot(snapRes.data);
        setProfitLoss(plRes.data);
        setForecast(forecastRes.data);
      } catch (err) {
        setError("Cannot reach backend. Make sure FastAPI is running on port 8000.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Build Revenue vs Expense chart data from forecast
  const revExpData = forecast
    ? [
        // history first
        ...forecast.history.months.map((m: string, i: number) => ({
          month: m.slice(5, 7), // "2026-03" -> "03"
          revenue: forecast.history.revenue[i],
          expense: forecast.history.expense[i],
        })),
        // then forecast
        ...forecast.forecast.months.map((m: string, i: number) => ({
          month: m.slice(5, 7),
          revenue: forecast.forecast.revenue[i],
          expense: forecast.forecast.expense[i],
        })),
      ]
    : [];

  const profitData = revExpData.map((d) => ({
    month: d.month,
    profit: d.revenue - d.expense,
  }));

  // Department pie chart data
  const deptData = snapshot
    ? Object.entries(snapshot.department_expenses).map(([name, value], i) => ({
        name,
        value: value as number,
        color: DEPT_COLORS[i % DEPT_COLORS.length],
      }))
    : [];

  // Vendor bar chart data
  const vendorData = snapshot
    ? Object.entries(snapshot.vendor_spending).map(([vendor, spend]) => ({
        vendor,
        spend: spend as number,
      }))
    : [];

  // Account balances from snapshot
  const accountBalances = snapshot
    ? [
        {
          account: "Total Bank Balance",
          balance: formatCurrency(snapshot.bank_balance),
          type: "Operating",
        },
        {
          account: "Total Revenue",
          balance: formatCurrency(snapshot.total_revenue),
          type: "Income",
        },
        {
          account: "Total Expenses",
          balance: formatCurrency(snapshot.total_expense),
          type: "Outgoing",
        },
        {
          account: "Net Profit",
          balance: formatCurrency(snapshot.profit),
          type: "Profit",
        },
      ]
    : [];

  return (
    <AppLayout>
      <div className="space-y-6 max-w-[1400px]">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Financial Overview</h1>
            <p className="text-sm text-muted-foreground mt-1">Comprehensive financial analytics</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary text-secondary-foreground text-sm hover:bg-secondary/80 transition-colors">
            <Download className="w-4 h-4" /> Export
          </button>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="bg-destructive/15 border border-destructive/30 text-destructive text-sm px-4 py-3 rounded-lg">
            ⚠️ {error}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 animate-pulse">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="glass-card h-72 bg-muted/30 rounded-xl" />
            ))}
          </div>
        ) : (
          <>
            {/* Revenue vs Expense + Profit */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="glass-card p-5 animate-fade-in">
                <h3 className="text-sm font-medium text-foreground mb-4">Revenue vs Expenses</h3>
                <ResponsiveContainer width="100%" height={260}>
                  <AreaChart data={revExpData}>
                    <defs>
                      <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="hsl(230 70% 65%)" stopOpacity={0.2} />
                        <stop offset="100%" stopColor="hsl(230 70% 65%)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 15% 18%)" />
                    <XAxis dataKey="month" tick={{ fill: "hsl(215 15% 55%)", fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: "hsl(215 15% 55%)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1_000_000).toFixed(1)}M`} />
                    <Tooltip {...tt} formatter={(v: number) => [formatCurrency(v)]} />
                    <Area type="monotone" dataKey="revenue" stroke="hsl(230 70% 65%)" fill="url(#revGrad)" strokeWidth={2} />
                    <Line type="monotone" dataKey="expense" stroke="hsl(215 15% 45%)" strokeWidth={2} dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="glass-card p-5 animate-fade-in">
                <h3 className="text-sm font-medium text-foreground mb-4">Profit Trend</h3>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={profitData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 15% 18%)" />
                    <XAxis dataKey="month" tick={{ fill: "hsl(215 15% 55%)", fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: "hsl(215 15% 55%)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1_000_000).toFixed(1)}M`} />
                    <Tooltip {...tt} formatter={(v: number) => [formatCurrency(v)]} />
                    <Bar dataKey="profit" fill="hsl(152 60% 48%)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Dept + Vendor */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="glass-card p-5 animate-fade-in">
                <h3 className="text-sm font-medium text-foreground mb-4">Department Expenses</h3>
                <div className="flex items-center gap-8">
                  <ResponsiveContainer width={180} height={180}>
                    <PieChart>
                      <Pie data={deptData} dataKey="value" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3}>
                        {deptData.map((d, i) => (
                          <Cell key={i} fill={d.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-2 flex-1">
                    {deptData.map((d) => (
                      <div key={d.name} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                          <span className="text-muted-foreground">{d.name}</span>
                        </div>
                        <span className="text-foreground font-medium">{formatCurrency(d.value)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="glass-card p-5 animate-fade-in">
                <h3 className="text-sm font-medium text-foreground mb-4">Vendor Spending</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={vendorData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 15% 18%)" horizontal={false} />
                    <XAxis type="number" tick={{ fill: "hsl(215 15% 55%)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                    <YAxis type="category" dataKey="vendor" tick={{ fill: "hsl(215 15% 55%)", fontSize: 11 }} axisLine={false} tickLine={false} width={120} />
                    <Tooltip {...tt} formatter={(v: number) => [formatCurrency(v)]} />
                    <Bar dataKey="spend" fill="hsl(230 70% 65%)" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Account balances */}
            <div className="glass-card p-5 animate-fade-in">
              <h3 className="text-sm font-medium text-foreground mb-4">Account Balances</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left text-xs font-medium text-muted-foreground pb-3">Account</th>
                      <th className="text-left text-xs font-medium text-muted-foreground pb-3">Type</th>
                      <th className="text-right text-xs font-medium text-muted-foreground pb-3">Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {accountBalances.map((a) => (
                      <tr key={a.account} className="border-b border-border/50 last:border-0">
                        <td className="py-3 text-sm text-foreground">{a.account}</td>
                        <td className="py-3 text-sm text-muted-foreground">{a.type}</td>
                        <td className="py-3 text-sm text-foreground font-medium text-right">{a.balance}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
};

export default Financials;