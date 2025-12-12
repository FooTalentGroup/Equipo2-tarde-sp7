"use server";

import ClientsLayout from "@src/components/layouts/client-layout";
import { LeadsList } from "@src/modules/clients/components/leads/leads-list";
import { getClients } from "@src/modules/clients/services/clients-service";
import type { LeadWithProperties } from "@src/types/clients/lead";

export default async function LeadsPage() {
	const { clients: leads } = await getClients<LeadWithProperties>("clients", {
		contact_category_id: 1,
	});

	return (
		<ClientsLayout activeTab="leads">
			<LeadsList leads={leads} itemsPerPage={5} />
		</ClientsLayout>
	);
}
