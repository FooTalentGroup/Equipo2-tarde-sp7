import PropertyFilter from "@src/modules/properties/components/property-filter";
import PropertyHeader from "@src/modules/properties/components/property-header";

export const metadata = {
	title: "Propiedades",
	description: "Gestión de propiedades inmobiliarias",
};

export default function PropertiesPage() {
	return (
		<>
			<PropertyHeader />
			<PropertyFilter />
		</>
	);
}
