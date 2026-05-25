import type { Bike, BikesResponse } from "./types";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api"
).replace(/\/$/, "");

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const url = `${API_URL}${path}`;

  let res: Response;
  try {
    res = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      cache: "no-store",
    });
  } catch {
    throw new Error(
      `Failed to fetch (${url}). Check backend is running and CORS allows this site.`
    );
  }

  let data: { message?: string; success?: boolean };
  try {
    data = await res.json();
  } catch {
    throw new Error(`Invalid JSON from API (${res.status})`);
  }

  if (!res.ok) {
    throw new Error(data.message || `Request failed (${res.status})`);
  }

  return data as T;
}

function adminHeaders(key: string) {
  return { "x-admin-key": key };
}

export const api = {
  getBikes: (params: Record<string, string> = {}) => {
    const query = new URLSearchParams(params).toString();
    return request<BikesResponse>(`/bikes?${query}`);
  },

  getBike: (id: number | string) =>
    request<{ success: boolean; data: Bike }>(`/bikes/${id}`),

  createBike: (key: string, body: Partial<Bike>) =>
    request<{ success: boolean; data: Bike }>("/bikes", {
      method: "POST",
      headers: adminHeaders(key),
      body: JSON.stringify(body),
    }),

  updateBike: (key: string, id: number, body: Partial<Bike>) =>
    request<{ success: boolean; data: Bike }>(`/bikes/${id}`, {
      method: "PUT",
      headers: adminHeaders(key),
      body: JSON.stringify(body),
    }),

  deleteBike: (key: string, id: number) =>
    request<{ success: boolean }>(`/bikes/${id}`, {
      method: "DELETE",
      headers: adminHeaders(key),
    }),

  updateStatus: (key: string, id: number, status: "unsold" | "sold") =>
    request<{ success: boolean; data: Bike }>(`/bikes/${id}/status`, {
      method: "PATCH",
      headers: adminHeaders(key),
      body: JSON.stringify({ status }),
    }),
};

export function formatPrice(price: number | null) {
  if (price == null) return "Price on request";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
}

export function getWhatsAppLink(bike: Bike) {
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919676499794";
  const priceText = bike.price != null ? `₹${bike.price.toLocaleString("en-IN")}` : "price on request";
  const text = encodeURIComponent(
    `Hi! I'm interested in the ${bike.year ? `${bike.year} ` : ""}${bike.model} (${bike.number || "AK Bikes"}) listed at ${priceText} on AK Bikes.`
  );
  return `https://wa.me/${phone}?text=${text}`;
}
