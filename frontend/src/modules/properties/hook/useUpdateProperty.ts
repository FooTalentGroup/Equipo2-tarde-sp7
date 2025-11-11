"use client";

import { z } from "zod";
import { useState } from "react";
import { toast } from "sonner";
import { createPropertySchema } from "../schemas/property.schema";
import type { UseFormReturn } from "react-hook-form";

export function useUpdateProperty(onSuccess?: () => void) {
  const [loading, setLoading] = useState(false);

  const onSubmit = async (
    id: string,
    values: z.infer<typeof createPropertySchema>,
    form?: UseFormReturn<z.infer<typeof createPropertySchema>>
  ) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/properties/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        // try to parse validation details from the API
        if (res.status === 400) {
          const json = await res.json().catch(() => null);
          if (json && json.details && form) {
            // zod format: { field: { _errors: [...] }, ... }
            const details = json.details as Record<string, any>;
            const extractMsg = (obj: any): string | null => {
              if (!obj) return null;
              if (Array.isArray(obj._errors) && obj._errors.length > 0)
                return String(obj._errors[0]);
              // nested object
              for (const key of Object.keys(obj)) {
                const v = extractMsg(obj[key]);
                if (v) return v;
              }
              return null;
            };

            for (const [field, value] of Object.entries(details)) {
              const msg = extractMsg(value);
              if (msg) {
                try {
                  form.setError(field as any, { type: "server", message: msg });
                } catch (e) {
                  // ignore if setError fails for some fields
                }
              }
            }
          }
        }

        throw new Error("Error en el servidor");
      }

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
