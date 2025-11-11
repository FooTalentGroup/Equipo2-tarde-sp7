"use client";

import { useState } from "react";
import { toast } from "sonner";

export function useDeleteProperty(onSuccess?: () => void) {
  const [loading, setLoading] = useState(false);

  const deleteProperty = async (id: string) => {
    if (!id) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/properties/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Server error");

      toast.success("Property deleted successfully 🗑️");
      onSuccess?.();
    } catch (error) {
      console.error(error);
      toast.error("Could not delete property");
    } finally {
      setLoading(false);
    }
  };

  return { deleteProperty, loading };
}
