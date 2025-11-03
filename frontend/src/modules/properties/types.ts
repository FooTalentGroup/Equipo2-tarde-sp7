export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  type: "house" | "apartment" | "condo" | "land";
  status: "available" | "sold" | "rented";
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PropertyCreateInput {
  title: string;
  description: string;
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  type: "house" | "apartment" | "condo" | "land";
  status: "available" | "sold" | "rented";
  imageUrl?: string;
}

export interface PropertyUpdateInput {
  title?: string;
  description?: string;
  price?: number;
  location?: string;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  type?: "house" | "apartment" | "condo" | "land";
  status?: "available" | "sold" | "rented";
  imageUrl?: string;
}

export type Result<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };
