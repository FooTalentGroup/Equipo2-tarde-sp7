"use client";

import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";

type Property = {
  id: string;
  title: string;
  description: string;
  price: number;
  address: string;
  city: string;
  beds: number;
  baths: number;
};

export function useGetProperties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchProperties = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/properties");
      if (!res.ok) throw new Error("Error al obtener propiedades");

      const data = await res.json();
      setProperties(data);
    } catch (error) {
      console.error(error);
      toast.error("No se pudieron cargar las propiedades");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  return { properties, loading, refetch: fetchProperties };
}
