import api from "./api";

export type Note = {
  id: number;
  user_id: number;
  title: string;
  content: string;
  category?: string | null;
  tags?: string[] | null;
  is_pinned: boolean;
  created_at: string;
  updated_at: string;
};

export type CreateNoteData = {
  title: string;
  content: string;
  category?: string | null;
  tags?: string[];
  is_pinned?: boolean;
};

export type UpdateNoteData = Partial<CreateNoteData>;

export type GetNotesParams = {
  category?: string;
  is_pinned?: boolean;
};

export const notesService = {
  async getAll(params?: GetNotesParams): Promise<Note[]> {
    const response = await api.get("/notes", { params });
    return response.data;
  },

  async getById(id: number): Promise<Note> {
    const response = await api.get(`/notes/${id}`);
    return response.data;
  },

  async create(data: CreateNoteData): Promise<Note> {
    const response = await api.post("/notes", data);
    return response.data;
  },

  async update(id: number, data: UpdateNoteData): Promise<Note> {
    const response = await api.put(`/notes/${id}`, data);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/notes/${id}`);
  },
};


