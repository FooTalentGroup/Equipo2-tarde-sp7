"use client";

import { useState } from "react";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@src/components/ui/button";
import { Card, CardContent } from "@src/components/ui/card";
import { ImagePlaceholder } from "@src/components/ui/image-placeholder";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@src/components/ui/popover";
import { parseAmount } from "@src/lib/parsing";
import { paths } from "@src/lib/paths";
import PropertySelect from "@src/modules/clients/ui/property-select";
import type { RentedProperty } from "@src/types/clients/tenant";
import type { Property as FullProperty } from "@src/types/property";
import { Building2, PlusIcon } from "lucide-react";
import { toast } from "sonner";

interface Property {
	id: string | number;
	address: string;
	city: string;
	type: string;
	rooms: number;
	bathrooms: number;
	surface: number;
	image: string;
	status: string;
	age?: string;
	prices?: {
		rent: number;
		maintenance: number;
	};
}

interface ClientPropertiesProps {
	title?: string;
	properties: (Property | RentedProperty)[] | [];
	addProperty?: boolean;
	availableProperties?: FullProperty[];
	operationType?: number[];
	onAddProperty?: (propertyId: string) => Promise<void>;
}

// Normalize Property or RentedProperty into a single shape
function normalizeProperty(property: Property | RentedProperty): Property {
	if ("address" in property && typeof property.address === "string") {
		return property as Property;
	}

	const rented = property as RentedProperty;
	const rentAmount = rented.rental?.monthly_amount
		? parseAmount(rented.rental.monthly_amount)
		: undefined;

	return {
		id: String(rented.id),
		address: rented.address.full_address,
		city: rented.address.city.name,
		type: rented.property_type.name,
		rooms: rented.bedrooms,
		bathrooms: rented.bathrooms,
		surface: parseFloat(rented.surface_area),
		image: rented.main_image?.url ?? "",
		status: rented.property_status.name.toLowerCase(),
		age:
			rented.age?.name ||
			new Date(rented.publication_date).toLocaleDateString("es-AR"),
		prices:
			rentAmount !== undefined
				? {
						rent: rentAmount,
						maintenance: 0,
					}
				: undefined,
	};
}

export function ClientProperties({
	title,
	properties,
	addProperty = true,
	availableProperties = [],
	operationType,
	onAddProperty,
}: ClientPropertiesProps) {
	const router = useRouter();
	const [open, setOpen] = useState(false);
	const [selectedPropertyId, setSelectedPropertyId] = useState<string>("");
	const [saving, setSaving] = useState(false);

	const normalizedProperties = (
		properties as (Property | RentedProperty)[]
	).map(normalizeProperty);

	const monthlyAmount = normalizedProperties.reduce(
		(total, property) => total + (property.prices?.rent ?? 0),
		0,
	);
	const hasRent = normalizedProperties.some(
		(property) => property.prices?.rent !== undefined,
	);

	return (
		<Card>
			<CardContent className="px-4 py-1">
				<div className="flex items-center justify-between mb-6">
					<h3 className="font-semibold text-lg text-slate-900 flex items-center gap-2">
						<Building2 className="h-5 w-5" />
						{title ?? `Propiedades (${normalizedProperties.length})`}
					</h3>
					{addProperty ? (
						<Popover open={open} onOpenChange={setOpen}>
							<PopoverTrigger asChild>
								<Button variant="outline">
									<PlusIcon /> Agregar Propiedad
								</Button>
							</PopoverTrigger>
							<PopoverContent
								side="bottom"
								align="start"
								sideOffset={10}
								className="rounded-xl p-4 text-sm shadow-lg max-w-[420px] bg-sidebar"
								style={{ width: 420 }}
							>
								<div className="space-y-3">
									<PropertySelect
										availableProperties={availableProperties}
										operationTypes={operationType ?? [1, 2]}
										value={selectedPropertyId}
										onChange={(id) => setSelectedPropertyId(id)}
										placeholder="Seleccionar propiedad"
										className="w-full"
									/>
									<div className="flex justify-end">
										<Button
											variant="secondary"
											size="sm"
											disabled={!selectedPropertyId || saving || !onAddProperty}
											onClick={async () => {
												if (!selectedPropertyId || !onAddProperty) return;
												try {
													setSaving(true);
													await onAddProperty(selectedPropertyId);
													toast.success("Propiedad agregada correctamente");
													setOpen(false);
													setSelectedPropertyId("");
													router.refresh();
												} catch (error) {
													console.error(
														"Error saving property to client:",
														error,
													);
													toast.error("No se pudo agregar la propiedad");
												} finally {
													setSaving(false);
												}
											}}
										>
											{saving ? "Guardando..." : "Guardar"}
										</Button>
									</div>
								</div>
							</PopoverContent>
						</Popover>
					) : (
						<div className="">
							<div className="text-xs text-slate-500">Alquiler</div>
							<div className="text-2xl font-semibold text-slate-900">
								{hasRent ? `$${monthlyAmount.toLocaleString("es-AR")}` : "N/A"}
							</div>
						</div>
					)}
				</div>

				<div className="space-y-4">
					{normalizedProperties.map((property) => (
						<Card
							key={property.id}
							className="hover:shadow-md transition-shadow"
						>
							<CardContent className="px-4 py-1">
								<div className="flex gap-4">
									{/* Imagen */}
									<div className="w-32 h-32 bg-slate-200 rounded-lg shrink-0 overflow-hidden relative">
										{property.image ? (
											<Image
												src={property.image}
												alt={property.address}
												fill
												className="object-cover"
											/>
										) : (
											<ImagePlaceholder className="h-full w-full bg-slate-100" />
										)}
									</div>

									{/* Información */}
									<div className="flex-1">
										<div className="flex items-start justify-between mb-6">
											<div>
												<h4 className="font-semibold text-slate-900 mb-1">
													{property.address}
												</h4>
												<div className="text-sm text-slate-500">
													{property.city} · {property.type}
												</div>
											</div>
											<div className="flex flex-col items-center">
												<div className="text-xs text-slate-500">Antigüedad</div>
												<div className="text-lg font-bold text-slate-900">
													{property.age}
												</div>
											</div>
										</div>

										<div className="flex items-center justify-between">
											<div className="grid grid-cols-3 gap-4 mb-3">
												<div>
													<div className="text-xs text-slate-500">
														Ambientes
													</div>
													<div className="text-sm font-medium text-slate-900">
														{property.rooms}
													</div>
												</div>
												<div>
													<div className="text-xs text-slate-500">Baños</div>
													<div className="text-sm font-medium text-slate-900">
														{property.bathrooms}
													</div>
												</div>
												<div>
													<div className="text-xs text-slate-500">
														Superficie
													</div>
													<div className="text-sm font-medium text-slate-900">
														{property.surface} m²
													</div>
												</div>
											</div>

											<Button variant="outline" size="sm" asChild>
												<Link
													href={paths.agent.properties.detail(
														String(property.id),
													)}
												>
													Ver Detalles
												</Link>
											</Button>
										</div>
									</div>
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			</CardContent>
		</Card>
	);
}
