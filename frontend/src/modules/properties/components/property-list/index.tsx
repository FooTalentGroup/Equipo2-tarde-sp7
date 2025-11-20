import { mockProperties } from "./data";
import PropertyCard from "./property-card";

export default function PropertyList() {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
			{mockProperties.map((property) => (
				<PropertyCard key={property.id} property={property} />
			))}
		</div>
	);
}
