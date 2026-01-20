import api from './api';

export interface ActivityByDate {
  tasks?: number;
  habits?: number;
  journals?: number;
  transactions?: number;
  schedules?: number;
  time_trackings?: number;
  files?: number;
  notes?: number;
  links?: number;
}

export interface ActivityDetail {
  date: string;
  tasks: any[];
  habit_logs: any[];
  journals: any[];
  transactions: any[];
  schedules: any[];
  time_trackings: any[];
  files: any[];
  notes: any[];
  links: any[];
}

export const activitiesService = {
  getByDateRange: async (startDate: string, endDate: string): Promise<Record<string, ActivityByDate>> => {
    const response = await api.get('/activities/range', {
      params: { start_date: startDate, end_date: endDate },
    });
    return response.data;
  },

  getByDate: async (date: string): Promise<ActivityDetail> => {
    const response = await api.get(`/activities/date/${date}`);
    return response.data;
  },
};
