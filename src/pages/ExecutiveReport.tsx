import { AppLayout } from "@/components/layout/AppLayout";
import { Download, Copy, AlertTriangle, CheckCircle, Info } from "lucide-react";
import { useState } from "react";

const report = {
  date: "December 31, 2025",
  company: "Acme Corp",
  sections: [
    {
      title: "Executive Summary",
      content:
        "Acme Corp maintains a strong financial position with a health score of 74/100. Revenue grew 9.4% month-over-month reaching $580K, while operating expenses remained controlled at $375K. The company's cash reserves of $2.4M provide an 18-month runway at current burn rates. Bankruptcy probability remains low at 18%, indicating stable operations.",
    },
    {
      title: "Revenue Analysis",
      content:
        "Revenue has shown consistent upward trajectory over the past 6 months, with a compound monthly growth rate of 5.5%. Key drivers include expansion in enterprise segment (+22%) and product-led growth in mid-market (+15%). The revenue mix has diversified with recurring revenue now comprising 78% of total, up from 65% in Q2.",
    },
    {
      title: "Cost Structure & Efficiency",
      content:
        "Operating expenses have grown at a rate below revenue growth, improving the operating leverage. Employee costs represent 62% of total expenses, with engineering comprising the largest department at $145K monthly. Vendor consolidation efforts have reduced SaaS tool spending by 12% without impacting productivity.",
    },
    {
      title: "Risk Assessment",
      content:
        "Fraud risk indicators remain at acceptable levels with a score of 14/100. Vendor concentration risk has been flagged for Consulting Group (risk score: 72), requiring diversification or contract renegotiation. Department-level financial risk is highest in Marketing (35), primarily due to campaign spend variability.",
    },
    {
      title: "Strategic Recommendations",
      content:
        "1. Pursue the Balanced Growth strategy (confidence: 87%) with +15% revenue target and -8% expense optimization.\n2. Diversify vendor portfolio to reduce concentration risk in consulting services.\n3. Increase marketing spend accountability with ROI-based budget allocation.\n4. Build 24-month cash reserve target to improve resilience against market downturns.",
    },
  ],
  alerts: [
    { level: "warning" as const, text: "Vendor concentration risk elevated for Consulting Group" },
    { level: "info" as const, text: "Marketing department budget variance above threshold" },
    { level: "success" as const, text: "Revenue growth exceeds target by 3.4%" },
  ],
};

const alertIcons = {
  warning: AlertTriangle,
  info: Info,
  success: CheckCircle,
};
const alertStyles = {
  warning: "bg-warning/10 border-warning/20 text-warning",
  info: "bg-info/10 border-info/20 text-info",
  success: "bg-success/10 border-success/20 text-success",
};

const ExecutiveReport = () => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    const text = report.sections.map((s) => `${s.title}\n${s.content}`).join("\n\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AppLayout>
      <div className="space-y-6 max-w-[900px]">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Executive AI Report</h1>
            <p className="text-sm text-muted-foreground mt-1">AI-generated CFO intelligence brief</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={copyToClipboard}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary text-secondary-foreground text-sm hover:bg-secondary/80 transition-colors"
            >
              <Copy className="w-4 h-4" />
              {copied ? "Copied!" : "Copy"}
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm hover:bg-primary/90 transition-colors">
              <Download className="w-4 h-4" /> Download PDF
            </button>
          </div>
        </div>

        {/* Alerts */}
        <div className="space-y-2">
          {report.alerts.map((alert, i) => {
            const Icon = alertIcons[alert.level];
            return (
              <div key={i} className={`flex items-center gap-3 px-4 py-3 rounded-lg border ${alertStyles[alert.level]} animate-fade-in`}>
                <Icon className="w-4 h-4 shrink-0" />
                <span className="text-sm">{alert.text}</span>
              </div>
            );
          })}
        </div>

        {/* Report */}
        <div className="glass-card p-8 animate-fade-in">
          <div className="border-b border-border pb-6 mb-6">
            <h2 className="text-xl font-bold text-foreground">{report.company} — CFO Intelligence Brief</h2>
            <p className="text-sm text-muted-foreground mt-1">{report.date}</p>
          </div>

          <div className="space-y-6">
            {report.sections.map((section, i) => (
              <div key={i}>
                <h3 className="text-base font-semibold text-foreground mb-2">{section.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{section.content}</p>
              </div>
            ))}
          </div>

          <div className="border-t border-border pt-6 mt-8">
            <p className="text-xs text-muted-foreground">
              This report was generated by FinPilot AI. Data reflects the latest financial snapshot.
              For questions, contact your assigned AI CFO analyst.
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default ExecutiveReport;
