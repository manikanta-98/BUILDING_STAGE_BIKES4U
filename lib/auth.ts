export type UserRole = "customer" | "admin";

export interface AuthUser {
  id: string;
  name: string;
  phone: string;
  email: string;
  role: UserRole;
}

const TOKEN_KEY = "ak-bikes-token";
const USER_KEY = "ak-bikes-user";
const REMEMBER_KEY = "ak-bikes-remember";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api"
).replace(/\/$/, "");

function storage(remember: boolean): Storage {
  if (typeof window === "undefined") return localStorage;
  return remember ? localStorage : sessionStorage;
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return (
    localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY)
  );
}

export function getStoredUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  const raw =
    localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function setAuth(token: string, user: AuthUser, remember = true) {
  clearAuth();
  const store = storage(remember);
  store.setItem(TOKEN_KEY, token);
  store.setItem(USER_KEY, JSON.stringify(user));
  if (remember) {
    localStorage.setItem(REMEMBER_KEY, "1");
  } else {
    localStorage.removeItem(REMEMBER_KEY);
  }
}

export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(USER_KEY);
}

export function authHeaders(): Record<string, string> {
  const token = getToken();
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
}

async function authRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const url = `${API_URL}${path}`;

  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
      ...options.headers,
    },
  });

  let data: { message?: string; success?: boolean };
  try {
    data = await res.json();
  } catch {
    throw new Error(`Invalid response from server (${res.status})`);
  }

  if (!res.ok) {
    throw new Error(data.message || `Request failed (${res.status})`);
  }

  return data as T;
}

export const authApi = {
  signup: (body: {
    name: string;
    phone: string;
    email: string;
    password: string;
  }) =>
    authRequest<{
      success: boolean;
      token: string;
      user: AuthUser;
      message: string;
    }>("/auth/signup", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  login: (body: { identifier: string; password: string }) =>
    authRequest<{
      success: boolean;
      token: string;
      user: AuthUser;
      message: string;
    }>("/auth/login", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  me: () =>
    authRequest<{ success: boolean; user: AuthUser }>("/auth/me"),
};

export function getWhatsAppAuthLink() {
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919676499794";
  const text = encodeURIComponent(
    "Hi AK Bikes! I need help with my account / login."
  );
  return `https://wa.me/${phone}?text=${text}`;
}
