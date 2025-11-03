"use server";

import { revalidatePath } from "next/cache";
import { propertyDb } from "../data";
import type { PropertyUpdateInput, Result, Property } from "../types";

export const updatePropertyAction = async (
  id: string,
  propertyData: PropertyUpdateInput,
): Promise<Result<Property>> => {
  try {
    const updatedProperty = propertyDb.update(id, propertyData);

    if (!updatedProperty) {
      return { ok: false, error: "Property not found" };
    }

    // Revalidate property detail and list
    revalidatePath(`/properties/${id}`);
    revalidatePath("/properties");

    return { ok: true, data: updatedProperty };
  } catch (error) {
    return { ok: false, error: "Failed to update property" };
  }
};
