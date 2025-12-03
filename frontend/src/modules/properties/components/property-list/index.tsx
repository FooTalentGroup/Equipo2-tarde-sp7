import type { Property } from "@src/types/property";

import PropertyCard from "./property-card";

type Props = {
	properties: Property[];
};

export default function PropertyList({ properties }: Props) {
	return (
		<section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
			{properties &&
				properties.length > 0 &&
				properties.map((property) => (
					<PropertyCard key={property.id} property={property} />
				))}
		</section>
	);
}
