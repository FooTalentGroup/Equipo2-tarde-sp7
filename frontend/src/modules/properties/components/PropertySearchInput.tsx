"use client";

import { Input } from "@src/components/ui/input";
import { Search } from "lucide-react";

type Props = {
	query: string;
	setQuery: (value: string) => void;
};

export function PropertySearchInput({ query, setQuery }: Props) {
	return (
		<div className="relative max-w-sm w-full">
			<Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
			<Input
				value={query}
				onChange={(e) => setQuery(e.target.value)}
				placeholder="Search property by title..."
				className="pl-9"
			/>
		</div>
	);
}
