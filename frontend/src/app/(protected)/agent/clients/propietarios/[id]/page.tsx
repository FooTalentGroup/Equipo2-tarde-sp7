import {
	ClientContactInfo,
	ClientHeader,
	ClientNotes,
	ClientProperties,
} from "@src/modules/clients/components/client-detail";
import { getClientById } from "@src/modules/clients/services/clients-service";
import type { OwnerApiResponse } from "@src/types/clients/owner";

export default async function OwnerDetailPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;

	// Obtener datos del propietario desde el backend (nueva estructura)
	const responseData = await getClientById<OwnerApiResponse>(id);

	// Si no hay datos, mostrar fallback
	if (!responseData || !responseData.client) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<p className="text-lg text-slate-600">
					No se encontró el propietario solicitado
				</p>
			</div>
		);
	}

	const ownerData = responseData.client;
	const ownedProperties = responseData.owned_properties || [];

	// Mapear datos del backend
	const owner = {
		id: String(ownerData.id),
		first_name: ownerData.first_name,
		last_name: ownerData.last_name,
		email: ownerData.email,
		phone: ownerData.phone,
		dni: ownerData.dni ?? "",
		address: ownerData.address ?? "",
		created_at: ownerData.registered_at
			? new Date(ownerData.registered_at).toLocaleDateString("es-AR")
			: "",
		notes: ownerData.notes ?? "",
	};

	// Mapear propiedades desde el backend con la estructura completa
	const properties = ownedProperties.map((prop) => ({
		id: String(prop.id),
		address: prop.address.full_address,
		city: prop.address.city.name,
		type: prop.property_type.name,
		rooms: prop.bedrooms,
		bathrooms: prop.bathrooms,
		surface: parseFloat(prop.surface_area),
		image: prop.main_image?.url || "/api/placeholder/400/300",
		status: prop.property_status.name.toLowerCase(),
		age: prop.age?.name || "",
	}));

	return (
		<div className="min-h-screen">
			<div className="w-full">
				{/* Header */}
				<ClientHeader
					id={owner.id}
					firstName={owner.first_name}
					lastName={owner.last_name}
					dni={owner.dni}
					status="propietario"
					editPath={`${id}/edit`}
				/>
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
					{/* Columna izquierda - Información */}
					<div className="lg:col-span-1 space-y-6">
						<ClientContactInfo
							phone={owner.phone}
							email={owner.email}
							address={owner.address}
							createdAt={owner.created_at}
						/>
						<ClientNotes notes={owner.notes} />
					</div>

					{/* Columna derecha - Propiedades */}
					<div className="lg:col-span-2">
						<ClientProperties properties={properties} />
					</div>
				</div>
			</div>
		</div>
	);
}
