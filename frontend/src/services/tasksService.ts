import api from './api';

export interface Target {
  id: number;
  title: string;
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  category?: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in_progress' | 'completed' | 'todo' | 'on_progress' | 'on_hold' | 'finish';
  due_date?: string;
  completed_at?: string;
  progress: number;
  target_id?: number;
  target?: Target;
  created_at: string;
  updated_at: string;
}

export interface CreateTaskData {
  title: string;
  description?: string;
  category?: string;
  priority?: 'low' | 'medium' | 'high';
  status?: 'pending' | 'in_progress' | 'completed' | 'todo' | 'on_progress' | 'on_hold' | 'finish';
  due_date?: string;
  progress?: number;
  target_id?: number;
}

export interface UpdateTaskData extends Partial<CreateTaskData> {}

export const tasksService = {
  getAll: async (params?: { category?: string; status?: string }): Promise<Task[]> => {
    const response = await api.get('/tasks', { params });
    return response.data;
  },

  getById: async (id: number): Promise<Task> => {
    const response = await api.get(`/tasks/${id}`);
    return response.data;
  },

  create: async (data: CreateTaskData): Promise<Task> => {
    const response = await api.post('/tasks', data);
    return response.data;
  },

  update: async (id: number, data: UpdateTaskData): Promise<Task> => {
    const response = await api.put(`/tasks/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/tasks/${id}`);
  },
};

