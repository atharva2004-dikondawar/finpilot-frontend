import { AppLayout } from "@/components/layout/AppLayout";
import { RiskMeter } from "@/components/dashboard/RiskMeter";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

const fraudTrend = [
  { month: "Jul", score: 12 },
  { month: "Aug", score: 15 },
  { month: "Sep", score: 8 },
  { month: "Oct", score: 22 },
  { month: "Nov", score: 18 },
  { month: "Dec", score: 14 },
];

const vendorRisk = [
  { vendor: "Cloud Hosting Co", risk: "Low", spend: "$48K", score: 15 },
  { vendor: "Marketing Agency X", risk: "Medium", spend: "$32K", score: 45 },
  { vendor: "Consulting Group", risk: "High", spend: "$28K", score: 72 },
  { vendor: "Office Supplies Inc", risk: "Low", spend: "$12K", score: 8 },
  { vendor: "Freelancer Network", risk: "Medium", spend: "$18K", score: 38 },
];

const deptRisk = [
  { dept: "Engineering", operational: 12, financial: 8, compliance: 5 },
  { dept: "Marketing", operational: 25, financial: 35, compliance: 10 },
  { dept: "Sales", operational: 18, financial: 22, compliance: 15 },
  { dept: "Operations", operational: 8, financial: 10, compliance: 20 },
  { dept: "HR", operational: 5, financial: 12, compliance: 8 },
];

const riskColor = (v: number) =>
  v <= 20 ? "bg-success/20 text-success" : v <= 50 ? "bg-warning/20 text-warning" : "bg-destructive/20 text-destructive";

const tt = {
  contentStyle: {
    backgroundColor: "hsl(222 22% 11%)",
    border: "1px solid hsl(222 15% 18%)",
    borderRadius: "8px",
    fontSize: "12px",
    color: "hsl(210 20% 92%)",
  },
};

const RiskIntelligence = () => {
  return (
    <AppLayout>
      <div className="space-y-6 max-w-[1400px]">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Risk Intelligence</h1>
          <p className="text-sm text-muted-foreground mt-1">Comprehensive risk monitoring and assessment</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <RiskMeter probability={18} />
          <div className="glass-card p-5 animate-fade-in lg:col-span-2">
            <h3 className="text-sm font-medium text-foreground mb-4">Fraud Trend</h3>
            <ResponsiveContainer width="100%" height={160}>
              <LineChart data={fraudTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 15% 18%)" />
                <XAxis dataKey="month" tick={{ fill: "hsl(215 15% 55%)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "hsl(215 15% 55%)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip {...tt} />
                <Line type="monotone" dataKey="score" stroke="hsl(0 72% 55%)" strokeWidth={2} dot={{ fill: "hsl(0 72% 55%)", r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Vendor Risk */}
          <div className="glass-card p-5 animate-fade-in">
            <h3 className="text-sm font-medium text-foreground mb-4">Vendor Risk Ranking</h3>
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left text-xs font-medium text-muted-foreground pb-3">Vendor</th>
                  <th className="text-right text-xs font-medium text-muted-foreground pb-3">Spend</th>
                  <th className="text-right text-xs font-medium text-muted-foreground pb-3">Risk</th>
                </tr>
              </thead>
              <tbody>
                {vendorRisk.map((v) => (
                  <tr key={v.vendor} className="border-b border-border/50 last:border-0">
                    <td className="py-3 text-sm text-foreground">{v.vendor}</td>
                    <td className="py-3 text-sm text-muted-foreground text-right">{v.spend}</td>
                    <td className="py-3 text-right">
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                        v.risk === "Low" ? "bg-success/15 text-success" : v.risk === "Medium" ? "bg-warning/15 text-warning" : "bg-destructive/15 text-destructive"
                      }`}>{v.risk}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Dept Risk Heatmap */}
          <div className="glass-card p-5 animate-fade-in">
            <h3 className="text-sm font-medium text-foreground mb-4">Department Risk Heatmap</h3>
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left text-xs font-medium text-muted-foreground pb-3">Department</th>
                  <th className="text-center text-xs font-medium text-muted-foreground pb-3">Operational</th>
                  <th className="text-center text-xs font-medium text-muted-foreground pb-3">Financial</th>
                  <th className="text-center text-xs font-medium text-muted-foreground pb-3">Compliance</th>
                </tr>
              </thead>
              <tbody>
                {deptRisk.map((d) => (
                  <tr key={d.dept} className="border-b border-border/50 last:border-0">
                    <td className="py-3 text-sm text-foreground">{d.dept}</td>
                    {[d.operational, d.financial, d.compliance].map((val, i) => (
                      <td key={i} className="py-3 text-center">
                        <span className={`inline-block w-10 text-xs font-medium px-2 py-1 rounded ${riskColor(val)}`}>{val}</span>
                      </td>
                    ))}
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

export default RiskIntelligence;
