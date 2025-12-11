"use server";

import ClientsLayout from "@src/components/layouts/client-layout";
import { OwnersList } from "@src/modules/clients/components/owners/owners-list";
import { getClients } from "@src/modules/clients/services/clients-service";
import type { Owner } from "@src/types/clients/owner";

export default async function PropietariosPage() {
	const { clients: owners } = await getClients<Owner>("clients", {
		contact_category_id: 3,
	});

	return (
		<ClientsLayout activeTab="propietarios">
			<OwnersList owners={owners} itemsPerPage={5} />
		</ClientsLayout>
	);
}
