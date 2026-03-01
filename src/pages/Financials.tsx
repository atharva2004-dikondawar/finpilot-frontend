import { AppLayout } from "@/components/layout/AppLayout";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area,
} from "recharts";
import { Download } from "lucide-react";

const revExpData = [
  { month: "Jan", revenue: 380000, expense: 290000 },
  { month: "Feb", revenue: 400000, expense: 300000 },
  { month: "Mar", revenue: 420000, expense: 310000 },
  { month: "Apr", revenue: 440000, expense: 315000 },
  { month: "May", revenue: 470000, expense: 330000 },
  { month: "Jun", revenue: 510000, expense: 340000 },
  { month: "Jul", revenue: 520000, expense: 345000 },
  { month: "Aug", revenue: 540000, expense: 350000 },
  { month: "Sep", revenue: 560000, expense: 355000 },
  { month: "Oct", revenue: 530000, expense: 360000 },
  { month: "Nov", revenue: 570000, expense: 365000 },
  { month: "Dec", revenue: 600000, expense: 375000 },
];

const profitData = revExpData.map((d) => ({ month: d.month, profit: d.revenue - d.expense }));

const deptData = [
  { name: "Engineering", value: 145000, color: "hsl(230 70% 65%)" },
  { name: "Marketing", value: 85000, color: "hsl(152 60% 48%)" },
  { name: "Sales", value: 65000, color: "hsl(38 92% 55%)" },
  { name: "Operations", value: 50000, color: "hsl(280 60% 60%)" },
  { name: "HR", value: 30000, color: "hsl(205 80% 56%)" },
];

const vendorData = [
  { vendor: "AWS", spend: 48000 },
  { vendor: "Salesforce", spend: 32000 },
  { vendor: "HubSpot", spend: 18000 },
  { vendor: "Datadog", spend: 12000 },
  { vendor: "Slack", spend: 8000 },
];

const accountBalances = [
  { account: "Operating Account", balance: "$1,840,000", type: "Checking" },
  { account: "Payroll Account", balance: "$420,000", type: "Checking" },
  { account: "Reserve Fund", balance: "$650,000", type: "Savings" },
  { account: "Tax Escrow", balance: "$180,000", type: "Escrow" },
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

const Financials = () => {
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
                <YAxis tick={{ fill: "hsl(215 15% 55%)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
                <Tooltip {...tt} formatter={(v: number) => [`$${(v / 1000).toFixed(0)}k`]} />
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
                <YAxis tick={{ fill: "hsl(215 15% 55%)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
                <Tooltip {...tt} formatter={(v: number) => [`$${(v / 1000).toFixed(0)}k`]} />
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
                    <span className="text-foreground font-medium">${(d.value / 1000).toFixed(0)}k</span>
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
                <XAxis type="number" tick={{ fill: "hsl(215 15% 55%)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
                <YAxis type="category" dataKey="vendor" tick={{ fill: "hsl(215 15% 55%)", fontSize: 11 }} axisLine={false} tickLine={false} width={80} />
                <Tooltip {...tt} formatter={(v: number) => [`$${(v / 1000).toFixed(0)}k`]} />
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
      </div>
    </AppLayout>
  );
};

export default Financials;
