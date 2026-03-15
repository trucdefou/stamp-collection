const API_BASE = "";

export interface Stamp {
  id: number;
  name: string;
  country: string;
  year: number | null;
  category: string | null;
  condition: string | null;
  estimated_value: number | null;
  purchase_price: number | null;
  notes: string | null;
  acquisition_date: string | null;
  image_filename: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface StampListResponse {
  stamps: Stamp[];
  total: number;
  page: number;
  page_size: number;
}

export interface Filters {
  countries: string[];
  categories: string[];
  conditions: string[];
}

export interface Stats {
  total_stamps: number;
  total_countries: number;
  total_estimated_value: number;
  total_invested: number;
}

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("stamp_token");
}

export function setToken(token: string) {
  localStorage.setItem("stamp_token", token);
}

export function clearToken() {
  localStorage.removeItem("stamp_token");
}

export function isLoggedIn(): boolean {
  return !!getToken();
}

async function apiFetch(path: string, options: RequestInit = {}) {
  const token = getToken();
  const headers: Record<string, string> = { ...(options.headers as Record<string, string> || {}) };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  if (!(options.body instanceof FormData) && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }
  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Error de servidor" }));
    throw new Error(err.detail || `Error ${res.status}`);
  }
  return res.json();
}

export function imageUrl(filename: string | null): string {
  if (!filename) return "";
  return `${API_BASE}/uploads/${filename}`;
}

// Public
export async function getStamps(params: {
  page?: number;
  page_size?: number;
  search?: string;
  country?: string;
  category?: string;
  condition?: string;
  year_from?: number;
  year_to?: number;
} = {}): Promise<StampListResponse> {
  const sp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") sp.set(k, String(v));
  });
  return apiFetch(`/api/stamps?${sp.toString()}`);
}

export async function getStamp(id: number): Promise<Stamp> {
  return apiFetch(`/api/stamps/${id}`);
}

export async function getFilters(): Promise<Filters> {
  return apiFetch("/api/filters");
}

export async function getStats(): Promise<Stats> {
  return apiFetch("/api/stats");
}

// Auth
export async function login(username: string, password: string): Promise<string> {
  const data = await apiFetch("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
  setToken(data.access_token);
  return data.access_token;
}

// Admin
export async function createStamp(formData: FormData): Promise<Stamp> {
  return apiFetch("/api/admin/stamps", { method: "POST", body: formData });
}

export async function updateStamp(id: number, formData: FormData): Promise<Stamp> {
  return apiFetch(`/api/admin/stamps/${id}`, { method: "PUT", body: formData });
}

export async function deleteStamp(id: number): Promise<void> {
  return apiFetch(`/api/admin/stamps/${id}`, { method: "DELETE" });
}
