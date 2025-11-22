import Link from "next/link";

import SectionHeading from "@src/components/section-heading";
import { Button } from "@src/components/ui/button";
import { paths } from "@src/lib/paths";
import PropertyFilter from "@src/modules/properties/components/property-filter";
import PropertyList from "@src/modules/properties/components/property-list";
import { Plus } from "lucide-react";

export const metadata = {
	title: "Propiedades",
	description: "Gestión de propiedades inmobiliarias",
};

export default function PropertiesPage() {
	return (
		<>
			<SectionHeading
				title="Propiedades"
				actions={
					<Button size="lg" asChild aria-label="Crear propiedad">
						<Link href={paths.admin.properties.new()}>
							<Plus />
							Crear propiedad
						</Link>
					</Button>
				}
			/>
			<PropertyFilter />
			<PropertyList />
		</>
	);
}
