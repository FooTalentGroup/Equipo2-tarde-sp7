"use client";

import type { Property } from "../types";
import { PropertyCard } from "./property-card";

interface PropertyListProps {
	properties: Property[];
}

export function PropertyList({ properties }: PropertyListProps) {
	if (properties.length === 0) {
		return (
			<div className="text-center py-12">
				<p className="text-muted-foreground">No hay propiedades disponibles.</p>
			</div>
		);
	}

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{properties.map((property) => (
				<PropertyCard key={property.id} property={property} />
			))}
		</div>
	);
}
