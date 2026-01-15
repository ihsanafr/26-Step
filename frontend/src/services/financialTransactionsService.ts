import api from "./api";

export type FinancialTransaction = {
  id: number;
  user_id: number;
  type: "income" | "expense";
  amount: number;
  category?: string | null;
  description?: string | null;
  date: string;
  created_at: string;
  updated_at: string;
};

export type CreateFinancialTransaction = {
  type: "income" | "expense";
  amount: number;
  category?: string | null;
  description?: string | null;
  date: string;
};

export type UpdateFinancialTransaction = Partial<CreateFinancialTransaction>;

export type FinancialTransactionParams = {
  type?: "income" | "expense";
  category?: string;
  date_from?: string;
  date_to?: string;
};

export const financialTransactionsService = {
  async getAll(params?: FinancialTransactionParams): Promise<FinancialTransaction[]> {
    const response = await api.get("/financial-transactions", { params });
    return response.data;
  },

  async create(data: CreateFinancialTransaction): Promise<FinancialTransaction> {
    const response = await api.post("/financial-transactions", data);
    return response.data;
  },

  async update(id: number, data: UpdateFinancialTransaction): Promise<FinancialTransaction> {
    const response = await api.put(`/financial-transactions/${id}`, data);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/financial-transactions/${id}`);
  },
};
