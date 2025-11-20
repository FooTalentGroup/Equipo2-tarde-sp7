import PropertyFilter from "@src/modules/properties/components/property-filter";
import PropertyHeader from "@src/modules/properties/components/property-header";
import PropertyList from "@src/modules/properties/components/property-list";

export const metadata = {
	title: "Propiedades",
	description: "Gestión de propiedades inmobiliarias",
};

export default function PropertiesPage() {
	return (
		<section className="grid gap-5">
			<PropertyHeader />
			<PropertyFilter />
			<PropertyList />
		</section>
	);
}
