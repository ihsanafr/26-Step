import api from "./api";

export interface JournalNoteCategory {
  id: number;
  user_id: number | null;
  name: string;
  color: string | null;
  icon?: string | null;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateCategoryData {
  name: string;
  color?: string | null;
  icon?: string | null;
}

export interface UpdateCategoryData {
  name?: string;
  color?: string | null;
  icon?: string | null;
}

const journalNoteCategoriesService = {
  async getAll(): Promise<JournalNoteCategory[]> {
    const response = await api.get<JournalNoteCategory[]>("/journal-note-categories");
    return response.data;
  },

  async create(data: CreateCategoryData): Promise<JournalNoteCategory> {
    const response = await api.post<JournalNoteCategory>("/journal-note-categories", data);
    return response.data;
  },

  async update(id: number, data: UpdateCategoryData): Promise<JournalNoteCategory> {
    const response = await api.put<JournalNoteCategory>(`/journal-note-categories/${id}`, data);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/journal-note-categories/${id}`);
  },
};

export default journalNoteCategoriesService;
