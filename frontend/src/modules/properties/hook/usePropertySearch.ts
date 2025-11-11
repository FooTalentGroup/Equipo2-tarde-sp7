"use client";

import { useState, useMemo } from "react";

export function usePropertySearch<T extends { title: string }>(data: T[] = []) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query) return data;
    return data.filter((item) =>
      item.title.toLowerCase().includes(query.toLowerCase())
    );
  }, [data, query]);

  return { query, setQuery, filtered };
}
