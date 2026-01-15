import api from "./api";

export type File = {
  id: number;
  user_id: number;
  name: string;
  original_name: string;
  path: string;
  mime_type: string;
  size: number; // in bytes
  category?: string | null;
  description?: string | null;
  created_at: string;
  updated_at: string;
};

export type CreateFileData = {
  name: string;
  original_name: string;
  path: string;
  mime_type: string;
  size: number;
  category?: string | null;
  description?: string | null;
};

export type UpdateFileData = {
  name?: string;
  category?: string | null;
  description?: string | null;
};

export type GetFilesParams = {
  category?: string;
};

export const filesService = {
  async getAll(params?: GetFilesParams): Promise<File[]> {
    const response = await api.get("/files", { params });
    return response.data;
  },

  async getById(id: number): Promise<File> {
    const response = await api.get(`/files/${id}`);
    return response.data;
  },

  async create(data: CreateFileData): Promise<File> {
    const response = await api.post("/files", data);
    return response.data;
  },

  async upload(files: FileList | File[], category?: string, description?: string): Promise<File[]> {
    const form = new FormData();
    
    if (files instanceof FileList) {
      Array.from(files).forEach((file) => {
        form.append("files[]", file);
      });
    } else {
      files.forEach((file) => {
        form.append("files[]", file);
      });
    }
    
    if (category) {
      form.append("category", category);
    }
    
    if (description) {
      form.append("description", description);
    }

    const response = await api.post("/files/upload", form, {
      headers: {
        'Content-Type': undefined, // Let browser set with boundary
      },
      transformRequest: [(data) => data], // Don't transform FormData
    });
    return response.data;
  },

  async update(id: number, data: UpdateFileData): Promise<File> {
    const response = await api.put(`/files/${id}`, data);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/files/${id}`);
  },

  async download(id: number): Promise<Blob> {
    const response = await api.get(`/files/${id}/download`, {
      responseType: "blob",
    });
    return response.data;
  },
};
