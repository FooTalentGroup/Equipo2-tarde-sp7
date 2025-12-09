"use client";

import { useEffect, useRef, useState } from "react";

import { Input } from "@src/components/ui/input";
import { Spinner } from "@src/components/ui/spinner";
import { getProperties } from "@src/modules/properties/services/property-service";
import type { Property } from "@src/types/property";
import { ChevronDown } from "lucide-react";

type PropertyComboboxProps = {
	onSelect: (propertyId: string, property: Property) => void;
	value?: string;
	placeholder?: string;
	className?: string;
};

export default function PropertyCombobox({
	onSelect,
	value = "",
	placeholder = "Seleccione o busque una propiedad",
	className = "",
}: PropertyComboboxProps) {
	const [searchTerm, setSearchTerm] = useState("");
	const [displayValue, setDisplayValue] = useState("");
	const [isOpen, setIsOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [allProperties, setAllProperties] = useState<Property[]>([]);
	const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
	const wrapperRef = useRef<HTMLDivElement>(null);

	// Cargar todas las propiedades al montar
	useEffect(() => {
		const fetchProperties = async () => {
			setIsLoading(true);
			try {
				const response = await getProperties({
					includeArchived: false,
				});

				// Filtrar solo disponibles y publicadas
				const availableProperties = (response.properties || []).filter(
					(property) =>
						property.property_status?.id === 1 &&
						property.visibility_status?.id === 1,
				);

				// Ordenar alfabéticamente
				const sortedProperties = availableProperties.sort((a, b) =>
					a.title.localeCompare(b.title, "es", { sensitivity: "base" }),
				);

				setAllProperties(sortedProperties);
				setFilteredProperties(sortedProperties);
			} catch (error) {
				console.error("Error fetching properties:", error);
				setAllProperties([]);
				setFilteredProperties([]);
			} finally {
				setIsLoading(false);
			}
		};

		fetchProperties();
	}, []);

	// Filtrar propiedades según búsqueda
	useEffect(() => {
		if (!searchTerm.trim()) {
			setFilteredProperties(allProperties);
			return;
		}

		const searchLower = searchTerm.toLowerCase();
		const filtered = allProperties.filter((property) => {
			const titleMatch = property.title.toLowerCase().includes(searchLower);
			const addressMatch = property.main_address?.full_address
				?.toLowerCase()
				.includes(searchLower);
			return titleMatch || addressMatch;
		});

		setFilteredProperties(filtered);
	}, [searchTerm, allProperties]);

	// Cerrar dropdown al hacer clic fuera
	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (
				wrapperRef.current &&
				!wrapperRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);
			}
		}
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	// Sincronizar con valor externo
	useEffect(() => {
		if (value) {
			const property = allProperties.find((p) => p.id.toString() === value);
			if (property) {
				setDisplayValue(property.title);
			}
		} else {
			setDisplayValue("");
			setSearchTerm("");
		}
	}, [value, allProperties]);

	const handleSelect = (property: Property) => {
		setDisplayValue(property.title);
		setSearchTerm("");
		setIsOpen(false);
		onSelect(property.id.toString(), property);
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchTerm(e.target.value);
		setDisplayValue(e.target.value);
		setIsOpen(true);
	};

	const handleInputClick = () => {
		setIsOpen(!isOpen);
		if (!isOpen) {
			setSearchTerm("");
			setFilteredProperties(allProperties);
		}
	};

	return (
		<div ref={wrapperRef} className="relative w-full">
			<div className="relative">
				<Input
					type="text"
					value={displayValue}
					onChange={handleInputChange}
					onClick={handleInputClick}
					placeholder={placeholder}
					className={`text-base placeholder:text-grey-light border-input-border/70 focus-visible:border-input-active focus-visible:shadow-input-active focus-visible:border-2 focus-visible:ring-0 rounded-lg not-placeholder-shown:border-input-active not-placeholder-shown:border-2 text-primary-normal-active h-12 py-2 pr-10 shadow-input-border ${className}`}
					readOnly={isLoading}
				/>
				<div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
					{isLoading ? (
						<Spinner className="w-4 h-4" />
					) : (
						<ChevronDown
							className={`w-4 h-4 text-gray-400 transition-transform ${
								isOpen ? "rotate-180" : ""
							}`}
						/>
					)}
				</div>
			</div>

			{isOpen && !isLoading && (
				<div className="absolute z-50 w-full mt-1 bg-dropdown-background border border-input-border rounded-lg shadow-lg max-h-80 overflow-auto">
					{filteredProperties.length === 0 ? (
						<div className="px-4 py-6 text-center text-grey-light text-sm">
							{searchTerm
								? "No se encontraron propiedades"
								: "No hay propiedades disponibles"}
						</div>
					) : (
						<div className="py-1">
							{filteredProperties.map((property) => (
								<button
									key={property.id}
									type="button"
									onClick={() => handleSelect(property)}
									className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
								>
									<div className="flex items-start justify-between gap-3">
										<div className="flex-1 min-w-0">
											<div className="font-semibold text-primary-normal-active text-sm mb-1 truncate">
												{property.title}
											</div>
											{property.main_address?.full_address && (
												<div className="text-xs text-gray-500 truncate">
													{property.main_address.full_address}
												</div>
											)}
										</div>
									</div>
								</button>
							))}
						</div>
					)}
				</div>
			)}
		</div>
	);
}
