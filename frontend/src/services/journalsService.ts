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
  category_id?: number | null;
  category?: {
    id: number;
    name: string;
    color: string | null;
    icon?: string | null;
  } | null;
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
  category_id?: number | null;
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

  async uploadCover(file: File): Promise<{ url: string; path: string }> {
    console.log("🔵 [journalsService] uploadCover called with file:", {
      name: file.name,
      type: file.type,
      size: file.size,
    });
    
    // Validate file
    if (!file) {
      throw new Error("No file provided");
    }
    
    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      throw new Error("File must be an image");
    }
    
    if (file.size > 5 * 1024 * 1024) {
      throw new Error("File size exceeds 5MB limit");
    }
    
    const form = new FormData();
    form.append("cover", file, file.name);
    
    console.log("🔵 [journalsService] Sending POST to /journals/cover", {
      formDataKeys: Array.from(form.keys()),
      fileInForm: form.has('cover'),
      fileObject: form.get('cover'),
    });
    
    try {
      // Create axios config that bypasses the default headers
      const response = await api.post("/journals/cover", form, {
        headers: {
          'Content-Type': undefined, // Let browser set it with boundary
        },
        transformRequest: [(data) => data], // Don't transform FormData
      });
      console.log("🟢 [journalsService] Upload response:", response.data);
      
      if (!response.data?.url) {
        throw new Error("Invalid response from server: missing URL");
      }
      
      return response.data;
    } catch (error: any) {
      console.error("❌ [journalsService] Upload cover error:", {
        status: error?.response?.status,
        data: error?.response?.data,
        message: error?.message,
      });
      
      // Extract error message from response
      let errorMessage = "Failed to upload cover image";
      if (error?.response?.data) {
        if (error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.data.errors) {
          const errors = error.response.data.errors;
          const errorArray = Object.values(errors).flat() as string[];
          errorMessage = errorArray.join(', ') || errorMessage;
        }
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      throw new Error(errorMessage);
    }
  },

  async uploadContentImage(file: File): Promise<{ url: string; path: string }> {
    console.log("🔵 [journalsService] uploadContentImage called with file:", {
      name: file.name,
      type: file.type,
      size: file.size,
    });
    
    // Validate file
    if (!file) {
      throw new Error("No file provided");
    }
    
    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      throw new Error("File must be an image");
    }
    
    if (file.size > 5 * 1024 * 1024) {
      throw new Error("File size exceeds 5MB limit");
    }
    
    const form = new FormData();
    form.append("image", file, file.name);
    
    console.log("🔵 [journalsService] Sending POST to /journals/content-image", {
      formDataKeys: Array.from(form.keys()),
      fileInForm: form.has('image'),
      fileObject: form.get('image'),
    });
    
    try {
      // Create axios config that bypasses the default headers
      const response = await api.post("/journals/content-image", form, {
        headers: {
          'Content-Type': undefined, // Let browser set it with boundary
        },
        transformRequest: [(data) => data], // Don't transform FormData
      });
      console.log("🟢 [journalsService] Upload response:", response.data);
      
      if (!response.data?.url) {
        throw new Error("Invalid response from server: missing URL");
      }
      
      return response.data;
    } catch (error: any) {
      console.error("❌ [journalsService] Upload content image error:", {
        status: error?.response?.status,
        data: error?.response?.data,
        message: error?.message,
      });
      
      // Extract error message from response
      let errorMessage = "Failed to upload image";
      if (error?.response?.data) {
        if (error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.data.errors) {
          const errors = error.response.data.errors;
          const errorArray = Object.values(errors).flat() as string[];
          errorMessage = errorArray.join(', ') || errorMessage;
        }
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      throw new Error(errorMessage);
    }
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/journals/${id}`);
  },
};


