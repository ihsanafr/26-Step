import api from "./api";

export interface Schedule {
  id: number;
  user_id: number;
  title: string;
  description?: string | null;
  start_time: string; // ISO datetime
  end_time: string; // ISO datetime
  location?: string | null;
  is_completed: boolean;
  created_at: string;
  updated_at: string;
}

export type CreateScheduleData = Omit<
  Schedule,
  "id" | "user_id" | "created_at" | "updated_at"
>;

export type UpdateScheduleData = Partial<CreateScheduleData>;

export const schedulesService = {
  async getAll(params?: { is_completed?: boolean; date_from?: string; date_to?: string }): Promise<Schedule[]> {
    const qs = new URLSearchParams();
    if (typeof params?.is_completed === "boolean") qs.append("is_completed", String(params.is_completed));
    if (params?.date_from) qs.append("date_from", params.date_from);
    if (params?.date_to) qs.append("date_to", params.date_to);
    const response = await api.get(`/schedules${qs.toString() ? `?${qs.toString()}` : ""}`);
    return response.data;
  },

  async create(data: CreateScheduleData): Promise<Schedule> {
    const response = await api.post("/schedules", data);
    return response.data;
  },

  async update(id: number, data: UpdateScheduleData): Promise<Schedule> {
    const response = await api.put(`/schedules/${id}`, data);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/schedules/${id}`);
  },
};


