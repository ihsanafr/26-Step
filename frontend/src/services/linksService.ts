import api from "./api";

export type Link = {
  id: number;
  user_id: number;
  title: string;
  url: string;
  description?: string | null;
  category?: string | null;
  tags?: string[] | null;
  is_favorite: boolean;
  created_at: string;
  updated_at: string;
};

export type CreateLinkData = {
  title: string;
  url: string;
  description?: string | null;
  category?: string | null;
  tags?: string[];
  is_favorite?: boolean;
};

export type UpdateLinkData = Partial<CreateLinkData>;

export type GetLinksParams = {
  category?: string;
  is_favorite?: boolean;
};

export const linksService = {
  async getAll(params?: GetLinksParams): Promise<Link[]> {
    const response = await api.get("/links", { params });
    return response.data;
  },

  async getById(id: number): Promise<Link> {
    const response = await api.get(`/links/${id}`);
    return response.data;
  },

  async create(data: CreateLinkData): Promise<Link> {
    const response = await api.post("/links", data);
    return response.data;
  },

  async update(id: number, data: UpdateLinkData): Promise<Link> {
    const response = await api.put(`/links/${id}`, data);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/links/${id}`);
  },
};
