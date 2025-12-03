import SectionHeading from "@src/components/section-heading";
import CreatePropertyForm from "@src/modules/properties/components/create-property";
import { getClients } from "@src/modules/properties/services/client-service";

export const dynamic = "force-dynamic";

export default async function NewPropertyPage() {
	const clientsData = await getClients();

	return (
		<>
			<SectionHeading title="Nueva propiedad" />
			<section>
				<CreatePropertyForm clients={clientsData.clients || []} />
			</section>
		</>
	);
}
