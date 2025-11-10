"use client";

import { useEffect, useState } from "react";

export function useGetPropertyById(id?: string) {
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    fetch(`/api/properties/${id}`)
      .then((res) => res.json())
      .then((data) => setProperty(data))
      .catch((err) => console.error("Error fetching property:", err))
      .finally(() => setLoading(false));
  }, [id]);

  return { property, loading };
}
