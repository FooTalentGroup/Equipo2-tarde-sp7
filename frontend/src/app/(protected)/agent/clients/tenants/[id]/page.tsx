import { paths } from "@src/lib/paths";
import {
	ClientContactInfo,
	ClientHeader,
	ClientNotes,
	ClientProperties,
} from "@src/modules/clients/components/client-detail";
import { getClientById } from "@src/modules/clients/services/clients-service";
import type { TenantApiResponse } from "@src/types/clients/tenant";

export default async function TenantDetailPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;

	const responseData = await getClientById<TenantApiResponse>(id);

	if (!responseData || !responseData.client) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<p className="text-lg text-slate-600">
					No se encontró el propietario solicitado
				</p>
			</div>
		);
	}

	const clientData = responseData.client;
	const rented = responseData.rented_property;
	const properties = rented ? [rented] : [];

	const client = {
		id: String(clientData.id),
		first_name: clientData.first_name,
		last_name: clientData.last_name,
		email: clientData.email,
		phone: clientData.phone,
		dni: clientData.dni ?? "",
		address: clientData.address ?? "",
		created_at: clientData.registered_at
			? new Date(clientData.registered_at).toLocaleDateString("es-AR")
			: "",
		notes: clientData.notes ?? "",
	};

	return (
		<div className="min-h-screen">
			<div className="w-full">
				<ClientHeader
					id={client.id}
					firstName={client.first_name}
					lastName={client.last_name}
					status="inquilino"
					editPath={paths.agent.clients.inquilinos.edit(id)}
					dni={client.dni}
				/>
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
					<div className="lg:col-span-1 space-y-6">
						<ClientContactInfo
							phone={client.phone}
							email={client.email}
							address={client.address}
							createdAt={client.created_at}
						/>
						<ClientNotes notes={client.notes} clientId={client.id} />
					</div>

					<div className="lg:col-span-2">
						<ClientProperties
							properties={properties}
							title="Propiedades alquilada"
							addProperty={false}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
