import { useEffect, useState, useCallback } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { KPICard } from "@/components/dashboard/KPICard";
import { HealthGauge } from "@/components/dashboard/HealthGauge";
import { RiskMeter } from "@/components/dashboard/RiskMeter";
import { RiskBadge } from "@/components/dashboard/RiskBadge";
import { OnboardingModal } from "@/components/OnboardingModal";
import { DollarSign, Clock, Wallet, TrendingUp } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Area, AreaChart,
} from "recharts";
import {
  getFinancialSnapshot,
  getCompanyHealth,
  getBankruptcyRisk,
} from "@/api/financialService";
import api from "@/api/client";

const chartTooltipStyle = {
  contentStyle: {
    backgroundColor: "hsl(222 22% 11%)",
    border: "1px solid hsl(222 15% 18%)",
    borderRadius: "8px",
    fontSize: "12px",
    color: "hsl(210 20% 92%)",
  },
};

const getRiskLevel = (probability: number): "low" | "medium" | "high" | "critical" => {
  if (probability <= 20) return "low";
  if (probability <= 40) return "medium";
  if (probability <= 70) return "high";
  return "critical";
};

const formatCurrency = (value: number): string => {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}K`;
  return `$${value}`;
};

const Index = () => {
  const [snapshot, setSnapshot] = useState<any>(null);
  const [health, setHealth] = useState<any>(null);
  const [risk, setRisk] = useState<any>(null);
  const [forecast, setForecast] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [companyName, setCompanyName] = useState("Acme Corp");

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [snap, healthData, riskData, forecastData] = await Promise.all([
        getFinancialSnapshot(),
        getCompanyHealth(),
        getBankruptcyRisk(),
        api.get("/forecast").then(r => r.data),
      ]);
      setSnapshot(snap);
      setHealth(healthData);
      setRisk(riskData);
      setForecast(forecastData);
    } catch (err) {
      setError("Cannot reach backend. Make sure FastAPI is running on port 8000.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const isSetup = localStorage.getItem("finpilot_setup");
    const savedName = localStorage.getItem("finpilot_company");
    if (!isSetup) {
      setShowOnboarding(true);
      setLoading(false);
    } else {
      loadData();
    }
    if (savedName) setCompanyName(savedName);
  }, [loadData]);

  const handleOnboardingComplete = (name: string) => {
    setCompanyName(name);
    setShowOnboarding(false);
    loadData();
  };

  // ── Build chart data from real forecast ──
  const buildRevenueExpenseData = () => {
    if (!forecast?.history) return [];
    const months = forecast.history.months ?? [];
    const revenues = forecast.history.revenue ?? [];
    const expenses = forecast.history.expense ?? [];

    // Show last 6 months of history
    const slice = months.slice(-6);
    return slice.map((m: string, i: number) => ({
      month: m.slice(5), // "2025-03" → "03"
      revenue: revenues[months.length - slice.length + i] ?? 0,
      expense: expenses[months.length - slice.length + i] ?? 0,
    }));
  };

  const buildCashFlowData = () => {
    if (!forecast?.history) return [];
    const months = forecast.history.months ?? [];
    const cashFlows = forecast.history.cash_flow ?? [];

    const slice = months.slice(-6);
    return slice.map((m: string, i: number) => ({
      month: m.slice(5),
      cashFlow: cashFlows[months.length - slice.length + i] ?? 0,
    }));
  };

  const revenueExpenseData = buildRevenueExpenseData();
  const cashFlowData = buildCashFlowData();

  return (
    <AppLayout companyName={companyName}>

      {/* Onboarding Modal */}
      {showOnboarding && (
        <OnboardingModal onComplete={handleOnboardingComplete} />
      )}

      <div className="space-y-6 max-w-[1400px]">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Executive Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Real-time financial intelligence overview</p>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="bg-destructive/15 border border-destructive/30 text-destructive text-sm px-4 py-3 rounded-lg">
            ⚠️ {error}
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="space-y-4 animate-pulse">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="glass-card h-36 bg-muted/30 rounded-xl" />
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="glass-card h-72 bg-muted/30 rounded-xl" />
              <div className="glass-card h-72 bg-muted/30 rounded-xl" />
            </div>
          </div>
        ) : !showOnboarding && (
          <>
            {/* Top row */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
              <div className="lg:col-span-1">
                <HealthGauge score={Math.round(health?.health_score ?? 0)} />
              </div>
              <div className="lg:col-span-1">
                <RiskMeter probability={risk?.bankruptcy_probability ?? 0} />
              </div>
              <div className="lg:col-span-3 grid grid-cols-2 sm:grid-cols-4 gap-4">
                <KPICard
                  title="Bank Balance"
                  value={snapshot ? formatCurrency(snapshot.bank_balance) : "—"}
                  icon={Wallet}
                  variant="primary"
                  trend={{ value: "12.5%", positive: true }}
                />
                <KPICard
                  title="Total Expense"
                  value={snapshot ? formatCurrency(snapshot.total_expense) : "—"}
                  icon={DollarSign}
                  variant="warning"
                  trend={{ value: "9.4%", positive: false }}
                />
                <KPICard
                  title="Survival Months"
                  value={risk?.survival_months >= 120 ? "120+" : risk?.survival_months?.toString() ?? "—"}
                  subtitle="Based on current burn rate"
                  icon={Clock}
                  variant="default"
                />
                <KPICard
                  title="Net Profit"
                  value={snapshot ? formatCurrency(snapshot.profit) : "—"}
                  icon={TrendingUp}
                  variant="success"
                  trend={{ value: "8.1%", positive: true }}
                />
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="glass-card p-5 animate-fade-in">
                <h3 className="text-sm font-medium text-foreground mb-4">Revenue vs Expenses</h3>
                {revenueExpenseData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={240}>
                    <BarChart data={revenueExpenseData} barGap={4}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 15% 18%)" />
                      <XAxis dataKey="month" tick={{ fill: "hsl(215 15% 55%)", fontSize: 12 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: "hsl(215 15% 55%)", fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
                      <Tooltip {...chartTooltipStyle} formatter={(v: number) => [`$${(v / 1000).toFixed(0)}k`]} />
                      <Bar dataKey="revenue" name="Revenue" fill="hsl(230 70% 65%)" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="expense" name="Expense" fill="hsl(222 15% 25%)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-60 flex items-center justify-center text-sm text-muted-foreground">
                    No history data yet — add transactions to see chart
                  </div>
                )}
              </div>

              <div className="glass-card p-5 animate-fade-in">
                <h3 className="text-sm font-medium text-foreground mb-4">Cash Flow Trend</h3>
                {cashFlowData.length > 0 ? (
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
                      <YAxis tick={{ fill: "hsl(215 15% 55%)", fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
                      <Tooltip {...chartTooltipStyle} formatter={(v: number) => [`$${(v / 1000).toFixed(0)}k`]} />
                      <Area type="monotone" dataKey="cashFlow" name="Cash Flow" stroke="hsl(152 60% 48%)" fill="url(#cashGradient)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-60 flex items-center justify-center text-sm text-muted-foreground">
                    No history data yet — add transactions to see chart
                  </div>
                )}
              </div>
            </div>

            {/* Risk badges */}
            <div className="glass-card p-5 animate-fade-in">
              <h3 className="text-sm font-medium text-foreground mb-3">Risk Summary</h3>
              <div className="flex flex-wrap gap-3">
                <RiskBadge label="Fraud" level="low" />
                <RiskBadge label="Vendor" level="medium" />
                <RiskBadge label="Department" level="low" />
                <RiskBadge
                  label="Bankruptcy"
                  level={risk ? getRiskLevel(risk.bankruptcy_probability) : "low"}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
};

export default Index;