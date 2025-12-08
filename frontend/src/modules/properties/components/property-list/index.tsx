import type { Property } from "@src/types/property";

import PropertyCard from "./property-card";

type Props = {
	properties: Property[];
};

export default function PropertyList({ properties }: Props) {
	if (!properties || properties.length === 0) {
		return (
			<div className="flex h-40 w-full items-center justify-center">
				<p className="text-muted-foreground">No se encontraron resultados</p>
			</div>
		);
	}

	return (
		<section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
			{properties.map((property) => (
				<PropertyCard key={property.id} property={property} />
			))}
		</section>
	);
}
