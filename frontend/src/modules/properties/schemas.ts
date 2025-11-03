import { z } from "zod";

export const PropertyCreateInputSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title must be less than 200 characters"),
  description: z.string().min(1, "Description is required").max(1000, "Description must be less than 1000 characters"),
  price: z.number().min(0, "Price must be positive"),
  location: z.string().min(1, "Location is required"),
  bedrooms: z.number().int().min(0, "Bedrooms must be a positive integer"),
  bathrooms: z.number().int().min(0, "Bathrooms must be a positive integer"),
  area: z.number().min(0, "Area must be positive"),
  type: z.enum(["house", "apartment", "condo", "land"]),
  status: z.enum(["available", "sold", "rented"]),
  imageUrl: z.string().url().optional().or(z.literal("")),
});

export const PropertyUpdateInputSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().min(1).max(1000).optional(),
  price: z.number().min(0).optional(),
  location: z.string().min(1).optional(),
  bedrooms: z.number().int().min(0).optional(),
  bathrooms: z.number().int().min(0).optional(),
  area: z.number().min(0).optional(),
  type: z.enum(["house", "apartment", "condo", "land"]).optional(),
  status: z.enum(["available", "sold", "rented"]).optional(),
  imageUrl: z.string().url().optional().or(z.literal("")),
});
