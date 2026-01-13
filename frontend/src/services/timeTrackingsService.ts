import api from "./api";

export interface TimeTracking {
  id: number;
  user_id: number;
  activity: string;
  category: string;
  duration_minutes: number;
  date: string; // YYYY-MM-DD (backend casts date)
  description?: string | null;
  created_at: string;
  updated_at: string;
}

export type CreateTimeTrackingData = Omit<
  TimeTracking,
  "id" | "user_id" | "created_at" | "updated_at"
>;

export type UpdateTimeTrackingData = Partial<CreateTimeTrackingData>;

export const timeTrackingsService = {
  async getAll(params?: { category?: string; date_from?: string; date_to?: string }): Promise<TimeTracking[]> {
    const qs = new URLSearchParams();
    if (params?.category) qs.append("category", params.category);
    if (params?.date_from) qs.append("date_from", params.date_from);
    if (params?.date_to) qs.append("date_to", params.date_to);
    const response = await api.get(`/time-trackings${qs.toString() ? `?${qs.toString()}` : ""}`);
    return response.data;
  },

  async getById(id: number): Promise<TimeTracking> {
    const response = await api.get(`/time-trackings/${id}`);
    return response.data;
  },

  async create(data: CreateTimeTrackingData): Promise<TimeTracking> {
    const response = await api.post("/time-trackings", data);
    return response.data;
  },

  async update(id: number, data: UpdateTimeTrackingData): Promise<TimeTracking> {
    const response = await api.put(`/time-trackings/${id}`, data);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/time-trackings/${id}`);
  },
};


