import api from "./api";

export type Journal = {
  id: number;
  user_id: number;
  title: string;
  content: string;
  date: string; // YYYY-MM-DD
  mood?: string | null;
  tags?: string[] | null;
  is_private: boolean;
  weather?: string | null;
  location?: string | null;
  color?: string | null; // Hex color code
  cover_image?: string | null; // Base64 or URL
  created_at: string;
  updated_at: string;
};

export type CreateJournalData = {
  title: string;
  content: string;
  date: string;
  mood?: string | null;
  tags?: string[];
  is_private?: boolean;
  weather?: string | null;
  location?: string | null;
  color?: string | null;
  cover_image?: string | null;
};

export type UpdateJournalData = Partial<CreateJournalData>;

export type GetJournalsParams = {
  date?: string;
  mood?: string;
  is_private?: boolean;
  month?: number;
  year?: number;
};

export const journalsService = {
  async getAll(params?: GetJournalsParams): Promise<Journal[]> {
    const response = await api.get("/journals", { params });
    return response.data;
  },

  async getById(id: number): Promise<Journal> {
    const response = await api.get(`/journals/${id}`);
    return response.data;
  },

  async create(data: CreateJournalData): Promise<Journal> {
    const response = await api.post("/journals", data);
    return response.data;
  },

  async update(id: number, data: UpdateJournalData): Promise<Journal> {
    const response = await api.put(`/journals/${id}`, data);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/journals/${id}`);
  },
};


