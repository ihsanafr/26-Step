import api from "./api";

export type Folder = {
    id: number; // Backend uses number IDs
    user_id: number;
    name: string;
    parent_id: number | null;
    path: string | null;
    created_at: string;
    updated_at: string;
    children?: Folder[];
};

export type ValidationErrors = {
    errors: Record<string, string[]>;
    message: string;
};

export const folderService = {
    getAll: async () => {
        const response = await api.get<Folder[]>("/folders");
        return response.data;
    },

    create: async (name: string, parentId?: number | null) => {
        const response = await api.post<Folder>("/folders", {
            name,
            parent_id: parentId,
        });
        return response.data;
    },

    update: async (id: number, name: string, parentId?: number | null) => {
        const response = await api.put<Folder>(`/folders/${id}`, {
            name,
            parent_id: parentId,
        });
        return response.data;
    },

    delete: async (id: number) => {
        const response = await api.delete(`/folders/${id}`);
        return response.data;
    },
};
