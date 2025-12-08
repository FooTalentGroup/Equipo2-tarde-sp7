"use client";

import { useEffect, useRef, useState } from "react";

import { Button } from "@src/components/ui/button";
import { Checkbox } from "@src/components/ui/checkbox";
import { Label } from "@src/components/ui/label";

export type FilterOption = "name" | "email";

type ColumnFilterDropdownProps = {
	visibleColumns: Record<FilterOption, boolean>;
	onToggleColumn: (column: FilterOption) => void;
};

export const ColumnFilterDropdown = ({
	visibleColumns,
	onToggleColumn,
}: ColumnFilterDropdownProps) => {
	const [isFilterOpen, setIsFilterOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	// Cerrar dropdown al hacer click fuera
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setIsFilterOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const toggleFilter = () => setIsFilterOpen(!isFilterOpen);

	const handleToggleColumn = (column: FilterOption) => onToggleColumn(column);

	return (
		<div className="relative" ref={dropdownRef}>
			<Button onClick={toggleFilter}>Filtrar Columnas ▼</Button>

			{isFilterOpen && (
				<div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10 min-w-[200px]">
					<div className="px-4 py-2 hover:bg-gray-100 border-b border-gray-200">
						<div className="flex items-center space-x-2">
							<Checkbox
								id="filter-name"
								checked={visibleColumns.name}
								onCheckedChange={() => handleToggleColumn("name")}
							/>
							<Label
								htmlFor="filter-name"
								className="cursor-pointer font-normal"
							>
								Nombre
							</Label>
						</div>
					</div>
					<div className="px-4 py-2 hover:bg-gray-100">
						<div className="flex items-center space-x-2">
							<Checkbox
								id="filter-email"
								checked={visibleColumns.email}
								onCheckedChange={() => handleToggleColumn("email")}
							/>
							<Label
								htmlFor="filter-email"
								className="cursor-pointer font-normal"
							>
								Email
							</Label>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};
