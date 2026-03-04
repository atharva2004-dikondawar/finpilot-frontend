import { useState } from "react";
import { Rocket, BarChart3, X } from "lucide-react";
import { setupCompany, generateDemoData } from "@/api/financialService";

interface OnboardingModalProps {
  onComplete: (companyName: string) => void;
}

const inputClass = "w-full px-3 py-2 rounded-lg bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary";
const labelClass = "block text-sm text-muted-foreground mb-1.5";

export function OnboardingModal({ onComplete }: OnboardingModalProps) {
  const [mode, setMode] = useState<"choose" | "fresh">("choose");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    company_name: "",
    bank_balance: "",
    monthly_revenue: "",
    monthly_expense: "",
    num_employees: "",
    avg_salary: "",
  });

  const handleDemo = async () => {
    setLoading(true);
    setError(null);
    try {
      await generateDemoData();
      localStorage.setItem("finpilot_setup", "demo");
      localStorage.setItem("finpilot_company", "Acme Corp");
      onComplete("Acme Corp");
    } catch (err) {
      setError("Failed to load demo data. Is FastAPI running?");
    } finally {
      setLoading(false);
    }
  };

  const handleFreshSetup = async () => {
    if (
      !form.company_name ||
      !form.bank_balance ||
      !form.monthly_revenue ||
      !form.monthly_expense ||
      !form.num_employees ||
      !form.avg_salary
    ) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await setupCompany({
        company_name: form.company_name,
        bank_balance: Number(form.bank_balance),
        monthly_revenue: Number(form.monthly_revenue),
        monthly_expense: Number(form.monthly_expense),
        num_employees: Number(form.num_employees),
        avg_salary: Number(form.avg_salary),
      });
      localStorage.setItem("finpilot_setup", "real");
      localStorage.setItem("finpilot_company", form.company_name);
      onComplete(form.company_name);
    } catch (err) {
      setError("Setup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="glass-card w-full max-w-lg mx-4 p-8 animate-fade-in">

        {/* Choose Mode */}
        {mode === "choose" && (
          <>
            <div className="text-center mb-8">
              <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center mx-auto mb-4">
                <span className="text-primary font-bold text-xl">F</span>
              </div>
              <h1 className="text-2xl font-bold text-foreground">Welcome to FinPilot AI</h1>
              <p className="text-sm text-muted-foreground mt-2">
                Your AI-powered financial intelligence platform
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {/* Demo */}
              <button
                onClick={handleDemo}
                disabled={loading}
                className="glass-card p-5 text-left hover:border-primary/30 transition-all group disabled:opacity-50"
              >
                <BarChart3 className="w-6 h-6 text-primary mb-3" />
                <h3 className="text-sm font-semibold text-foreground mb-1">Explore with Demo</h3>
                <p className="text-xs text-muted-foreground">
                  Load 24 months of sample data and explore all features instantly.
                </p>
                <span className="text-xs text-primary mt-3 block">
                  {loading ? "Loading demo..." : "Recommended for first time →"}
                </span>
              </button>

              {/* Fresh */}
              <button
                onClick={() => setMode("fresh")}
                disabled={loading}
                className="glass-card p-5 text-left hover:border-primary/30 transition-all group disabled:opacity-50"
              >
                <Rocket className="w-6 h-6 text-success mb-3" />
                <h3 className="text-sm font-semibold text-foreground mb-1">Start Fresh</h3>
                <p className="text-xs text-muted-foreground">
                  Enter your real company data and start tracking actual financials.
                </p>
                <span className="text-xs text-success mt-3 block">Use your own data →</span>
              </button>
            </div>

            {error && (
              <p className="text-xs text-destructive text-center">{error}</p>
            )}
          </>
        )}

        {/* Fresh Setup Form */}
        {mode === "fresh" && (
          <>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-foreground">Company Setup</h2>
                <p className="text-xs text-muted-foreground mt-0.5">Enter your real financial details</p>
              </div>
              <button
                onClick={() => setMode("choose")}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className={labelClass}>Company Name</label>
                <input
                  type="text"
                  placeholder="e.g. Acme Corp"
                  value={form.company_name}
                  onChange={(e) => setForm({ ...form, company_name: e.target.value })}
                  className={inputClass}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Starting Bank Balance ($)</label>
                  <input
                    type="number"
                    placeholder="e.g. 500000"
                    value={form.bank_balance}
                    onChange={(e) => setForm({ ...form, bank_balance: e.target.value })}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Monthly Revenue ($)</label>
                  <input
                    type="number"
                    placeholder="e.g. 100000"
                    value={form.monthly_revenue}
                    onChange={(e) => setForm({ ...form, monthly_revenue: e.target.value })}
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Monthly Expenses ($)</label>
                  <input
                    type="number"
                    placeholder="e.g. 60000"
                    value={form.monthly_expense}
                    onChange={(e) => setForm({ ...form, monthly_expense: e.target.value })}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Number of Employees</label>
                  <input
                    type="number"
                    placeholder="e.g. 10"
                    value={form.num_employees}
                    onChange={(e) => setForm({ ...form, num_employees: e.target.value })}
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>Average Employee Salary ($)</label>
                <input
                  type="number"
                  placeholder="e.g. 50000"
                  value={form.avg_salary}
                  onChange={(e) => setForm({ ...form, avg_salary: e.target.value })}
                  className={inputClass}
                />
              </div>
            </div>

            {error && (
              <p className="text-xs text-destructive mt-3">{error}</p>
            )}

            <button
              onClick={handleFreshSetup}
              disabled={loading}
              className="w-full mt-6 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Setting up..." : "Launch FinPilot →"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}