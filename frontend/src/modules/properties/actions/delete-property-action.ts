"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { propertyDb } from "../data";
import type { Result } from "../types";

export const deletePropertyAction = async (id: string): Promise<Result<void> | void> => {
  try {
    const deleted = propertyDb.delete(id);

    if (!deleted) {
      return { ok: false, error: "Property not found" };
    }

    // Revalidate properties list
    revalidatePath("/properties");

    redirect("/properties");
  } catch (error) {
    return { ok: false, error: "Failed to delete property" };
  }
};
