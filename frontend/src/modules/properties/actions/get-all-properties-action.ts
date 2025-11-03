"use server";

import { propertyDb } from "../data";
import type { Result, Property } from "../types";

export const getAllPropertiesAction = async (): Promise<Result<Property[]>> => {
  try {
    const properties = propertyDb.getAll();
    return { ok: true, data: properties };
  } catch (error) {
    return { ok: false, error: "Failed to fetch properties" };
  }
};
