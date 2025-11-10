"use client";

import { z } from "zod";
import { useState } from "react";
import { toast } from "sonner";
import { createPropertySchema } from "../schemas/property.schema";

export function useUpdateProperty(onSuccess?: () => void) {
  const [loading, setLoading] = useState(false);

  const onSubmit = async (
    id: string,
    values: z.infer<typeof createPropertySchema>
  ) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/properties/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) throw new Error("Error en el servidor");

      toast.success("Propiedad actualizada correctamente 🏠");
      onSuccess?.();
    } catch (error) {
      console.error(error);
      toast.error("No se pudo actualizar la propiedad");
    } finally {
      setLoading(false);
    }
  };

  return { onSubmit, loading };
}
