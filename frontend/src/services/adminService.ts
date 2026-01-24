import api from './api';

export interface AdminStats {
  users: {
    total: number;
    new_today: number;
    new_this_week: number;
    new_this_month: number;
  };
  tasks: {
    total: number;
    completed: number;
    in_progress: number;
    pending: number;
  };
  targets: {
    total: number;
    active: number;
    completed: number;
  };
  habits: {
    total: number;
    active: number;
  };
  transactions: {
    total: number;
    income: number;
    expense: number;
  };
  budgets: number;
  journals: number;
  notes: number;
  files: number;
  links: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
  created_at: string;
  is_admin?: boolean;
  storage_limit?: number;
  tasks_count: number;
  completed_tasks_count: number;
  habits_count: number;
  journals_count: number;
}

export interface Analytics {
  user_registrations: Array<{ date: string; count: number }>;
  tasks_created: Array<{ date: string; count: number }>;
  module_usage: {
    tasks: number;
    targets: number;
    habits: number;
    journals: number;
    finance: number;
    files: number;
  };
  top_users: Array<{
    id: number;
    name: string;
    email: string;
    created_at: string;
    completed_tasks: number;
  }>;
}

export const adminService = {
  getDashboard: async (): Promise<AdminStats> => {
    const response = await api.get('/admin/dashboard');
    return response.data;
  },

  getUsers: async (page: number = 1, search: string = '', perPage: number = 15): Promise<{
    data: User[];
    current_page: number;
    last_page: number;
    total: number;
  }> => {
    const response = await api.get('/admin/users', {
      params: { page, per_page: perPage, search },
    });
    return response.data;
  },

  getUserDetails: async (id: number): Promise<{
    user: User & {
      tasks: any[];
      habits: any[];
      journals: any[];
    };
    stats: any;
  }> => {
    const response = await api.get(`/admin/users/${id}`);
    return response.data;
  },

  updateUser: async (id: number, data: { name?: string; email?: string; password?: string; is_admin?: boolean; storage_limit?: number }): Promise<User> => {
    const response = await api.put(`/admin/users/${id}`, data);
    return response.data.user;
  },

  deleteUser: async (id: number): Promise<void> => {
    await api.delete(`/admin/users/${id}`);
  },

  getActiveUsers: async (): Promise<{
    active_users: Array<{
      user: User;
      sessions: Array<{
        ip_address: string;
        location: string;
        latitude: number | null;
        longitude: number | null;
        user_agent: string;
        last_activity: string;
      }>;
      total_sessions: number;
      last_activity: string;
    }>;
    total: number;
  }> => {
    const response = await api.get('/admin/active-users');
    return response.data;
  },

  getAnalytics: async (): Promise<Analytics> => {
    const response = await api.get('/admin/analytics');
    return response.data;
  },

  getFeedbacks: async (page: number = 1, perPage: number = 15): Promise<{
    data: any[];
    current_page: number;
    last_page: number;
    total: number;
  }> => {
    const response = await api.get('/admin/feedbacks', { params: { page, per_page: perPage } });
    return response.data;
  },

  deleteFeedback: async (id: number): Promise<void> => {
    await api.delete(`/admin/feedbacks/${id}`);
  },
};
