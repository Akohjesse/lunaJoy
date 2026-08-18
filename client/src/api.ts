import type { DailyLog, LogInput, User } from "./types";

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    credentials: "include",
    headers: options?.body ? { "content-type": "application/json", ...options.headers } : options?.headers,
    ...options,
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({ message: "Something went wrong." }));
    throw new Error(body.message ?? "Something went wrong.");
  }

  if (response.status === 204) return undefined as T;
  return response.json();
}

export const api = {
  session: () => request<{ user: User }>("/api/auth/session"),
  logout: () => request<void>("/api/auth/logout", { method: "POST" }),
  logs: (period: "week" | "month") => request<{ logs: DailyLog[] }>(`/api/logs?period=${period}`),
  saveLog: (log: LogInput) => request<{ log: DailyLog }>("/api/log", { method: "POST", body: JSON.stringify(log) }),
};
