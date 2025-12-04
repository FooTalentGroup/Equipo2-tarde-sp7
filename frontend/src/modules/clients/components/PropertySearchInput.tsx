"use client";

import { useEffect, useRef, useState } from "react";

import { Input } from "@src/components/ui/input";
import { Spinner } from "@src/components/ui/spinner";
import { getProperties } from "@src/modules/properties/services/property-service";
import type { Property } from "@src/types/property";

type PropertySearchInputProps = {
	onSelect: (property: Property) => void;
	value?: string;
	placeholder?: string;
	className?: string;
};

export default function PropertySearchInput({
	onSelect,
	value = "",
	placeholder = "Buscar propiedad disponible...",
	className = "",
}: PropertySearchInputProps) {
	const [searchTerm, setSearchTerm] = useState(value);
	const [isOpen, setIsOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [properties, setProperties] = useState<Property[]>([]);
	const wrapperRef = useRef<HTMLDivElement>(null);

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

	// Buscar propiedades disponibles
	useEffect(() => {
		const searchProperties = async () => {
			if (searchTerm.trim().length < 2) {
				setProperties([]);
				return;
			}

			setIsLoading(true);
			try {
				const response = await getProperties({
					search: searchTerm,
					includeArchived: false, // Excluir archivadas
				});

				// Filtrar en cliente solo las disponibles (status.id = 1) y publicadas (visibility.id = 1)
				const availableProperties = (
					(response.properties || []) as Property[]
				).filter(
					(property: Property) =>
						property.property_status?.id === 1 &&
						property.visibility_status?.id === 1,
				);

				setProperties(availableProperties);
			} catch (error) {
				console.error("Error searching properties:", error);
				setProperties([]);
			} finally {
				setIsLoading(false);
			}
		};

		const debounceTimer = setTimeout(searchProperties, 300);
		return () => clearTimeout(debounceTimer);
	}, [searchTerm]);

	const handleSelect = (property: Property) => {
		setSearchTerm(property.title);
		setIsOpen(false);
		onSelect(property);
	};

	const formatAddress = (property: Property) => {
		const { main_address } = property;
		if (!main_address) return "";

		const parts = [
			main_address.neighborhood,
			main_address.city?.name,
			main_address.city?.province?.name,
		].filter(Boolean);
		return parts.join(", ");
	};

	const formatPrice = (property: Property) => {
		const { main_price } = property;
		if (!main_price) return "";

		return `${main_price.currency.symbol} ${parseFloat(
			main_price.price,
		).toLocaleString()}`;
	};

	return (
		<div ref={wrapperRef} className="relative w-full">
			<div className="relative">
				<Input
					type="text"
					value={searchTerm}
					onChange={(e) => {
						setSearchTerm(e.target.value);
						setIsOpen(true);
					}}
					onFocus={() => setIsOpen(true)}
					placeholder={placeholder}
					className={`text-base placeholder:text-grey-light border-input-border/70 focus-visible:border-input-active focus-visible:shadow-input-active focus-visible:border-2 focus-visible:ring-0 rounded-lg not-placeholder-shown:border-input-active not-placeholder-shown:border-2 text-primary-normal-active h-12 py-2 shadow-input-border ${className}`}
				/>
				{isLoading && (
					<div className="absolute right-3 top-1/2 -translate-y-1/2">
						<Spinner className="w-4 h-4" />
					</div>
				)}
			</div>

			{isOpen && searchTerm.trim().length >= 2 && !isLoading && (
				<div className="absolute z-50 w-full mt-1 bg-white border border-input-border rounded-lg shadow-lg max-h-80 overflow-auto">
					{properties.length === 0 ? (
						<div className="px-4 py-6 text-center text-grey-light text-sm">
							No se encontraron propiedades disponibles
						</div>
					) : (
						<div className="py-1">
							{properties.map((property) => (
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
											{property.property_type && property.main_price && (
												<div className="text-xs text-gray-600 mb-1">
													{property.property_type.name} •{" "}
													{property.main_price.operation_type.name}
												</div>
											)}
											{property.main_address && (
												<div className="text-xs text-gray-500 truncate">
													{formatAddress(property)}
												</div>
											)}
										</div>
										{property.main_price && (
											<div className="text-sm font-semibold text-secondary-dark whitespace-nowrap">
												{formatPrice(property)}
											</div>
										)}
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
