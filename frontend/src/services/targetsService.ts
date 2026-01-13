import api from './api';

export interface Target {
  id: number;
  title: string;
  description?: string;
  target_value: number;
  current_value: number;
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
  start_date: string;
  end_date?: string;
  status: 'active' | 'completed' | 'paused';
  order?: number;
  created_at: string;
  updated_at: string;
}

export interface CreateTargetData {
  title: string;
  description?: string;
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
  start_date: string;
  end_date?: string;
  status?: 'active' | 'completed' | 'paused';
  order?: number;
}

export interface UpdateTargetData extends Partial<CreateTargetData> {}

export const targetsService = {
  getAll: async (): Promise<Target[]> => {
    const response = await api.get('/targets');
    return response.data;
  },

  getById: async (id: number): Promise<Target> => {
    const response = await api.get(`/targets/${id}`);
    return response.data;
  },

  create: async (data: CreateTargetData): Promise<Target> => {
    const response = await api.post('/targets', data);
    return response.data;
  },

  update: async (id: number, data: UpdateTargetData): Promise<Target> => {
    const response = await api.put(`/targets/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/targets/${id}`);
  },
};

