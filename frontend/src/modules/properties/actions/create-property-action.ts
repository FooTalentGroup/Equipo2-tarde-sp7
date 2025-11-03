"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { propertyDb } from "../data";
import type { PropertyCreateInput, Result, Property } from "../types";

export const createPropertyAction = async (
  propertyData: PropertyCreateInput,
): Promise<Result<Property> | void> => {
  try {
    const newProperty = propertyDb.create(propertyData);

    // Revalidate properties list
    revalidatePath("/properties");

    redirect(`/properties/${newProperty.id}`);
  } catch (error) {
    return { ok: false, error: "Failed to create property" };
  }
};
