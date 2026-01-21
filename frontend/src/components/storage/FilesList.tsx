import { useEffect, useMemo, useRef, useState } from "react";
import Button from "../ui/button/Button";
import ConfirmDeleteModal from "../common/ConfirmDeleteModal";
import { Skeleton } from "../common/Skeleton";
import { filesService } from "../../services/filesService";
import type { File } from "../../services/filesService";
import { MoreDotIcon, PencilIcon, PlusIcon, SearchIcon, TrashBinIcon, DownloadIcon, EyeIcon, ListIcon, GridIcon, CloseIcon, FolderIcon } from "../../icons";
import { formatIndonesianDate } from "../../utils/date";
import { resolveAssetUrl } from "../../utils/url";
import AlertModal from "../common/AlertModal";

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
}

function getFileIcon(mimeType: string): string {
  if (mimeType.startsWith("image/")) return "🖼️";
  if (mimeType.startsWith("video/")) return "🎥";
  if (mimeType.startsWith("audio/")) return "🎵";
  if (mimeType.includes("pdf")) return "📄";
  if (mimeType.includes("word") || mimeType.includes("document")) return "📝";
  if (mimeType.includes("excel") || mimeType.includes("spreadsheet")) return "📊";
  if (mimeType.includes("powerpoint") || mimeType.includes("presentation")) return "📽️";
  if (mimeType.includes("zip") || mimeType.includes("archive")) return "📦";
  return "📎";
}

function getFileIconComponent(mimeType: string) {
  if (mimeType.includes("pdf")) {
    return (
      <svg className="h-12 w-12 text-red-500" fill="currentColor" viewBox="0 0 24 24">
        <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
      </svg>
    );
  }
  if (mimeType.includes("excel") || mimeType.includes("spreadsheet")) {
    return (
      <svg className="h-12 w-12 text-green-500" fill="currentColor" viewBox="0 0 24 24">
        <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20M17,11H7V13H17V11M17,15H7V17H17V15Z" />
      </svg>
    );
  }
  if (mimeType.includes("word") || mimeType.includes("document")) {
    return (
      <svg className="h-12 w-12 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
        <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20M17,11H7V13H17V11M17,15H7V17H17V15Z" />
      </svg>
    );
  }
  if (mimeType.startsWith("image/")) {
    return (
      <svg className="h-12 w-12 text-purple-500" fill="currentColor" viewBox="0 0 24 24">
        <path d="M8.5,13.5L11,16.5L14.5,12L19,18H5M21,19V5C21,3.89 20.1,3 19,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19Z" />
      </svg>
    );
  }
  return (
    <svg className="h-12 w-12 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
      <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
    </svg>
  );
}

type Folder = {
  id: string;
  name: string;
  path: string;
  parentId?: string;
  children?: Folder[];
  createdAt: string;
};

const STORAGE_KEY = "lifesync_folders";

// Helper functions for folder storage
const loadFoldersFromStorage = (): Folder[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Error loading folders from storage:", error);
  }
  return [];
};

const saveFoldersToStorage = (folders: Folder[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(folders));
  } catch (error) {
    console.error("Error saving folders to storage:", error);
  }
};

export default function FilesList() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<File[]>([]);
  const [customFolders, setCustomFolders] = useState<Folder[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedFolder, setSelectedFolder] = useState<string>("root");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [folderDeleteWarning, setFolderDeleteWarning] = useState<string | null>(null);
  const [editing, setEditing] = useState<File | null>(null);
  const [editName, setEditName] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; item: File | null }>({ open: false, item: null });
  const [deleting, setDeleting] = useState(false);
  const [menuOpenId, setMenuOpenId] = useState<number | null>(null);
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [parentFolderId, setParentFolderId] = useState<string>("root");
  const [previewFile, setPreviewFile] = useState<File | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadFileName, setUploadFileName] = useState("");
  const [uploadFileLocation, setUploadFileLocation] = useState<string>("root");
  const [uploadFiles, setUploadFiles] = useState<FileList | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [closingModal, setClosingModal] = useState<string | null>(null);
  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);
  const [downloadConfirm, setDownloadConfirm] = useState<File | null>(null);
  const [editingFolder, setEditingFolder] = useState<Folder | null>(null);
  const [editFolderName, setEditFolderName] = useState("");
  const [editFolderParent, setEditFolderParent] = useState<string>("root");
  const [deleteFolderModal, setDeleteFolderModal] = useState<{ open: boolean; folder: Folder | null }>({ open: false, folder: null });
  const [deletingFolder, setDeletingFolder] = useState(false);
  const [draggedFile, setDraggedFile] = useState<File | null>(null);
  const [dragOverFolder, setDragOverFolder] = useState<string | null>(null);
  const [folderMenuOpenId, setFolderMenuOpenId] = useState<string | null>(null);
  const [folderMenuPosition, setFolderMenuPosition] = useState<{ top: number; left: number } | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadFileInputRef = useRef<HTMLInputElement>(null);

  // Build folder tree from custom folders and file categories
  const folders: Folder[] = useMemo(() => {
    const folderMap = new Map<string, Folder>();
    const root: Folder = { id: "root", name: "Root", path: "", createdAt: new Date().toISOString() };
    folderMap.set("root", root);
    const customPathMap = new Map<string, Folder>();

    // Helper to build folder path
    const buildPath = (folder: Folder, allFolders: Folder[]): string => {
      if (folder.parentId === "root" || !folder.parentId) {
        return folder.name;
      }
      const parent = allFolders.find((f) => f.id === folder.parentId);
      if (parent) {
        const parentPath = buildPath(parent, allFolders);
        return parentPath ? `${parentPath}/${folder.name}` : folder.name;
      }
      return folder.name;
    };

    // Add custom folders first
    customFolders.forEach((folder) => {
      const path = buildPath(folder, customFolders);
      folder.path = path;
      const mappedFolder = { ...folder, path };
      folderMap.set(folder.id, mappedFolder);
      customPathMap.set(path, mappedFolder);
    });

    // Build tree structure from custom folders
    customFolders.forEach((folder) => {
      const parentId = folder.parentId || "root";
      const parent = folderMap.get(parentId) || root;
      if (!parent.children) {
        parent.children = [];
      }
      if (!parent.children.find((f) => f.id === folder.id)) {
        parent.children.push(folderMap.get(folder.id)!);
      }
    });

    // Add folders from file categories (limit to 3 levels)
    items.forEach((file) => {
      if (file.category) {
        const parts = file.category.split("/");
        let currentPath = "";
        let currentFolder = root;
        let level = 0;

        parts.forEach((part) => {
          // Limit to 3 levels (0 = root, 1, 2, 3)
          if (level >= 3) return;
          
          currentPath = currentPath ? `${currentPath}/${part}` : part;
          const folderId = `category-${currentPath}`;

          const customFolder = customPathMap.get(currentPath);
          if (customFolder) {
            currentFolder = customFolder;
            level++;
            return;
          }

          if (!folderMap.has(folderId)) {
            const newFolder: Folder = {
              id: folderId,
              name: part,
              path: currentPath,
              createdAt: new Date().toISOString(),
            };
            folderMap.set(folderId, newFolder);
            if (!currentFolder.children) {
              currentFolder.children = [];
            }
            currentFolder.children.push(newFolder);
          }
          currentFolder = folderMap.get(folderId)!;
          level++;
        });
      }
    });

    // Sort children alphabetically
    const sortFolders = (folder: Folder) => {
      if (folder.children) {
        folder.children.sort((a, b) => a.name.localeCompare(b.name));
        folder.children.forEach(sortFolders);
      }
    };
    sortFolders(root);

    return [root];
  }, [items, customFolders]);

  const allFolders = useMemo(() => {
    const collected: Folder[] = [];
    const walk = (folder: Folder) => {
      collected.push(folder);
      (folder.children || []).forEach(walk);
    };
    folders.forEach(walk);
    return collected;
  }, [folders]);

  const load = async () => {
    try {
      setLoading(true);
      const data = await filesService.getAll().catch(() => []);
      setItems(data || []);
    } catch (e) {
      console.error("Error loading files:", e);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const loadFolders = () => {
    try {
      const stored = loadFoldersFromStorage();
      setCustomFolders(stored || []);
    } catch (e) {
      console.error("Error loading folders:", e);
      setCustomFolders([]);
    }
  };

  useEffect(() => {
    void load();
    loadFolders();
  }, []);

  useEffect(() => {
    if (menuOpenId === null) return;
    const onMouseDown = (e: MouseEvent) => {
      const el = menuRef.current;
      if (!el) return;
      if (e.target instanceof Node && !el.contains(e.target)) setMenuOpenId(null);
    };
    window.addEventListener("mousedown", onMouseDown);
    return () => window.removeEventListener("mousedown", onMouseDown);
  }, [menuOpenId]);

  useEffect(() => {
    if (folderMenuOpenId === null) {
      setFolderMenuPosition(null);
      return;
    }
    const onMouseDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-folder-menu]')) {
        setFolderMenuOpenId(null);
        setFolderMenuPosition(null);
      }
    };
    window.addEventListener("mousedown", onMouseDown);
    return () => window.removeEventListener("mousedown", onMouseDown);
  }, [folderMenuOpenId]);

  const categories = useMemo(() => {
    const set = new Set(items.map((f) => f.category).filter(Boolean) as string[]);
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [items]);

  const fileTypes = useMemo(() => {
    const types = new Set<string>();
    items.forEach((f) => {
      if (f.mime_type.includes("pdf")) types.add("PDF");
      else if (f.mime_type.includes("word") || f.mime_type.includes("document")) types.add("Word");
      else if (f.mime_type.includes("excel") || f.mime_type.includes("spreadsheet")) types.add("Excel");
      else if (f.mime_type.startsWith("image/")) types.add("Image");
      else if (f.mime_type.startsWith("video/")) types.add("Video");
      else types.add("Other");
    });
    return Array.from(types).sort();
  }, [items]);

  const filtered = useMemo(() => {
    let filtered = items;

    // Filter by folder (category)
    if (selectedFolder !== "root") {
      const folder = allFolders.find((f) => f.id === selectedFolder);
      if (folder) {
        filtered = filtered.filter((f) => f.category === folder.path);
      }
    } else {
      filtered = filtered.filter((f) => !f.category || f.category === "");
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase();
      filtered = filtered.filter((f) => {
        return (
          (f.name || "").toLowerCase().includes(query) ||
          (f.original_name || "").toLowerCase().includes(query) ||
          (f.description || "").toLowerCase().includes(query) ||
          (f.category || "").toLowerCase().includes(query)
        );
      });
    }

    // Filter by type
    if (typeFilter !== "all") {
      filtered = filtered.filter((f) => {
        if (typeFilter === "PDF") return f.mime_type.includes("pdf");
        if (typeFilter === "Word") return f.mime_type.includes("word") || f.mime_type.includes("document");
        if (typeFilter === "Excel") return f.mime_type.includes("excel") || f.mime_type.includes("spreadsheet");
        if (typeFilter === "Image") return f.mime_type.startsWith("image/");
        if (typeFilter === "Video") return f.mime_type.startsWith("video/");
        return true;
      });
    }

    // Filter by category
    if (categoryFilter !== "all") {
      filtered = filtered.filter((f) => f.category === categoryFilter);
    }

    return filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }, [items, selectedFolder, searchQuery, typeFilter, categoryFilter, allFolders]);

  // Get subfolders in the current folder
  const currentSubfolders = useMemo(() => {
    if (selectedFolder === "root") {
      // Get all direct children of root (both custom folders and category folders)
      return folders[0]?.children || [];
    }
    
    const folder = allFolders.find((f) => f.id === selectedFolder);
    
    if (!folder) return [];
    
    // Get direct children of the selected folder
    return folder.children || [];
  }, [selectedFolder, folders, allFolders]);

  const currentFolder = useMemo(() => {
    if (selectedFolder === "root") {
      return { id: "root", name: "Root", path: "" };
    }
    return allFolders.find((f) => f.id === selectedFolder) || { id: "root", name: "Root", path: "" };
  }, [selectedFolder, allFolders]);

  const handleUpload = async () => {
    if (!uploadFiles || uploadFiles.length === 0) return;

    try {
      setUploading(true);
      setUploadError(null);
      
      // Check for duplicate files
      const fileArray = Array.from(uploadFiles);
      const duplicateFiles: string[] = [];
      
      fileArray.forEach((file) => {
        const fileName = uploadFileName.trim() || file.name;
        const existingFile = items.find(
          (f) => (f.name === fileName || f.original_name === fileName) &&
          f.category === (uploadFileLocation !== "root" ? allFolders.find((f) => f.id === uploadFileLocation)?.path : undefined)
        );
        if (existingFile) {
          duplicateFiles.push(fileName);
        }
      });
      
      if (duplicateFiles.length > 0) {
        setUploadError(`File dengan nama berikut sudah ada: ${duplicateFiles.join(", ")}. Silakan gunakan nama yang berbeda.`);
        setUploading(false);
        return;
      }
      
      // Get folder path for category
      let category: string | undefined = undefined;
      if (uploadFileLocation !== "root") {
        const folder = allFolders.find((f) => f.id === uploadFileLocation);
        if (folder && folder.path) {
          category = folder.path;
        }
      }
      
      // If uploadFileName is provided and only one file, rename it
      let filesToUpload = uploadFiles;
      if (uploadFileName.trim() && fileArray.length === 1) {
        const originalFile = fileArray[0];
        const extension = originalFile.name.substring(originalFile.name.lastIndexOf('.'));
        const newName = uploadFileName.trim() + extension;
        
        // Create a new File object with the new name
        const renamedFile = new File([originalFile], newName, { type: originalFile.type });
        filesToUpload = [renamedFile] as any;
      }
      
      await filesService.upload(filesToUpload, category);
      await load();
      
      // Reset upload modal with animation
      setClosingModal("upload");
      setTimeout(() => {
        setShowUploadModal(false);
        setUploadFileName("");
        setUploadFileLocation(selectedFolder);
        setUploadFiles(null);
        setClosingModal(null);
        if (uploadFileInputRef.current) uploadFileInputRef.current.value = "";
      }, 200);
    } catch (error: any) {
      console.error("Error uploading files:", error);
      setUploadError(error.response?.data?.message || "Gagal mengunggah file");
    } finally {
      setUploading(false);
    }
  };

  const handleUploadFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setUploadFiles(files);
      // Set default name from first file if no name entered
      if (!uploadFileName && files.length === 1) {
        setUploadFileName(files[0].name.replace(/\.[^/.]+$/, ""));
      }
    }
  };

  const openUploadModal = () => {
    setUploadFileName("");
    setUploadFileLocation(selectedFolder);
    setUploadFiles(null);
    setShowUploadModal(true);
  };

  const handleEdit = (file: File) => {
    setEditing(file);
    setEditName(file.name);
    // Find folder ID from category path
    if (file.category) {
      const folder = allFolders.find((f) => f.path === file.category || f.name === file.category);
      setEditCategory(folder ? folder.id : file.category);
    } else {
      setEditCategory("root");
    }
    setEditDescription(file.description || "");
  };

  const handleDownloadClick = (file: File) => {
    setDownloadConfirm(file);
  };

  const handleDownloadConfirm = async () => {
    if (!downloadConfirm) return;
    
    try {
      setUploadError(null);
      const blob = await filesService.download(downloadConfirm.id);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = downloadConfirm.original_name || downloadConfirm.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      setDownloadNotice(`Download dimulai: ${downloadConfirm.original_name || downloadConfirm.name}`);
      setDownloadConfirm(null);
    } catch (error: any) {
      console.error("Error downloading file:", error);
      setUploadError(error.response?.data?.message || "Gagal mengunduh file");
      setDownloadConfirm(null);
    }
  };

  const handleCardClick = (e: React.MouseEvent, file: File) => {
    const target = e.target as HTMLElement | null;
    if (target && target.closest("[data-file-menu]")) return;
    setPreviewFile(file);
  };

  const handleSave = async () => {
    if (!editing || !editName.trim()) return;
    try {
      setSaving(true);
      setUploadError(null);
      
      // Get folder path for category if editCategory is a folder ID
      let category: string | null = null;
      if (editCategory) {
        const folder = allFolders.find((f) => f.id === editCategory);
        if (folder && folder.id !== "root") {
          category = folder.path || folder.name;
        } else if (!editCategory.startsWith("folder-") && !editCategory.startsWith("category-")) {
          category = editCategory;
        }
      }
      
      await filesService.update(editing.id, {
        name: editName.trim(),
        category: category,
        description: editDescription || null,
      });
      setClosingModal("edit");
      setTimeout(() => {
        setEditing(null);
        setEditCategory("");
        setClosingModal(null);
        void load();
      }, 200);
    } catch (error: any) {
      console.error("Error updating file:", error);
      setUploadError(error.response?.data?.message || "Gagal memperbarui file");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteModal.item) return;
    try {
      setDeleting(true);
      await filesService.delete(deleteModal.item.id);
      setDeleteModal({ open: false, item: null });
      await load();
    } catch (error: any) {
      console.error("Error deleting file:", error);
      setUploadError(error.response?.data?.message || "Failed to delete file");
      setDeleteModal({ open: false, item: null });
    } finally {
      setDeleting(false);
    }
  };

  const handleCreateFolder = () => {
    setEditingFolder(null);
    setEditFolderName("");
    setEditFolderParent("root");
    setNewFolderName("");
    setParentFolderId(selectedFolder);
    setShowFolderModal(true);
  };

  const getFolderDepth = (folderId: string): number => {
    if (folderId === "root") return 0;
    const folder = allFolders.find((f) => f.id === folderId);
    if (!folder) return 0;
    
    let depth = 0;
    let current = folder;
    while (current.parentId && current.parentId !== "root") {
      depth++;
      const parent = allFolders.find((f) => f.id === current.parentId);
      if (!parent) break;
      current = parent;
    }
    return depth + 1; // +1 because we're adding a child
  };

  const handleSaveFolder = () => {
    if (editingFolder) {
      // Edit existing folder
      if (!editFolderName.trim()) return;
      
      try {
        // Check if moving to new parent would exceed depth limit
        if (editFolderParent !== editingFolder.parentId) {
          const newDepth = getFolderDepth(editFolderParent);
          if (newDepth >= 3) {
            setUploadError("Maximum folder depth is 3 levels. Cannot move folder to this level.");
            return;
          }
          
          // Check if folder would be moved into itself or its children
          const isDescendant = (folderId: string, ancestorId: string): boolean => {
            if (folderId === ancestorId) return true;
            const folder = allFolders.find((f) => f.id === folderId);
            if (!folder || !folder.parentId) return false;
            return isDescendant(folder.parentId, ancestorId);
          };
          
          if (isDescendant(editFolderParent, editingFolder.id)) {
            setUploadError("Cannot move folder into itself or its subfolders.");
            return;
          }
        }
        
        // Check if folder name already exists in the same parent (if name changed or parent changed)
        if (editFolderName.trim() !== editingFolder.name || editFolderParent !== (editingFolder.parentId || "root")) {
          const parent = allFolders.find((f) => f.id === editFolderParent);
          
          if (parent?.children?.some((f) => f.id !== editingFolder.id && f.name.toLowerCase() === editFolderName.trim().toLowerCase())) {
            setUploadError("A folder with this name already exists in this folder");
            return;
          }
        }

        // Update folder
        const updatedFolders = customFolders.map((f) =>
          f.id === editingFolder.id
            ? { ...f, name: editFolderName.trim(), parentId: editFolderParent === "root" ? undefined : editFolderParent }
            : f
        );
        setCustomFolders(updatedFolders);
        saveFoldersToStorage(updatedFolders);

        // Close modal and reset with animation
        setClosingModal("folder");
        setTimeout(() => {
          setShowFolderModal(false);
          setEditingFolder(null);
          setEditFolderName("");
          setEditFolderParent("root");
          setNewFolderName("");
          setParentFolderId("root");
          setClosingModal(null);
        }, 200);
      } catch (error) {
        console.error("Error updating folder:", error);
        setUploadError("Failed to update folder");
      }
    } else {
      // Create new folder
      if (!newFolderName.trim()) return;
      
      try {
        const currentDepth = getFolderDepth(parentFolderId);
        if (currentDepth >= 3) {
          setUploadError("Maximum folder depth is 3 levels. Cannot create folder at this level.");
          return;
        }
        
        // Check if folder name already exists in the same parent
        const parent = allFolders.find((f) => f.id === parentFolderId);
        
        if (parent?.children?.some((f) => f.name.toLowerCase() === newFolderName.trim().toLowerCase())) {
          setUploadError("Folder dengan nama tersebut sudah ada di folder ini");
          return;
        }

        // Create new folder
        const newFolder: Folder = {
          id: `folder-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name: newFolderName.trim(),
          path: "",
          parentId: parentFolderId === "root" ? undefined : parentFolderId,
          createdAt: new Date().toISOString(),
        };

        // Add to custom folders
        const updatedFolders = [...customFolders, newFolder];
        setCustomFolders(updatedFolders);
        saveFoldersToStorage(updatedFolders);

        // Close modal and reset with animation
        setClosingModal("folder");
        setTimeout(() => {
          setShowFolderModal(false);
          setNewFolderName("");
          setParentFolderId("root");
          setClosingModal(null);
        }, 200);
      } catch (error) {
        console.error("Error creating folder:", error);
        setUploadError("Failed to create folder");
      }
    }
  };

  const handleEditFolder = (folder: Folder) => {
    if (folder.id === "root" || folder.id.startsWith("category-")) {
      setUploadError("Default folders cannot be edited");
      return;
    }
    setEditingFolder(folder);
    setEditFolderName(folder.name);
    setEditFolderParent(folder.parentId || "root");
    setShowFolderModal(true);
  };

  const handleDeleteFolder = async () => {
    if (!deleteFolderModal.folder) return;
    
    try {
      setDeletingFolder(true);
      
      // Check if folder has children
      const folder = allFolders.find((f) => f.id === deleteFolderModal.folder!.id);
      
      if (folder?.children && folder.children.length > 0) {
        setFolderDeleteWarning(
          `Folder "${folder.name}" cannot be deleted because it still has subfolders. Delete or move subfolders first.`
        );
        setDeleteFolderModal({ open: false, folder: null });
        setDeletingFolder(false);
        return;
      }
      
      // Check if folder has files
      const folderPath = folder?.path || "";
      const hasFiles = items.some((file) => file.category === folderPath || file.category?.startsWith(folderPath + "/"));
      
      if (hasFiles) {
        setFolderDeleteWarning(
          `Folder "${folder?.name || "this"}" cannot be deleted because it still contains files. Move or delete files first.`
        );
        setDeleteFolderModal({ open: false, folder: null });
        setDeletingFolder(false);
        return;
      }
      
      // Delete folder
      const updatedFolders = customFolders.filter((f) => f.id !== deleteFolderModal.folder!.id);
      setCustomFolders(updatedFolders);
      saveFoldersToStorage(updatedFolders);
      
      // If deleted folder was selected, go to root
      if (selectedFolder === deleteFolderModal.folder!.id) {
        setSelectedFolder("root");
      }
      
      setDeleteFolderModal({ open: false, folder: null });
    } catch (error) {
      console.error("Error deleting folder:", error);
      setUploadError("Gagal menghapus folder");
      setDeleteFolderModal({ open: false, folder: null });
    } finally {
      setDeletingFolder(false);
    }
  };

  const handleMoveFile = async (file: File, targetFolderId: string) => {
    try {
      let category: string | null = null;
      if (targetFolderId !== "root") {
        const folder = allFolders.find((f) => f.id === targetFolderId);
        if (folder && folder.id !== "root") {
          category = folder.path || folder.name;
        }
      }
      
      // Update file on backend
      const updatedFile = await filesService.update(file.id, {
        category: category,
      });
      
      // Update local state without reloading
      setItems((prevItems) =>
        prevItems.map((item) => (item.id === file.id ? updatedFile : item))
      );
      
      // If file was moved to a different folder and we're viewing the old folder, 
      // the file will automatically disappear from the filtered list
      // If moved to current folder, it will appear automatically
    } catch (error: any) {
      console.error("Error moving file:", error);
      setUploadError(error.response?.data?.message || "Failed to move file");
    }
  };

  const renderFolderTree = (folder: Folder, level: number = 0) => {
    const isSelected = selectedFolder === folder.id;
    const isCustomFolder = folder.id.startsWith("folder-");
    
    return (
      <div key={folder.id}>
        <div
          className={`group relative mb-1 flex items-center gap-2 rounded-lg transition-all duration-200 ${
            dragOverFolder === folder.id ? "bg-indigo-200 dark:bg-indigo-900/50" : ""
          }`}
          onDragOver={(e) => {
            if (draggedFile) {
              e.preventDefault();
              e.stopPropagation();
              setDragOverFolder(folder.id);
            }
          }}
          onDragLeave={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget as Node)) {
              setDragOverFolder(null);
            }
          }}
          onDrop={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (draggedFile) {
              handleMoveFile(draggedFile, folder.id);
              setDraggedFile(null);
              setDragOverFolder(null);
            }
          }}
        >
          <button
            onClick={() => setSelectedFolder(folder.id)}
            className={`flex flex-1 items-center gap-2.5 rounded-lg px-3 py-2 text-left transition-all duration-200 ${
              isSelected
                ? "bg-indigo-100 text-indigo-700 shadow-sm dark:bg-indigo-900/30 dark:text-indigo-400"
                : "text-gray-700 hover:bg-gray-100 hover:shadow-sm hover:scale-[1.02] dark:text-gray-300 dark:hover:bg-gray-800"
            }`}
            style={{ paddingLeft: `${12 + level * 20}px` }}
          >
            <FolderIcon 
              className={`h-5 w-5 shrink-0 transition-colors ${
                isSelected 
                  ? "text-indigo-600 dark:text-indigo-400" 
                  : "text-yellow-500 dark:text-yellow-400"
              }`}
              color={isSelected ? "#4f46e5" : "#eab308"}
            />
            <span className="truncate text-sm font-medium">{folder.name}</span>
          </button>
          {isCustomFolder && (
            <div className="relative" data-folder-menu>
              <button
                data-folder-menu
                onClick={(e) => {
                  e.stopPropagation();
                  if (folderMenuOpenId === folder.id) {
                    setFolderMenuOpenId(null);
                    setFolderMenuPosition(null);
                  } else {
                    const rect = e.currentTarget.getBoundingClientRect();
                    setFolderMenuOpenId(folder.id);
                    setFolderMenuPosition({
                      top: rect.bottom + 4,
                      left: rect.right - 160, // 160 is menu width (w-40)
                    });
                  }
                }}
                className="rounded-lg p-1.5 text-gray-400 opacity-0 transition-all hover:bg-gray-100 hover:text-gray-600 group-hover:opacity-100 dark:hover:bg-gray-700"
              >
                <MoreDotIcon className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
        {folder.children && folder.children.length > 0 && (
          <div className="ml-4">
            {folder.children.map((child) => renderFolderTree(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-sm dark:border-gray-800 dark:bg-gray-800">
          <div className="mb-4">
            <Skeleton className="mb-2 h-7 w-56" />
            <Skeleton className="h-4 w-40" />
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <Skeleton className="h-11 w-40 rounded-lg" />
            <Skeleton className="h-11 w-32 rounded-lg" />
            <div className="ml-auto flex flex-wrap items-center gap-3">
              <Skeleton className="h-10 w-56 rounded-lg" />
              <Skeleton className="h-10 w-32 rounded-lg" />
              <Skeleton className="h-10 w-32 rounded-lg" />
            </div>
          </div>
        </div>
        <div className="flex gap-6">
          <div className="w-64 space-y-3">
            <Skeleton className="h-10 w-full rounded-lg" />
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-8 w-full rounded-lg" />
            ))}
          </div>
          <div className="flex-1 space-y-4">
            <Skeleton className="h-10 w-48 rounded-lg" />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton key={i} className="h-40 rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-sm dark:border-gray-800 dark:bg-gray-800">
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Manajemen Dokumen</h1>
          <nav className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            <span>Home</span>
            <span className="mx-2">/</span>
            <span className="text-gray-900 dark:text-white">Dokumen</span>
          </nav>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={openUploadModal}
            disabled={uploading}
            className={`inline-flex items-center justify-center gap-2 rounded-lg px-5 py-3.5 text-sm font-medium text-white transition ${
              uploading
                ? "cursor-not-allowed bg-indigo-400 opacity-50"
                : "cursor-pointer bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            }`}
          >
            {uploading ? (
              <>
                <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Mengunggah...
              </>
            ) : (
              <>
                <PlusIcon className="h-5 w-5" />
                Upload Dokumen
              </>
            )}
          </button>

          <Button
            onClick={handleCreateFolder}
            variant="outline"
            className="border-gray-300 bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800"
          >
            <FolderIcon className="mr-2 h-5 w-5" color="#eab308" />
            Folder Baru
          </Button>

          <div className="ml-auto flex items-center gap-3">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Cari file..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
              />
            </div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            >
              <option value="all">Semua Tipe</option>
              {fileTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            >
              <option value="all">Semua Kategori</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            <div className="flex rounded-lg border border-gray-300 bg-white p-1 dark:border-gray-700 dark:bg-gray-800">
              <button
                onClick={() => setViewMode("list")}
                className={`rounded px-3 py-1.5 transition-colors ${
                  viewMode === "list"
                    ? "bg-indigo-600 text-white"
                    : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
                }`}
              >
                <ListIcon className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`rounded px-3 py-1.5 transition-colors ${
                  viewMode === "grid"
                    ? "bg-indigo-600 text-white"
                    : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
                }`}
              >
                <GridIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex gap-6">
        {/* Left Sidebar - Folder Structure */}
        <div className="w-64 shrink-0 rounded-2xl border border-gray-200 bg-white p-4 shadow-theme-sm dark:border-gray-800 dark:bg-gray-800">
          <h2 className="mb-4 text-sm font-semibold text-gray-900 dark:text-white">Struktur Folder</h2>
          <div className="max-h-[calc(100vh-300px)] overflow-y-auto">
            {folders && folders.length > 0 ? folders.map((folder) => renderFolderTree(folder)) : <div className="text-sm text-gray-500 dark:text-gray-400">No folders</div>}
          </div>
        </div>

        {/* Folder Menu Dropdown - Fixed Position (outside container) */}
        {folderMenuOpenId && folderMenuPosition && (
          <div
            data-folder-menu
            className="fixed z-[100000] w-40 rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800"
            style={{
              top: `${folderMenuPosition.top}px`,
              left: `${folderMenuPosition.left}px`,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {(() => {
              const folder = allFolders.find((f) => f.id === folderMenuOpenId);
              if (!folder) return null;
              return (
                <>
                  <button
                    data-folder-menu
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditFolder(folder);
                      setFolderMenuOpenId(null);
                      setFolderMenuPosition(null);
                    }}
                    className="flex w-full items-center gap-3 px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    <PencilIcon className="h-4 w-4" />
                    Edit
                  </button>
                  <button
                    data-folder-menu
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteFolderModal({ open: true, folder });
                      setFolderMenuOpenId(null);
                      setFolderMenuPosition(null);
                    }}
                    className="flex w-full items-center gap-3 px-4 py-2 text-sm text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/20"
                  >
                    <TrashBinIcon className="h-4 w-4" />
                    Delete
                  </button>
                </>
              );
            })()}
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-sm dark:border-gray-800 dark:bg-gray-800">
          {/* Current Location */}
          <div className="mb-6 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <FolderIcon className="h-5 w-5" color="#eab308" />
            <span className="font-medium">{currentFolder.name}</span>
          </div>

          {/* Files Display */}
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <FolderIcon className="mb-4 h-16 w-16" color="#9ca3af" />
              <p className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                {items.length === 0 ? "No documents yet" : "No documents found"}
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                {items.length === 0 ? "Upload dokumen pertama Anda untuk memulai" : "Coba ubah filter atau pilih folder lain"}
              </p>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {/* Display Files */}
              {filtered.map((file) => {
                const fileUrl = resolveAssetUrl((file as any).url || `/storage/${file.path}`);
                return (
                  <div
                    key={file.id}
                    draggable
                    onDragStart={(e) => {
                      setDraggedFile(file);
                      e.dataTransfer.effectAllowed = "move";
                    }}
                    onDragEnd={() => {
                      setDraggedFile(null);
                      setDragOverFolder(null);
                    }}
                    onClick={(e) => handleCardClick(e, file)}
                    className="group relative cursor-pointer rounded-xl border border-gray-200 bg-white p-4 shadow-theme-sm transition-all duration-200 hover:border-indigo-300 hover:shadow-theme-md hover:scale-[1.02] hover:-translate-y-1 dark:border-gray-700 dark:bg-gray-800"
                  >
                    <div className="relative mb-3">
                      <div className="flex h-20 items-center justify-center rounded-lg bg-gray-50 dark:bg-gray-700">
                        {getFileIconComponent(file.mime_type)}
                      </div>
                      <div className="absolute right-2 top-2 z-10" data-file-menu>
                        <button
                          data-file-menu
                          onClick={(e) => {
                            e.stopPropagation();
                            setMenuOpenId(menuOpenId === file.id ? null : file.id);
                          }}
                          onMouseDown={(e) => e.stopPropagation()}
                          className="rounded-lg bg-white/90 p-1.5 text-gray-400 shadow-sm transition-all hover:bg-gray-100 hover:text-gray-600 hover:shadow-md dark:bg-gray-800/90 dark:hover:bg-gray-700"
                        >
                          <MoreDotIcon className="h-4 w-4" />
                        </button>
                      {menuOpenId === file.id && (
                        <div
                          ref={menuRef}
                          data-file-menu
                          onClick={(e) => e.stopPropagation()}
                          className="absolute right-0 z-50 mt-1 w-48 rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800"
                        >
                          <button
                            data-file-menu
                            onClick={(e) => {
                              e.stopPropagation();
                              setPreviewFile(file);
                              setMenuOpenId(null);
                            }}
                            className="flex w-full items-center gap-3 px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                          >
                            <EyeIcon className="h-4 w-4" />
                            Lihat
                          </button>
                          <button
                            data-file-menu
                            onClick={(e) => {
                              e.stopPropagation();
                              setMenuOpenId(null);
                              handleDownloadClick(file);
                            }}
                            className="flex w-full items-center gap-3 px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                          >
                            <DownloadIcon className="h-4 w-4" />
                            Download
                          </button>
                          <button
                            data-file-menu
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(file);
                              setMenuOpenId(null);
                            }}
                            className="flex w-full items-center gap-3 px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                          >
                            <PencilIcon className="h-4 w-4" />
                            Edit
                          </button>
                          <button
                            data-file-menu
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteModal({ open: true, item: file });
                              setMenuOpenId(null);
                            }}
                            className="flex w-full items-center gap-3 px-4 py-2 text-sm text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/20"
                          >
                            <TrashBinIcon className="h-4 w-4" />
                            Hapus
                          </button>
                        </div>
                      )}
                      </div>
                    </div>
                    <div>
                      <h3 className="mb-1 truncate text-sm font-semibold text-gray-900 dark:text-white">
                        {file.original_name || file.name}
                      </h3>
                      <p className="mb-1 text-xs text-gray-500 dark:text-gray-400">
                        {formatFileSize(file.size)}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {formatIndonesianDate(file.created_at)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="space-y-2">
              {/* Display Files in List View */}
              {filtered.map((file) => {
                const fileUrl = resolveAssetUrl((file as any).url || `/storage/${file.path}`);
                return (
                  <div
                    key={file.id}
                    draggable
                    onDragStart={(e) => {
                      setDraggedFile(file);
                      e.dataTransfer.effectAllowed = "move";
                    }}
                    onDragEnd={() => {
                      setDraggedFile(null);
                      setDragOverFolder(null);
                    }}
                    onClick={(e) => handleCardClick(e, file)}
                    className="group flex cursor-pointer items-center gap-4 rounded-lg border border-gray-200 bg-white p-4 transition-all duration-200 hover:border-indigo-300 hover:bg-indigo-50/50 hover:shadow-theme-sm hover:scale-[1.01] dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-indigo-950/20"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-50 dark:bg-gray-700">
                      {getFileIconComponent(file.mime_type)}
                    </div>
                    <div className="grow">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {file.original_name || file.name}
                      </h3>
                      <div className="mt-1 flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                        <span>{formatFileSize(file.size)}</span>
                        <span>•</span>
                        <span>{formatIndonesianDate(file.created_at)}</span>
                        {file.category && (
                          <>
                            <span>•</span>
                            <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300">
                              {file.category}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="relative" data-file-menu>
                      <button
                        data-file-menu
                        onClick={(e) => {
                          e.stopPropagation();
                          setMenuOpenId(menuOpenId === file.id ? null : file.id);
                        }}
                        onMouseDown={(e) => e.stopPropagation()}
                        className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700"
                      >
                        <MoreDotIcon className="h-5 w-5" />
                      </button>
                      {menuOpenId === file.id && (
                        <div
                          ref={menuRef}
                          data-file-menu
                          onClick={(e) => e.stopPropagation()}
                          className="absolute right-0 z-50 mt-1 w-48 rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800"
                        >
                            <button
                              data-file-menu
                              onClick={(e) => {
                                e.stopPropagation();
                                setPreviewFile(file);
                                setMenuOpenId(null);
                              }}
                              className="flex w-full items-center gap-3 px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                            >
                              <EyeIcon className="h-4 w-4" />
                              Lihat
                            </button>
                          <button
                            data-file-menu
                            onClick={(e) => {
                              e.stopPropagation();
                              setMenuOpenId(null);
                              handleDownloadClick(file);
                            }}
                            className="flex w-full items-center gap-3 px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                          >
                            <DownloadIcon className="h-4 w-4" />
                            Download
                          </button>
                          <button
                            data-file-menu
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(file);
                              setMenuOpenId(null);
                            }}
                            className="flex w-full items-center gap-3 px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                          >
                            <PencilIcon className="h-4 w-4" />
                            Edit
                          </button>
                          <button
                            data-file-menu
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteModal({ open: true, item: file });
                              setMenuOpenId(null);
                            }}
                            className="flex w-full items-center gap-3 px-4 py-2 text-sm text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/20"
                          >
                            <TrashBinIcon className="h-4 w-4" />
                            Hapus
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div
          className={`fixed inset-0 z-100000 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm transition-opacity duration-200 ${
            closingModal === "upload" ? "opacity-0" : "opacity-100"
          }`}
          onClick={() => {
            setClosingModal("upload");
            setTimeout(() => {
              setShowUploadModal(false);
              setUploadFileName("");
              setUploadFileLocation(selectedFolder);
              setUploadFiles(null);
              setClosingModal(null);
            }, 200);
          }}
        >
          <div
            className={`w-full max-w-2xl rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl transition-all duration-200 dark:border-gray-700 dark:bg-gray-800 ${
              closingModal === "upload"
                ? "animate-out fade-out slide-out-to-bottom-4"
                : "animate-in fade-in slide-in-from-bottom-4"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 dark:bg-indigo-900/30">
                  <PlusIcon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Upload Dokumen</h2>
              </div>
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  setUploadFileName("");
                  setUploadFileLocation(selectedFolder);
                  setUploadFiles(null);
                }}
                className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700"
              >
                <CloseIcon className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Nama File (Opsional)
                </label>
                <input
                  type="text"
                  value={uploadFileName}
                  onChange={(e) => setUploadFileName(e.target.value)}
                  placeholder="Leave empty to use original filename"
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-700 dark:text-white"
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  If left empty, will use the original filename
                </p>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Pilih File
                </label>
                <input
                  ref={uploadFileInputRef}
                  type="file"
                  multiple
                  onChange={handleUploadFileSelect}
                  className="hidden"
                  id="upload-file-input"
                />
                <label
                  htmlFor="upload-file-input"
                  className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-8 transition-colors hover:border-indigo-400 hover:bg-indigo-50/50 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-indigo-600"
                >
                  <FolderIcon className="mb-3 h-12 w-12 text-gray-400" color="#9ca3af" />
                  <p className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Klik untuk memilih file
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Atau drag and drop file di sini
                  </p>
                </label>
                {uploadFiles && uploadFiles.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {Array.from(uploadFiles).map((file, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-800"
                      >
                        <div className="flex h-8 w-8 items-center justify-center rounded bg-indigo-100 dark:bg-indigo-900/30">
                          {getFileIconComponent(file.type)}
                        </div>
                        <div className="grow">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {file.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {formatFileSize(file.size)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Lokasi Folder
                </label>
                <select
                  value={uploadFileLocation}
                  onChange={(e) => setUploadFileLocation(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-700 dark:text-white"
                >
                  <option value="root">Root</option>
                  {allFolders
                    .filter((f) => f.id !== "root" && f.id.startsWith("folder-"))
                    .map((folder) => (
                      <option key={folder.id} value={folder.id}>
                        {folder.path || folder.name}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <Button
                onClick={handleUpload}
                disabled={uploading || !uploadFiles || uploadFiles.length === 0}
                className="grow bg-indigo-600 hover:bg-indigo-700"
              >
                {uploading ? "Mengunggah..." : "Upload"}
              </Button>
              <Button
                onClick={() => {
                  setClosingModal("upload");
                  setTimeout(() => {
                    setShowUploadModal(false);
                    setUploadFileName("");
                    setUploadFileLocation(selectedFolder);
                    setUploadFiles(null);
                    setClosingModal(null);
                  }, 200);
                }}
                variant="outline"
                className="grow"
              >
                Batal
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editing && (
        <div
          className={`fixed inset-0 z-100000 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm transition-opacity duration-200 ${
            closingModal === "edit" ? "opacity-0" : "opacity-100"
          }`}
          onClick={() => {
            setClosingModal("edit");
            setTimeout(() => {
              setEditing(null);
              setClosingModal(null);
            }, 200);
          }}
        >
          <div
            className={`w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl transition-all duration-200 dark:border-gray-700 dark:bg-gray-800 ${
              closingModal === "edit"
                ? "animate-out fade-out slide-out-to-bottom-4"
                : "animate-in fade-in slide-in-from-bottom-4"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">Edit File</h2>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Nama
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Lokasi Folder
                </label>
                <select
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-700 dark:text-white"
                >
                  <option value="root">Root</option>
                  {allFolders
                    .filter((f) => f.id !== "root")
                    .map((folder) => (
                      <option key={folder.id} value={folder.id}>
                        {folder.path || folder.name}
                      </option>
                    ))}
                </select>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Pilih folder untuk memindahkan file
                </p>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Deskripsi
                </label>
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  rows={3}
                  placeholder="Deskripsi opsional"
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <Button
                onClick={handleSave}
                disabled={saving || !editName.trim()}
                className="grow"
              >
                {saving ? "Saving..." : "Save"}
              </Button>
              <Button
                onClick={() => {
                  setClosingModal("edit");
                  setTimeout(() => {
                    setEditing(null);
                    setClosingModal(null);
                  }, 200);
                }}
                variant="outline"
                className="grow"
              >
                Batal
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Folder Modal */}
      {showFolderModal && (
        <div
          className={`fixed inset-0 z-100000 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm transition-opacity duration-200 ${
            closingModal === "folder" ? "opacity-0" : "opacity-100"
          }`}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setClosingModal("folder");
              setTimeout(() => {
                setShowFolderModal(false);
                setNewFolderName("");
                setParentFolderId("root");
                setClosingModal(null);
              }, 200);
            }
          }}
        >
          <div
            className={`w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl transition-all duration-200 dark:border-gray-700 dark:bg-gray-800 ${
              closingModal === "folder"
                ? "animate-out fade-out slide-out-to-bottom-4"
                : "animate-in fade-in slide-in-from-bottom-4"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center gap-3">
              <FolderIcon className="h-6 w-6" color="#eab308" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {editingFolder ? "Edit Folder" : "Folder Baru"}
              </h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Nama Folder
                </label>
                <input
                  type="text"
                  value={editingFolder ? editFolderName : newFolderName}
                  onChange={(e) => {
                    if (editingFolder) {
                      setEditFolderName(e.target.value);
                    } else {
                      setNewFolderName(e.target.value);
                    }
                  }}
                  onKeyDown={(e) => {
                    const name = editingFolder ? editFolderName : newFolderName;
                    if (e.key === "Enter" && name.trim()) {
                      handleSaveFolder();
                    }
                  }}
                  placeholder="Masukkan nama folder"
                  autoFocus
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Lokasi Folder
                </label>
                <select
                  value={editingFolder ? editFolderParent : parentFolderId}
                  onChange={(e) => {
                    if (editingFolder) {
                      setEditFolderParent(e.target.value);
                    } else {
                      setParentFolderId(e.target.value);
                    }
                  }}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-700 dark:text-white"
                >
                  <option value="root">Root</option>
                  {allFolders
                    .filter((f) => f.id !== "root" && f.id.startsWith("folder-") && (!editingFolder || f.id !== editingFolder.id))
                    .map((folder) => (
                      <option key={folder.id} value={folder.id}>
                        {folder.path || folder.name}
                      </option>
                    ))}
                </select>
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  Pilih folder parent untuk menentukan tata letak folder
                </p>
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <Button
                onClick={handleSaveFolder}
                disabled={editingFolder ? !editFolderName.trim() : !newFolderName.trim()}
                className="grow bg-indigo-600 hover:bg-indigo-700"
              >
                {editingFolder ? "Simpan Perubahan" : "Buat Folder"}
              </Button>
              <Button
                onClick={() => {
                  setClosingModal("folder");
                  setTimeout(() => {
                    setShowFolderModal(false);
                    setEditingFolder(null);
                    setEditFolderName("");
                    setEditFolderParent("root");
                    setNewFolderName("");
                    setParentFolderId("root");
                    setClosingModal(null);
                  }, 200);
                }}
                variant="outline"
                className="grow"
              >
                Batal
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Folder Modal */}
      <ConfirmDeleteModal
        isOpen={deleteFolderModal.open}
        onClose={() => setDeleteFolderModal({ open: false, folder: null })}
        onConfirm={handleDeleteFolder}
        isLoading={deletingFolder}
        title="Delete Folder"
        message={`Are you sure you want to delete the folder "${deleteFolderModal.folder?.name}"? Folders containing files or subfolders cannot be deleted.`}
      />

      {/* Delete Modal */}
      <ConfirmDeleteModal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, item: null })}
        onConfirm={handleDelete}
        isLoading={deleting}
        title="Delete File"
        message={`Are you sure you want to delete "${deleteModal.item?.name}"? This action cannot be undone.`}
      />

      {/* Upload Error Modal */}
      <AlertModal
        isOpen={!!uploadError}
        onClose={() => setUploadError(null)}
        title="Upload Failed"
        message={uploadError || ""}
        type="error"
      />

      <AlertModal
        isOpen={!!folderDeleteWarning}
        onClose={() => setFolderDeleteWarning(null)}
        title="Cannot Delete Folder"
        message={folderDeleteWarning || ""}
        type="warning"
      />

      {/* Download Confirmation Modal */}
      {downloadConfirm && (
        <div
          className={`fixed inset-0 z-100000 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm transition-opacity duration-200`}
          onClick={() => setDownloadConfirm(null)}
        >
          <div
            className={`w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl transition-all duration-200 dark:border-gray-700 dark:bg-gray-800`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 dark:bg-indigo-900/30">
                <DownloadIcon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Konfirmasi Download</h2>
            </div>
            <p className="mb-6 text-gray-600 dark:text-gray-400">
              Apakah Anda yakin ingin mengunduh file <strong className="text-gray-900 dark:text-white">{downloadConfirm.original_name || downloadConfirm.name}</strong>?
            </p>
            <div className="flex gap-3">
              <Button
                onClick={() => setDownloadConfirm(null)}
                variant="outline"
                className="grow"
              >
                Batal
              </Button>
              <Button
                onClick={handleDownloadConfirm}
                className="grow bg-indigo-600 hover:bg-indigo-700"
              >
                Download
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Download Notice Modal */}
      <AlertModal
        isOpen={!!downloadNotice}
        onClose={() => setDownloadNotice(null)}
        title="Download"
        message={downloadNotice || ""}
        type="info"
      />

      {/* File Preview Modal */}
      {previewFile && (
        <div
          className={`fixed inset-0 z-100000 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm transition-opacity duration-200 ${
            closingModal === "preview" ? "opacity-0" : "opacity-100"
          }`}
          onClick={() => {
            setClosingModal("preview");
            setTimeout(() => {
              setPreviewFile(null);
              setClosingModal(null);
            }, 200);
          }}
        >
          <div
            className={`relative w-full max-w-5xl rounded-2xl bg-white shadow-2xl transition-all duration-200 dark:bg-gray-800 ${
              closingModal === "preview"
                ? "animate-out fade-out zoom-out-95"
                : "animate-in fade-in zoom-in-95"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 dark:bg-indigo-900/30">
                  {getFileIconComponent(previewFile.mime_type)}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {previewFile.original_name || previewFile.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {formatFileSize(previewFile.size)} • {formatIndonesianDate(previewFile.created_at)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={resolveAssetUrl((previewFile as any).url || `/storage/${previewFile.path}`)}
                  download
                  className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-indigo-600 dark:text-gray-400 dark:hover:bg-gray-700"
                  onClick={(e) => e.stopPropagation()}
                >
                  <DownloadIcon className="h-5 w-5" />
                </a>
                <button
                  onClick={() => {
                    setClosingModal("preview");
                    setTimeout(() => {
                      setPreviewFile(null);
                      setClosingModal(null);
                    }, 200);
                  }}
                  className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700"
                >
                  <CloseIcon className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Preview Content */}
            <div className="max-h-[calc(100vh-200px)] overflow-auto p-6">
              {previewFile.mime_type.startsWith("image/") ? (
                <div className="flex items-center justify-center">
                  <img
                    src={resolveAssetUrl((previewFile as any).url || `/storage/${previewFile.path}`)}
                    alt={previewFile.original_name || previewFile.name}
                    className="max-h-[70vh] max-w-full rounded-lg object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                      const parent = target.parentElement;
                      if (parent) {
                        parent.innerHTML = `
                          <div class="flex flex-col items-center justify-center py-16 text-center">
                            <p class="text-gray-500 dark:text-gray-400">Failed to load image</p>
                            <a href="${resolveAssetUrl((previewFile as any).url || `/storage/${previewFile.path}`)}" download class="mt-4 text-indigo-600 hover:underline dark:text-indigo-400">Download file</a>
                          </div>
                        `;
                      }
                    }}
                  />
                </div>
              ) : previewFile.mime_type.includes("pdf") ? (
                <div className="flex h-[70vh] items-center justify-center">
                  <iframe
                    src={resolveAssetUrl((previewFile as any).url || `/storage/${previewFile.path}`)}
                    className="h-full w-full rounded-lg border border-gray-200 dark:border-gray-700"
                    title={previewFile.original_name || previewFile.name}
                  />
                </div>
              ) : previewFile.mime_type.startsWith("video/") ? (
                <div className="flex items-center justify-center">
                  <video
                    src={resolveAssetUrl((previewFile as any).url || `/storage/${previewFile.path}`)}
                    controls
                    className="max-h-[70vh] max-w-full rounded-lg"
                  >
                    Your browser does not support video player.
                  </video>
                </div>
              ) : previewFile.mime_type.startsWith("audio/") ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <div className="mb-6 flex h-32 w-32 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/30">
                    {getFileIconComponent(previewFile.mime_type)}
                  </div>
                  <audio
                    src={resolveAssetUrl((previewFile as any).url || `/storage/${previewFile.path}`)}
                    controls
                    className="w-full max-w-md"
                  >
                    Your browser does not support audio player.
                  </audio>
                  <a
                    href={resolveAssetUrl((previewFile as any).url || `/storage/${previewFile.path}`)}
                    download
                    className="mt-4 text-sm text-indigo-600 hover:underline dark:text-indigo-400"
                  >
                    Download file
                  </a>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="mb-6 flex h-32 w-32 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
                    {getFileIconComponent(previewFile.mime_type)}
                  </div>
                  <p className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                    Preview not available
                  </p>
                  <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                    This file type cannot be displayed in the browser
                  </p>
                  <a
                    href={resolveAssetUrl((previewFile as any).url || `/storage/${previewFile.path}`)}
                    download
                    className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
                  >
                    <DownloadIcon className="h-4 w-4" />
                    Download File
                  </a>
                </div>
              )}
            </div>

            {/* Footer */}
            {previewFile.description && (
              <div className="border-t border-gray-200 px-6 py-4 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-medium text-gray-900 dark:text-white">Deskripsi:</span>{" "}
                  {previewFile.description}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
