import { useEffect, useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { RiskMeter } from "@/components/dashboard/RiskMeter";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
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

const riskLevelStyle = (level: string) => {
  switch (level?.toUpperCase()) {
    case "LOW":    return "bg-success/15 text-success";
    case "MEDIUM": return "bg-warning/15 text-warning";
    case "HIGH":   return "bg-destructive/15 text-destructive";
    default:       return "bg-muted text-muted-foreground";
  }
};

const riskScoreStyle = (score: number) =>
  score <= 30
    ? "bg-success/20 text-success"
    : score <= 60
    ? "bg-warning/20 text-warning"
    : "bg-destructive/20 text-destructive";

const formatCurrency = (value: number): string => {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}K`;
  return `$${value}`;
};

const RiskIntelligence = () => {
  const [bankruptcyRisk, setBankruptcyRisk] = useState<any>(null);
  const [fraudTrend, setFraudTrend] = useState<any>(null);
  const [vendorRisk, setVendorRisk] = useState<any[]>([]);
  const [deptRisk, setDeptRisk] = useState<any[]>([]);
  const [suspiciousTx, setSuspiciousTx] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [bankruptcyRes, fraudRes, vendorRes, deptRes, suspiciousRes] = await Promise.all([
          api.get("/bankruptcy-risk"),
          api.get("/fraud-trend"),
          api.get("/vendor-risk"),
          api.get("/department-risk"),
          api.get("/suspicious-transactions"),
        ]);
        setBankruptcyRisk(bankruptcyRes.data);
        setFraudTrend(fraudRes.data);
        setVendorRisk(vendorRes.data);
        setDeptRisk(deptRes.data);
        setSuspiciousTx(suspiciousRes.data);
      } catch (err) {
        setError("Cannot reach backend. Make sure FastAPI is running on port 8000.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Fraud trend — backend returns totals, build a single-point chart
  // If you later add time-series data to /fraud-trend, this will auto-update
  const fraudChartData = fraudTrend
    ? [
        { label: "Transactions Scored", value: fraudTrend.total_transactions_scored },
        { label: "High Risk", value: fraudTrend.high_risk_transactions },
      ]
    : [];

  return (
    <AppLayout>
      <div className="space-y-6 max-w-[1400px]">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Risk Intelligence</h1>
          <p className="text-sm text-muted-foreground mt-1">Comprehensive risk monitoring and assessment</p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-destructive/15 border border-destructive/30 text-destructive text-sm px-4 py-3 rounded-lg">
            ⚠️ {error}
          </div>
        )}

        {loading ? (
          <div className="space-y-4 animate-pulse">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="glass-card h-40 bg-muted/30 rounded-xl" />
              ))}
            </div>
          </div>
        ) : (
          <>
            {/* Top row — Risk Meter + Fraud Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <RiskMeter probability={bankruptcyRisk?.bankruptcy_probability ?? 0} />

              {/* Fraud Summary Card */}
              <div className="glass-card p-5 animate-fade-in">
                <h3 className="text-sm font-medium text-foreground mb-4">Fraud Detection Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Transactions Scored</span>
                    <span className="text-sm font-medium text-foreground">
                      {fraudTrend?.total_transactions_scored ?? 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">High Risk Transactions</span>
                    <span className="text-sm font-medium text-destructive">
                      {fraudTrend?.high_risk_transactions ?? 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Fraud Rate</span>
                    <span className={`text-sm font-medium ${
                      (fraudTrend?.fraud_rate ?? 0) === 0 ? "text-success" : "text-destructive"
                    }`}>
                      {((fraudTrend?.fraud_rate ?? 0) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Survival Months</span>
                    <span className="text-sm font-medium text-foreground">
                      {bankruptcyRisk?.survival_months ?? 0}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bankruptcy Risk Level Card */}
              <div className="glass-card p-5 animate-fade-in">
                <h3 className="text-sm font-medium text-foreground mb-4">Bankruptcy Risk</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Risk Level</span>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${riskLevelStyle(bankruptcyRisk?.risk_level)}`}>
                      {bankruptcyRisk?.risk_level ?? "—"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Probability</span>
                    <span className="text-sm font-medium text-foreground">
                      {bankruptcyRisk?.bankruptcy_probability ?? 0}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden mt-2">
                    <div
                      className="h-full rounded-full transition-all duration-1000"
                      style={{
                        width: `${bankruptcyRisk?.bankruptcy_probability ?? 0}%`,
                        backgroundColor:
                          (bankruptcyRisk?.bankruptcy_probability ?? 0) <= 20
                            ? "hsl(152 60% 48%)"
                            : (bankruptcyRisk?.bankruptcy_probability ?? 0) <= 50
                            ? "hsl(38 92% 55%)"
                            : "hsl(0 72% 55%)",
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Vendor + Department Risk */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Vendor Risk Table */}
              <div className="glass-card p-5 animate-fade-in">
                <h3 className="text-sm font-medium text-foreground mb-4">Vendor Risk Ranking</h3>
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left text-xs font-medium text-muted-foreground pb-3">Vendor</th>
                      <th className="text-right text-xs font-medium text-muted-foreground pb-3">Risk Score</th>
                      <th className="text-right text-xs font-medium text-muted-foreground pb-3">Level</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vendorRisk.map((v: any) => (
                      <tr key={v.vendor} className="border-b border-border/50 last:border-0">
                        <td className="py-3 text-sm text-foreground">{v.vendor}</td>
                        <td className="py-3 text-sm text-muted-foreground text-right">
                          {v.risk_score.toFixed(1)}
                        </td>
                        <td className="py-3 text-right">
                          <span className={`text-xs font-medium px-2 py-1 rounded-full ${riskLevelStyle(v.risk_level)}`}>
                            {v.risk_level}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Department Risk Heatmap */}
              <div className="glass-card p-5 animate-fade-in">
                <h3 className="text-sm font-medium text-foreground mb-4">Department Risk Heatmap</h3>
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left text-xs font-medium text-muted-foreground pb-3">Department</th>
                      <th className="text-center text-xs font-medium text-muted-foreground pb-3">Risk Score</th>
                      <th className="text-center text-xs font-medium text-muted-foreground pb-3">Fraud Ratio</th>
                      <th className="text-right text-xs font-medium text-muted-foreground pb-3">Level</th>
                    </tr>
                  </thead>
                  <tbody>
                    {deptRisk.map((d: any) => (
                      <tr key={d.department} className="border-b border-border/50 last:border-0">
                        <td className="py-3 text-sm text-foreground">{d.department}</td>
                        <td className="py-3 text-center">
                          <span className={`inline-block text-xs font-medium px-2 py-1 rounded ${riskScoreStyle(d.risk_score)}`}>
                            {d.risk_score.toFixed(1)}
                          </span>
                        </td>
                        <td className="py-3 text-center text-sm text-muted-foreground">
                          {(d.fraud_ratio * 100).toFixed(1)}%
                        </td>
                        <td className="py-3 text-right">
                          <span className={`text-xs font-medium px-2 py-1 rounded-full ${riskLevelStyle(d.risk_level)}`}>
                            {d.risk_level}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Suspicious Transactions */}
            <div className="glass-card p-5 animate-fade-in">
              <h3 className="text-sm font-medium text-foreground mb-4">Suspicious Transactions</h3>
              {suspiciousTx.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-success text-sm font-medium">✓ No suspicious transactions detected</p>
                  <p className="text-muted-foreground text-xs mt-1">All transactions are within normal parameters</p>
                </div>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left text-xs font-medium text-muted-foreground pb-3">ID</th>
                      <th className="text-left text-xs font-medium text-muted-foreground pb-3">Amount</th>
                      <th className="text-left text-xs font-medium text-muted-foreground pb-3">Department</th>
                      <th className="text-right text-xs font-medium text-muted-foreground pb-3">Risk Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {suspiciousTx.map((tx: any, i: number) => (
                      <tr key={i} className="border-b border-border/50 last:border-0">
                        <td className="py-3 text-sm text-muted-foreground">{tx.id ?? `TX-${i + 1}`}</td>
                        <td className="py-3 text-sm text-foreground">{formatCurrency(tx.amount)}</td>
                        <td className="py-3 text-sm text-muted-foreground">{tx.department ?? "—"}</td>
                        <td className="py-3 text-right">
                          <span className={`text-xs font-medium px-2 py-1 rounded-full ${riskScoreStyle(tx.risk_score)}`}>
                            {tx.risk_score?.toFixed(1)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
};

export default RiskIntelligence;