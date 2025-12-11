import ClientsLayout from "@src/components/layouts/client-layout";
import { getClients } from "@src/modules/clients/services/clients-service";
import { OwnerCard } from "@src/modules/clients/ui/property-owner-card";
import type { Owner, OwnerApiResponse } from "@src/types/clients/owner";

function mapOwner(apiOwner: OwnerApiResponse): Owner {
	return {
		id: String(apiOwner.id),
		first_name: apiOwner.first_name,
		last_name: apiOwner.last_name,
		phone: apiOwner.phone,
		email: apiOwner.email,
		contact_category: "Propietario",
		dni: apiOwner.dni,
		address: apiOwner.address ?? "",
		notes: apiOwner.notes ?? "",
		city: apiOwner.city ?? undefined,
		province: apiOwner.province ?? undefined,
		country: apiOwner.country ?? undefined,
		property_id: apiOwner.owned_properties?.[0]?.id,
		property_count: apiOwner.owned_properties?.length,
		created_at: apiOwner.registered_at ?? "",
		updated_at: apiOwner.registered_at ?? "",
	};
}

export default async function PropietariosPage() {
	const { clients } = await getClients<OwnerApiResponse>("clients", {
		contact_category_id: 3,
	});

	const owners = (clients || []).map(mapOwner);

	return (
		<ClientsLayout activeTab="propietarios">
			<div className="space-y-0">
				{owners.map((owner) => (
					<OwnerCard key={owner.id} owner={owner} />
				))}
			</div>
		</ClientsLayout>
	);
}
