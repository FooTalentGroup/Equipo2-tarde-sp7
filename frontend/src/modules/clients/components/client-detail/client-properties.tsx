"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { Button } from "@src/components/ui/button";
import { Card, CardContent } from "@src/components/ui/card";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@src/components/ui/popover";
import { parseAmount } from "@src/lib/parsing";
import PropertySelect from "@src/modules/clients/ui/property-select";
import type { RentedProperty } from "@src/types/clients/tenant";
import type { Property as FullProperty } from "@src/types/property";
import { Building2, PlusIcon } from "lucide-react";
import { toast } from "sonner";

import {
	type ClientProperty,
	ClientPropertyCard,
} from "./client-property-card";

interface ClientPropertiesProps {
	title?: string;
	properties: (ClientProperty | RentedProperty)[] | [];
	addProperty?: boolean;
	availableProperties?: FullProperty[];
	operationType?: number[];
	onAddProperty?: (propertyId: string) => Promise<void>;
	onDeleteProperty?: (propertyId: string | number) => Promise<void>;
}

// Normalize Property or RentedProperty into a single shape
function normalizeProperty(
	property: ClientProperty | RentedProperty,
): ClientProperty {
	if ("address" in property && typeof property.address === "string") {
		return property as ClientProperty;
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
		properties as (ClientProperty | RentedProperty)[]
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
						<ClientPropertyCard
							key={property.id}
							property={property}
							// TODO: Enable when backend implements delete endpoints
							/* onDelete={onDeleteProperty} */
						/>
					))}
				</div>
			</CardContent>
		</Card>
	);
}
