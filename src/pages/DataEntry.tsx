import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PlusCircle, DollarSign, Users, Shield, CheckCircle, XCircle } from "lucide-react";
import api from "@/api/client";

// Real data from your DB
const ACCOUNTS = [
  { id: 1, name: "Bank" },
  { id: 2, name: "Salary Expense" },
  { id: 3, name: "Revenue" },
  { id: 4, name: "Vendor Expense" },
  { id: 6, name: "Owner Equity" },
];


const VENDORS = [
  { id: 1, name: "AWS Cloud" },
  { id: 2, name: "Office Supplies Ltd" },
  { id: 3, name: "Contractor Group" },
  { id: 4, name: "Marketing Agency" },
];

const DEPARTMENTS = [
  { id: 1, name: "Engineering" },
  { id: 2, name: "Sales" },
  { id: 3, name: "Marketing" },
  { id: 4, name: "HR" },
  { id: 5, name: "Operations" },
];

type ToastType = "success" | "error" | null;

interface Toast {
  type: ToastType;
  message: string;
}

const inputClass = "w-full px-3 py-2 rounded-lg bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary";
const labelClass = "block text-sm text-muted-foreground mb-1.5";
const selectClass = "w-full px-3 py-2 rounded-lg bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary";

const DataEntry = () => {
  const [toast, setToast] = useState<Toast | null>(null);

  // ── Transaction state ──
  const [txn, setTxn] = useState({
    description: "",
    amount: "",
    debit_account_id: "1",
    credit_account_id: "3",
  });
  const [txnLoading, setTxnLoading] = useState(false);

  // ── Expense state ──
  const [expense, setExpense] = useState({
    vendor_id: "1",
    department_id: "1",
    amount: "",
    description: "",
  });
  const [expenseLoading, setExpenseLoading] = useState(false);

  // ── Payroll state ──
  const [payrollLoading, setPayrollLoading] = useState(false);
  const [payrollResult, setPayrollResult] = useState<any>(null);

  // ── Fraud state ──
  const [fraudLoading, setFraudLoading] = useState(false);
  const [fraudResult, setFraudResult] = useState<any>(null);

  const showToast = (type: ToastType, message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  };

  // ── Handlers ──
  const handleAddTransaction = async () => {
    if (!txn.description || !txn.amount) {
      showToast("error", "Please fill in all transaction fields.");
      return;
    }
    if (txn.debit_account_id === txn.credit_account_id) {
      showToast("error", "Debit and credit accounts must be different.");
      return;
    }
    setTxnLoading(true);
    try {
      const res = await api.post("/transaction", null, {
        params: {
          description: txn.description,
          amount: Number(txn.amount),
          debit_account_id: Number(txn.debit_account_id),
          credit_account_id: Number(txn.credit_account_id),
        },
      });
      showToast("success", `Transaction #${res.data.transaction_id} created successfully!`);
      setTxn({ description: "", amount: "", debit_account_id: "1", credit_account_id: "3" });
    } catch (err: any) {
      showToast("error", err?.response?.data?.detail ?? "Failed to add transaction.");
    } finally {
      setTxnLoading(false);
    }
  };

  const handleRecordExpense = async () => {
    if (!expense.description || !expense.amount) {
      showToast("error", "Please fill in all expense fields.");
      return;
    }
    setExpenseLoading(true);
    try {
      await api.post("/record-expense", null, {
        params: {
          vendor_id: Number(expense.vendor_id),
          department_id: Number(expense.department_id),
          amount: Number(expense.amount),
          description: expense.description,
        },
      });
      showToast("success", "Expense recorded successfully!");
      setExpense({ vendor_id: "1", department_id: "1", amount: "", description: "" });
    } catch (err: any) {
      showToast("error", err?.response?.data?.detail ?? "Failed to record expense.");
    } finally {
      setExpenseLoading(false);
    }
  };

  const handleRunPayroll = async () => {
    setPayrollLoading(true);
    setPayrollResult(null);
    try {
      const res = await api.post("/process-payroll");
      setPayrollResult(res.data);
      showToast("success", "Payroll processed successfully!");
    } catch (err: any) {
      showToast("error", err?.response?.data?.detail ?? "Failed to process payroll.");
    } finally {
      setPayrollLoading(false);
    }
  };

  const handleRunFraudDetection = async () => {
    setFraudLoading(true);
    setFraudResult(null);
    try {
      const res = await api.post("/run-fraud-detection");
      setFraudResult(res.data);
      showToast("success", "Fraud detection completed!");
    } catch (err: any) {
      showToast("error", err?.response?.data?.detail ?? "Failed to run fraud detection.");
    } finally {
      setFraudLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6 max-w-[1000px]">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Data Entry</h1>
          <p className="text-sm text-muted-foreground mt-1">Add transactions, record expenses, and run operations</p>
        </div>

        {/* Toast */}
        {toast && (
          <div className={`flex items-center gap-3 px-4 py-3 rounded-lg border text-sm animate-fade-in ${
            toast.type === "success"
              ? "bg-success/10 border-success/20 text-success"
              : "bg-destructive/10 border-destructive/20 text-destructive"
          }`}>
            {toast.type === "success"
              ? <CheckCircle className="w-4 h-4 shrink-0" />
              : <XCircle className="w-4 h-4 shrink-0" />}
            {toast.message}
          </div>
        )}

        {/* Add Transaction */}
        <div className="glass-card p-6 animate-fade-in">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-lg bg-primary/15 flex items-center justify-center">
              <PlusCircle className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-foreground">Add Transaction</h2>
              <p className="text-xs text-muted-foreground">Record a new financial transaction</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className={labelClass}>Description</label>
              <input
                type="text"
                placeholder="e.g. Client payment received"
                value={txn.description}
                onChange={(e) => setTxn({ ...txn, description: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Amount ($)</label>
              <input
                type="number"
                placeholder="e.g. 5000"
                value={txn.amount}
                onChange={(e) => setTxn({ ...txn, amount: e.target.value })}
                className={inputClass}
                min="0"
              />
            </div>
            <div>
              <label className={labelClass}>Debit Account</label>
              <select
                value={txn.debit_account_id}
                onChange={(e) => setTxn({ ...txn, debit_account_id: e.target.value })}
                className={selectClass}
              >
                {ACCOUNTS.map((a) => (
                  <option key={a.id} value={a.id}>{a.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Credit Account</label>
              <select
                value={txn.credit_account_id}
                onChange={(e) => setTxn({ ...txn, credit_account_id: e.target.value })}
                className={selectClass}
              >
                {ACCOUNTS.map((a) => (
                  <option key={a.id} value={a.id}>{a.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-5 flex justify-end">
            <button
              onClick={handleAddTransaction}
              disabled={txnLoading}
              className="px-6 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {txnLoading ? "Adding..." : "Add Transaction"}
            </button>
          </div>
        </div>

        {/* Record Expense */}
        <div className="glass-card p-6 animate-fade-in">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-lg bg-warning/15 flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-warning" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-foreground">Record Expense</h2>
              <p className="text-xs text-muted-foreground">Log a vendor or department expense</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Vendor</label>
              <select
                value={expense.vendor_id}
                onChange={(e) => setExpense({ ...expense, vendor_id: e.target.value })}
                className={selectClass}
              >
                {VENDORS.map((v) => (
                  <option key={v.id} value={v.id}>{v.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Department</label>
              <select
                value={expense.department_id}
                onChange={(e) => setExpense({ ...expense, department_id: e.target.value })}
                className={selectClass}
              >
                {DEPARTMENTS.map((d) => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Amount ($)</label>
              <input
                type="number"
                placeholder="e.g. 1200"
                value={expense.amount}
                onChange={(e) => setExpense({ ...expense, amount: e.target.value })}
                className={inputClass}
                min="0"
              />
            </div>
            <div>
              <label className={labelClass}>Description</label>
              <input
                type="text"
                placeholder="e.g. Monthly AWS bill"
                value={expense.description}
                onChange={(e) => setExpense({ ...expense, description: e.target.value })}
                className={inputClass}
              />
            </div>
          </div>

          <div className="mt-5 flex justify-end">
            <button
              onClick={handleRecordExpense}
              disabled={expenseLoading}
              className="px-6 py-2 rounded-lg bg-warning text-white text-sm font-medium hover:bg-warning/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {expenseLoading ? "Recording..." : "Record Expense"}
            </button>
          </div>
        </div>

        {/* Run Payroll + Fraud Detection side by side */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          {/* Payroll */}
          <div className="glass-card p-6 animate-fade-in">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg bg-success/15 flex items-center justify-center">
                <Users className="w-4 h-4 text-success" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-foreground">Process Payroll</h2>
                <p className="text-xs text-muted-foreground">Run monthly payroll for all staff</p>
              </div>
            </div>

            {payrollResult && (
              <div className="mb-4 p-3 rounded-lg bg-success/10 border border-success/20 text-sm text-success space-y-1">
                {Object.entries(payrollResult).map(([key, val]) => (
                  <div key={key} className="flex justify-between">
                    <span className="capitalize text-muted-foreground">{key.replace(/_/g, " ")}</span>
                    <span className="font-medium">{String(val)}</span>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={handleRunPayroll}
              disabled={payrollLoading}
              className="w-full py-2 rounded-lg bg-success text-white text-sm font-medium hover:bg-success/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {payrollLoading ? "Processing..." : "Run Payroll"}
            </button>
          </div>

          {/* Fraud Detection */}
          <div className="glass-card p-6 animate-fade-in">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg bg-destructive/15 flex items-center justify-center">
                <Shield className="w-4 h-4 text-destructive" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-foreground">Fraud Detection</h2>
                <p className="text-xs text-muted-foreground">Scan all transactions for anomalies</p>
              </div>
            </div>

            {fraudResult && (
              <div className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-sm space-y-1">
                {Object.entries(fraudResult).map(([key, val]) => (
                  <div key={key} className="flex justify-between">
                    <span className="capitalize text-muted-foreground">{key.replace(/_/g, " ")}</span>
                    <span className="font-medium text-foreground">{String(val)}</span>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={handleRunFraudDetection}
              disabled={fraudLoading}
              className="w-full py-2 rounded-lg bg-destructive text-white text-sm font-medium hover:bg-destructive/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {fraudLoading ? "Scanning..." : "Run Fraud Detection"}
            </button>
          </div>
        </div>
        {/* Reset App */}
<div className="glass-card p-6 animate-fade-in border border-destructive/20">
  <div className="flex items-center justify-between">
    <div>
      <h2 className="text-base font-semibold text-foreground">Reset Application</h2>
      <p className="text-xs text-muted-foreground mt-1">
        Clear all setup data and restart onboarding from scratch
      </p>
    </div>
    <button
      onClick={() => {
        localStorage.removeItem("finpilot_setup");
        localStorage.removeItem("finpilot_company");
        window.location.href = "/";
      }}
      className="px-4 py-2 rounded-lg bg-destructive/10 text-destructive text-sm font-medium hover:bg-destructive/20 transition-colors border border-destructive/20"
    >
      Reset & Restart
    </button>
  </div>
</div>
      </div>
    </AppLayout>
  );
};

export default DataEntry;