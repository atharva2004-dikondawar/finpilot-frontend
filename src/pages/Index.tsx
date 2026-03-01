import { AppLayout } from "@/components/layout/AppLayout";
import { KPICard } from "@/components/dashboard/KPICard";
import { HealthGauge } from "@/components/dashboard/HealthGauge";
import { RiskMeter } from "@/components/dashboard/RiskMeter";
import { RiskBadge } from "@/components/dashboard/RiskBadge";
import { DollarSign, TrendingUp, Clock, Wallet } from "lucide-react";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Area, AreaChart,
} from "recharts";

const revenueExpenseData = [
  { month: "Jul", revenue: 420000, expense: 310000 },
  { month: "Aug", revenue: 460000, expense: 325000 },
  { month: "Sep", revenue: 510000, expense: 340000 },
  { month: "Oct", revenue: 480000, expense: 355000 },
  { month: "Nov", revenue: 530000, expense: 360000 },
  { month: "Dec", revenue: 580000, expense: 375000 },
];

const cashFlowData = [
  { month: "Jul", cashFlow: 85000 },
  { month: "Aug", cashFlow: 110000 },
  { month: "Sep", cashFlow: 145000 },
  { month: "Oct", cashFlow: 98000 },
  { month: "Nov", cashFlow: 135000 },
  { month: "Dec", cashFlow: 170000 },
];

const chartTooltipStyle = {
  contentStyle: {
    backgroundColor: "hsl(222 22% 11%)",
    border: "1px solid hsl(222 15% 18%)",
    borderRadius: "8px",
    fontSize: "12px",
    color: "hsl(210 20% 92%)",
  },
};

const Index = () => {
  return (
    <AppLayout>
      <div className="space-y-6 max-w-[1400px]">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Executive Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Real-time financial intelligence overview</p>
        </div>

        {/* Top row: Gauge + KPIs */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          <div className="lg:col-span-1">
            <HealthGauge score={74} />
          </div>
          <div className="lg:col-span-1">
            <RiskMeter probability={18} />
          </div>
          <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <KPICard
              title="Bank Balance"
              value="$2.4M"
              icon={Wallet}
              variant="primary"
              trend={{ value: "12.5%", positive: true }}
            />
            <KPICard
              title="Monthly Revenue"
              value="$580K"
              icon={DollarSign}
              variant="success"
              trend={{ value: "9.4%", positive: true }}
            />
            <KPICard
              title="Survival Months"
              value="18"
              subtitle="Based on current burn rate"
              icon={Clock}
              variant="default"
            />
          </div>
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Revenue vs Expense */}
          <div className="glass-card p-5 animate-fade-in">
            <h3 className="text-sm font-medium text-foreground mb-4">Revenue vs Expenses</h3>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={revenueExpenseData} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 15% 18%)" />
                <XAxis dataKey="month" tick={{ fill: "hsl(215 15% 55%)", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "hsl(215 15% 55%)", fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
                <Tooltip {...chartTooltipStyle} formatter={(v: number) => [`$${(v / 1000).toFixed(0)}k`]} />
                <Bar dataKey="revenue" fill="hsl(230 70% 65%)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expense" fill="hsl(222 15% 25%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Cash Flow Trend */}
          <div className="glass-card p-5 animate-fade-in">
            <h3 className="text-sm font-medium text-foreground mb-4">Cash Flow Trend</h3>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={cashFlowData}>
                <defs>
                  <linearGradient id="cashGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(152 60% 48%)" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="hsl(152 60% 48%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 15% 18%)" />
                <XAxis dataKey="month" tick={{ fill: "hsl(215 15% 55%)", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "hsl(215 15% 55%)", fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
                <Tooltip {...chartTooltipStyle} formatter={(v: number) => [`$${(v / 1000).toFixed(0)}k`]} />
                <Area type="monotone" dataKey="cashFlow" stroke="hsl(152 60% 48%)" fill="url(#cashGradient)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Risk badges */}
        <div className="glass-card p-5 animate-fade-in">
          <h3 className="text-sm font-medium text-foreground mb-3">Risk Summary</h3>
          <div className="flex flex-wrap gap-3">
            <RiskBadge label="Fraud" level="low" />
            <RiskBadge label="Vendor" level="medium" />
            <RiskBadge label="Department" level="low" />
            <RiskBadge label="Bankruptcy" level="low" />
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Index;
