import api from "./api";

export type Budget = {
  id: number;
  user_id: number;
  category: string;
  amount: number;
  period?: string | null;
  start_date: string;
  end_date: string;
  is_active: boolean;
  color?: string | null;
  created_at: string;
  updated_at: string;
  spent?: number;
  remaining?: number;
  percentage?: number;
};

export type CreateBudget = {
  category: string;
  amount: number;
  period?: string | null;
  start_date: string;
  end_date: string;
  is_active?: boolean;
  color?: string | null;
};

export type UpdateBudget = Partial<CreateBudget>;

export type BudgetParams = {
  is_active?: boolean;
};

export const budgetsService = {
  async getAll(params?: BudgetParams): Promise<Budget[]> {
    const response = await api.get("/budgets", { params });
    return response.data;
  },

  async create(data: CreateBudget): Promise<Budget> {
    const response = await api.post("/budgets", data);
    return response.data;
  },

  async update(id: number, data: UpdateBudget): Promise<Budget> {
    const response = await api.put(`/budgets/${id}`, data);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/budgets/${id}`);
  },
};
