import { useEffect, useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Download, Copy, AlertTriangle, CheckCircle, Info, RefreshCw } from "lucide-react";
import api from "@/api/client";
import jsPDF from "jspdf";


const alertStyles = {
  warning: "bg-warning/10 border-warning/20 text-warning",
  info: "bg-info/10 border-info/20 text-info",
  success: "bg-success/10 border-success/20 text-success",
};

const ExecutiveReport = () => {
  const [reportData, setReportData] = useState<any>(null);
  const [health, setHealth] = useState<any>(null);
  const [bankruptcy, setBankruptcy] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  async function loadData() {
    setLoading(true);
    setError(null);
    try {
      const [reportRes, healthRes, bankruptcyRes] = await Promise.all([
        api.get("/ai-cfo-report"),
        api.get("/company-health"),
        api.get("/bankruptcy-risk"),
      ]);
      setReportData(reportRes.data);
      setHealth(healthRes.data);
      setBankruptcy(bankruptcyRes.data);
    } catch (err) {
      setError("Cannot reach backend. Make sure FastAPI is running on port 8000.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  // Parse the AI report text into sections by numbered headings like "1. Executive Summary:"
  const parseSections = (text: string) => {
    if (!text) return [];
    const regex = /\d+\.\s([^\n:]+):\n([\s\S]*?)(?=\d+\.\s[^\n:]+:|$)/g;
    const sections = [];
    let match;
    while ((match = regex.exec(text)) !== null) {
      sections.push({
        title: match[1].trim(),
        content: match[2].trim(),
      });
    }
    // Fallback — if regex fails, show as single block
    if (sections.length === 0) {
      sections.push({ title: "Full Report", content: text.trim() });
    }
    return sections;
  };

  const sections = parseSections(reportData?.report ?? "");

  // Build dynamic alerts from live data
  const alerts: { level: "warning" | "info" | "success"; text: string }[] = [];
  if (bankruptcy) {
    if (bankruptcy.bankruptcy_probability > 50) {
      alerts.push({ level: "warning", text: `High bankruptcy probability: ${bankruptcy.bankruptcy_probability}% — immediate action recommended` });
    } else if (bankruptcy.bankruptcy_probability > 25) {
      alerts.push({ level: "warning", text: `Moderate bankruptcy risk at ${bankruptcy.bankruptcy_probability}% — monitor closely` });
    } else {
      alerts.push({ level: "success", text: `Bankruptcy risk is low at ${bankruptcy.bankruptcy_probability}%` });
    }
  }
  if (health) {
    if (health.health_score >= 75) {
      alerts.push({ level: "success", text: `Company health score is strong at ${Math.round(health.health_score)}/100` });
    } else if (health.health_score >= 50) {
      alerts.push({ level: "info", text: `Company health score is moderate at ${Math.round(health.health_score)}/100 — review components` });
    } else {
      alerts.push({ level: "warning", text: `Company health score is low at ${Math.round(health.health_score)}/100 — action required` });
    }
  }
  if (health) {
    alerts.push({
      level: health.status === "STRONG" ? "success" : health.status === "STABLE" ? "info" : "warning",
      text: `Company state: ${health.status}`,
    });
  }

  const copyToClipboard = () => {
    const text = sections.map((s) => `${s.title}\n${s.content}`).join("\n\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
  });
  
  const downloadPDF = () => {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const maxWidth = pageWidth - margin * 2;
  let y = 20;

  const addLine = (text: string, fontSize = 11, isBold = false, color: [number, number, number] = [220, 220, 220]) => {
    doc.setFontSize(fontSize);
    doc.setTextColor(...color);
    if (isBold) doc.setFont("helvetica", "bold");
    else doc.setFont("helvetica", "normal");

    const lines = doc.splitTextToSize(text, maxWidth);
    lines.forEach((line: string) => {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
      doc.text(line, margin, y);
      y += fontSize * 0.5 + 2;
    });
  };

  const addSpacing = (space = 6) => { y += space; };

  const addDivider = () => {
    doc.setDrawColor(60, 60, 80);
    doc.line(margin, y, pageWidth - margin, y);
    y += 6;
  };

  // ── Cover ──
  doc.setFillColor(15, 15, 25);
  doc.rect(0, 0, pageWidth, 297, "F");

  doc.setFillColor(30, 30, 50);
  doc.rect(0, 0, pageWidth, 45, "F");

  addLine("FinPilot AI", 22, true, [140, 120, 255]);
  addLine("CFO Intelligence Brief", 13, false, [160, 160, 180]);
  addSpacing(2);
  addLine(today, 10, false, [120, 120, 140]);
  addSpacing(4);
  addDivider();

  // ── KPI Summary ──
  addLine("EXECUTIVE SUMMARY", 10, true, [140, 120, 255]);
  addSpacing(3);

  const kpis = [
    `Health Score:         ${Math.round(health?.health_score ?? 0)} / 100`,
    `Bankruptcy Risk:      ${reportData?.bankruptcy_probability}%  (${bankruptcy?.risk_level})`,
    `Company State:        ${reportData?.company_state}`,
    `Survival Months:      ${bankruptcy?.survival_months} months`,
  ];

  kpis.forEach((kpi) => addLine(kpi, 10, false, [200, 200, 210]));
  addSpacing(4);
  addDivider();

  // ── Alerts ──
  if (alerts.length > 0) {
    addLine("ALERTS & FLAGS", 10, true, [140, 120, 255]);
    addSpacing(3);
    alerts.forEach((alert) => {
      const prefix = alert.level === "warning" ? "⚠ " : alert.level === "success" ? "✓ " : "ℹ ";
      addLine(`${prefix} ${alert.text}`, 10, false, [200, 200, 210]);
      addSpacing(1);
    });
    addSpacing(4);
    addDivider();
  }

  // ── Report Sections ──
  sections.forEach((section) => {
    addLine(section.title.toUpperCase(), 11, true, [140, 120, 255]);
    addSpacing(3);
    addLine(section.content, 10, false, [200, 200, 210]);
    addSpacing(6);
    addDivider();
  });

  // ── Footer ──
  addSpacing(4);
  addLine(
    "This report was generated by FinPilot AI. Data reflects the latest financial snapshot.",
    9, false, [100, 100, 120]
  );

  doc.save(`FinPilot_CFO_Report_${new Date().toISOString().slice(0, 10)}.pdf`);
};
  return (
    <AppLayout>
      <div className="space-y-6 max-w-[900px]">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Executive AI Report</h1>
            <p className="text-sm text-muted-foreground mt-1">AI-generated CFO intelligence brief</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={loadData}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary text-secondary-foreground text-sm hover:bg-secondary/80 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </button>
            <button
              onClick={copyToClipboard}
              disabled={loading || !reportData}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary text-secondary-foreground text-sm hover:bg-secondary/80 transition-colors disabled:opacity-50"
            >
              <Copy className="w-4 h-4" />
              {copied ? "Copied!" : "Copy"}
            </button>
            <button
              onClick={downloadPDF}
              disabled={loading || !reportData}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm hover:bg-primary/90 transition-colors disabled:opacity-50">
              <Download className="w-4 h-4" /> Download PDF
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-destructive/15 border border-destructive/30 text-destructive text-sm px-4 py-3 rounded-lg">
            ⚠️ {error}
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="space-y-3 animate-pulse">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-12 bg-muted/30 rounded-lg" />
            ))}
            <div className="glass-card h-96 bg-muted/30 rounded-xl mt-4" />
          </div>
        ) : reportData && (
          <>
            {/* Dynamic Alerts */}
            <div className="space-y-2">
              {alerts.map((alert, i) => {
                const Icon = alert.level === "warning"
                  ? AlertTriangle
                  : alert.level === "success"
                  ? CheckCircle
                  : Info;
                return (
                  <div
                    key={i}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg border ${alertStyles[alert.level]} animate-fade-in`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="text-sm">{alert.text}</span>
                  </div>
                );
              })}
            </div>

            {/* KPI Summary Row */}
            <div className="grid grid-cols-3 gap-4">
              <div className="glass-card p-4 text-center animate-fade-in">
                <p className="text-xs text-muted-foreground mb-1">Health Score</p>
                <p className="text-2xl font-bold text-foreground">{Math.round(health?.health_score ?? 0)}</p>
                <p className="text-xs text-muted-foreground">/100</p>
              </div>
              <div className="glass-card p-4 text-center animate-fade-in">
                <p className="text-xs text-muted-foreground mb-1">Bankruptcy Risk</p>
                <p className="text-2xl font-bold text-foreground">{bankruptcy?.bankruptcy_probability}%</p>
                <p className="text-xs text-muted-foreground">{bankruptcy?.risk_level}</p>
              </div>
              <div className="glass-card p-4 text-center animate-fade-in">
                <p className="text-xs text-muted-foreground mb-1">Company State</p>
                <p className="text-2xl font-bold text-success">{health?.status}</p>
                <p className="text-xs text-muted-foreground">Current status</p>
              </div>
            </div>

            {/* Report Body */}
            <div className="glass-card p-8 animate-fade-in">
              <div className="border-b border-border pb-6 mb-6">
                <h2 className="text-xl font-bold text-foreground">FinPilot AI — CFO Intelligence Brief</h2>
                <p className="text-sm text-muted-foreground mt-1">{today}</p>
              </div>

              <div className="space-y-6">
                {sections.map((section, i) => (
                  <div key={i}>
                    <h3 className="text-base font-semibold text-foreground mb-2">{section.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                      {section.content}
                    </p>
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
          </>
        )}
      </div>
    </AppLayout>
  );
};

export default ExecutiveReport;