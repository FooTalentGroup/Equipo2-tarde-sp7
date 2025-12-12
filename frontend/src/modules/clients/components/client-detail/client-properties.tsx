"use client";

import Image from "next/image";
import Link from "next/link";

import { Button } from "@src/components/ui/button";
import { Card, CardContent } from "@src/components/ui/card";
import { paths } from "@src/lib/paths";
import type { RentedProperty } from "@src/types/clients/tenant";
import { Building2 } from "lucide-react";

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
}

// Helper para normalizar propiedades de diferentes tipos a la estructura simple
function normalizeProperty(property: Property | RentedProperty): Property {
	if ("address" in property && typeof property.address === "string") {
		// Es del tipo Property simple
		return property as Property;
	}

	// Es del tipo RentedProperty, mapear a Property
	const rented = property as RentedProperty;
	return {
		id: String(rented.id),
		address: rented.address.full_address,
		city: rented.address.city.name,
		type: rented.property_type.name,
		rooms: rented.bedrooms,
		bathrooms: rented.bathrooms,
		surface: parseFloat(rented.surface_area),
		image: rented.main_image?.url || "/api/placeholder/400/300",
		status: rented.property_status.name.toLowerCase(),
		age:
			rented.age?.name ||
			new Date(rented.publication_date).toLocaleDateString("es-AR"),
		prices: rented.rental
			? {
					rent: rented.rental.monthly_amount || 0,
					maintenance: 0,
				}
			: undefined,
	};
}

export function ClientProperties({
	title,
	properties,
	addProperty = true,
}: ClientPropertiesProps) {
	const normalizedProperties = (
		properties as (Property | RentedProperty)[]
	).map(normalizeProperty);

	return (
		<Card>
			<CardContent className="px-4 py-1">
				<div className="flex items-center justify-between mb-6">
					<h3 className="font-semibold text-lg text-slate-900 flex items-center gap-2">
						<Building2 className="h-5 w-5" />
						{title ?? `Propiedades (${normalizedProperties.length})`}
					</h3>
					{addProperty && <Button variant="tertiary">Agregar Propiedad</Button>}
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
										<Image
											src={property.image}
											alt={property.address}
											fill
											className="object-cover"
										/>
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
