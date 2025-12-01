import Link from "next/link";

import SectionHeading from "@src/components/section-heading";
import { Button } from "@src/components/ui/button";
import { paths } from "@src/lib/paths";
import PropertyFilter from "@src/modules/properties/components/property-filter";
import PropertyList from "@src/modules/properties/components/property-list";
import { getProperties } from "@src/modules/properties/services/property-service";
import { Plus } from "lucide-react";

export const metadata = {
	title: "Propiedades",
	description: "Gestión de propiedades inmobiliarias",
};

export default async function PropertiesPage() {
	const data = await getProperties();

	return (
		<>
			<SectionHeading
				title="Propiedades"
				actions={
					<Button
						size="lg"
						variant="tertiary"
						asChild
						aria-label="Crear propiedad"
					>
						<Link href={paths.agent.properties.new()}>
							<Plus />
							Crear propiedad
						</Link>
					</Button>
				}
			/>
			<PropertyFilter />
			<PropertyList properties={data.properties} />
		</>
	);
}
