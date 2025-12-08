import { propertiesList } from "./data";
import { PropertyCard } from "./property-card";

export const PropertiesList = () => {
	return (
		<section>
			<h1>Properties List</h1>
			{propertiesList.map((property) => {
				return <PropertyCard key={property.index} property={property} />;
			})}
		</section>
	);
};
