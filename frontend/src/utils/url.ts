function getApiBase(): string {
  return (import.meta as any).env?.VITE_API_URL || "http://localhost:8000/api";
}

export function getBackendOrigin(): string {
  const apiBase = getApiBase();
  try {
    const u = new URL(apiBase);
    // Remove trailing /api if present
    u.pathname = u.pathname.replace(/\/api\/?$/, "");
    return u.origin + u.pathname;
  } catch {
    // Fallback for non-absolute apiBase
    return "http://localhost:8000";
  }
}

export function resolveAssetUrl(input?: string | null): string {
  const value = (input || "").trim();
  if (!value) return "";
  
  // If already an absolute URL, return as is
  if (/^https?:\/\//i.test(value)) return value;
  
  // If data URL or blob URL, return as is
  if (value.startsWith("data:") || value.startsWith("blob:")) return value;

  // For relative URLs, prepend backend origin
  const origin = getBackendOrigin();
  if (value.startsWith("/")) return `${origin}${value}`;
  return `${origin}/${value}`;
}


