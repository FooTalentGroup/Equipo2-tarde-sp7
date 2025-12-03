import { AdjustmentsHorizontalIcon } from "@heroicons/react/24/outline";
import SectionHeading from "@src/components/section-heading";
import { Button } from "@src/components/ui/button";
import PropertyList from "@src/modules/properties/components/property-list";
import { getProperties } from "@src/modules/properties/services/property-service";

export const metadata = {
	title: "Propiedades",
	description: "Gestión de propiedades inmobiliarias",
};

export const dynamic = "force-dynamic";

export default async function PropertiesPage() {
	const propertyData = await getProperties();

	return (
		<>
			<SectionHeading
				title="Propiedades"
				actions={
					<Button
						type="submit"
						size="lg"
						variant="outline"
						className="w-[140px]"
					>
						<AdjustmentsHorizontalIcon className="size-6" /> Filtrar
					</Button>
				}
			/>
			<PropertyList properties={propertyData.properties} />
		</>
	);
}
