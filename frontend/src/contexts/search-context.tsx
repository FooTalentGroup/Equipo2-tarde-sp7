"use client";

import type { ReactNode } from "react";
import { createContext, useContext, useMemo, useState } from "react";

interface SearchContextType {
	searchTerm: string;
	setSearchTerm: (term: string) => void;
	filterData: <T extends Record<string, any>>(
		data: T[],
		searchFields: (keyof T)[],
	) => T[];
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

interface SearchProviderProps {
	children: ReactNode;
}

export function SearchProvider({ children }: SearchProviderProps) {
	const [searchTerm, setSearchTerm] = useState("");

	const filterData = useMemo(() => {
		return <T extends Record<string, any>>(
			data: T[],
			searchFields: (keyof T)[],
		) => {
			if (!searchTerm.trim()) {
				return data;
			}

			const term = searchTerm.toLowerCase();
			return data.filter((item) =>
				searchFields.some((field) => {
					const value = item[field];
					return value && String(value).toLowerCase().includes(term);
				}),
			);
		};
	}, [searchTerm]);

	return (
		<SearchContext.Provider value={{ searchTerm, setSearchTerm, filterData }}>
			{children}
		</SearchContext.Provider>
	);
}

export function useSearch() {
	const context = useContext(SearchContext);
	if (context === undefined) {
		throw new Error("useSearch must be used within a SearchProvider");
	}
	return context;
}
