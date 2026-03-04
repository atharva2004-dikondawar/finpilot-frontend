import api from "./client";

export const getFinancialSnapshot = async () => {
  const res = await api.get("/financial-snapshot");
  return res.data;
};

export const getCompanyHealth = async () => {
  const res = await api.get("/company-health");
  return res.data;
};

export const getBankruptcyRisk = async () => {
  const res = await api.get("/bankruptcy-risk");
  return res.data;
};

export const getOptimizeStrategy = async () => {
  const res = await api.get("/optimize-strategy");
  return res.data;
};

export const setupCompany = async (data: {
  company_name: string;
  bank_balance: number;
  monthly_revenue: number;
  monthly_expense: number;
  num_employees: number;
  avg_salary: number;
}) => {
  const res = await api.post("/setup-company", null, { params: data });
  return res.data;
};

export const generateDemoData = async () => {
  const res = await api.post("/generate-history", null, {
    params: { months: 24 }
  });
  return res.data;
};