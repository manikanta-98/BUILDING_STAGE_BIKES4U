export type BikeStatus = "unsold" | "sold";

export interface Bike {
  _id?: string;
  id: number;
  model: string;
  year: number | null;
  number: string | null;
  price: number | null;
  status: BikeStatus;
  description: string;
  images: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  pages: number;
  hasMore: boolean;
}

export interface BikeStats {
  total: number;
  available: number;
  sold: number;
}

export interface BikesResponse {
  success: boolean;
  data: Bike[];
  pagination: PaginationMeta;
  stats?: BikeStats;
}
