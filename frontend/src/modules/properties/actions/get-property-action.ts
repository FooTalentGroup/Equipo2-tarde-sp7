"use server";

import { propertyDb } from "../data";
import type { Result, Property } from "../types";

export const getPropertyAction = async (id: string): Promise<Result<Property>> => {
  try {
    const property = propertyDb.getById(id);

    if (!property) {
      return { ok: false, error: "Property not found" };
    }

    return { ok: true, data: property };
  } catch (error) {
    return { ok: false, error: "Failed to fetch property" };
  }
};
