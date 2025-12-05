"use client";

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Input } from "@src/components/ui/input";
import { cn } from "@src/lib/utils";
import { debounce, parseAsString, useQueryState } from "nuqs";

type Props = {
	className?: string;
};

export default function PropertySearch({ className }: Props) {
	const [search, setSearch] = useQueryState(
		"search",
		parseAsString.withDefault("").withOptions({ shallow: false }),
	);

	return (
		<div className={cn("relative w-full", className)}>
			<MagnifyingGlassIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
			<Input
				type="search"
				placeholder="Buscar propiedades..."
				className="w-full pl-9"
				value={search}
				onChange={(e) =>
					setSearch(e.target.value, { limitUrlUpdates: debounce(500) })
				}
			/>
		</div>
	);
}
