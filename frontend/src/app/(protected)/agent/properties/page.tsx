import { AdjustmentsHorizontalIcon } from "@heroicons/react/24/outline";
import SectionHeading from "@src/components/section-heading";
import { Button } from "@src/components/ui/button";
import PropertyList from "@src/modules/properties/components/property-list";
import { getProperties } from "@src/modules/properties/services/property-service";

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
						type="submit"
						size="lg"
						variant="outline"
						className="w-[140px]"
					>
						<AdjustmentsHorizontalIcon className="size-6" /> Filtrar
					</Button>
					// <Button
					// 	size="lg"
					// 	variant="tertiary"
					// 	asChild
					// 	aria-label="Crear propiedad"
					// >
					// 	<Link href={paths.agent.properties.new()}>
					// 		<Plus />
					// 		Crear propiedad
					// 	</Link>
					// </Button>
				}
			/>
			{/* <PropertyFilter /> */}
			<PropertyList properties={data.properties} />
		</>
	);
}
