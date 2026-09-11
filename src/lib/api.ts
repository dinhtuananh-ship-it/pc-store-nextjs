import type { ApiResult } from "@/types";

function getUserId(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("pcstore_user");
    if (!raw) return null;
    return (JSON.parse(raw) as { id: string }).id;
  } catch {
    return null;
  }
}

async function request<T>(
  path: string,
  options: RequestInit = {},
  withUser = false
): Promise<ApiResult<T>> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> | undefined),
  };

  if (withUser) {
    const userId = getUserId();
    if (userId) headers["x-user-id"] = userId;
  }

  const res = await fetch(path, { ...options, headers });
  const json = (await res.json()) as ApiResult<T>;

  if (!res.ok || json.success === false) {
    throw new Error(json.message || `Lỗi ${res.status}`);
  }

  return json;
}

export const api = {
  get: <T>(path: string, withUser = false) =>
    request<T>(path, { method: "GET" }, withUser),

  post: <T>(path: string, body?: unknown, withUser = false) =>
    request<T>(
      path,
      { method: "POST", body: body ? JSON.stringify(body) : undefined },
      withUser
    ),

  put: <T>(path: string, body?: unknown, withUser = false) =>
    request<T>(
      path,
      { method: "PUT", body: body ? JSON.stringify(body) : undefined },
      withUser
    ),

  del: <T>(path: string, withUser = false) =>
    request<T>(path, { method: "DELETE" }, withUser),

  upload: async (file: File): Promise<{ image: string; publicId: string }> => {
    const form = new FormData();
    form.append("file", file);

    const res = await fetch("/api/upload", { method: "POST", body: form });
    const json = await res.json();

    if (!res.ok || json.success === false) {
      throw new Error(json.message || "Upload thất bại");
    }

    return json as { image: string; publicId: string };
  },
};
