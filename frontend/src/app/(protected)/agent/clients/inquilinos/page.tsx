"use server";

import ClientsLayout from "@src/components/layouts/client-layout";
import { TenantsList } from "@src/modules/clients/components/tenants/tenants-list";
import { getClients } from "@src/modules/clients/services/clients-service";
import type { Tenant } from "@src/types/clients/tenant";

export default async function InquilinosPage() {
	const { clients: tenants } = await getClients<Tenant>("clients", {
		contact_category_id: 2,
	});

	return (
		<ClientsLayout activeTab="inquilinos">
			<TenantsList tenants={tenants} itemsPerPage={5} />
		</ClientsLayout>
	);
}
