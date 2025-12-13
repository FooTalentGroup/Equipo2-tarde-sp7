import { paths } from "@src/lib/paths";
import {
	ClientContactInfo,
	ClientHeader,
	ClientNotes,
	ClientProperties,
} from "@src/modules/clients/components/client-detail";
import {
	addPropertyOfInterest,
	getClientById,
	removePropertyOfInterest,
} from "@src/modules/clients/services/clients-service";
import { getProperties } from "@src/modules/properties/services/property-service";
import type { LeadApiResponse } from "@src/types/clients/lead";

export default async function LeadDetailPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;

	// Obtener datos del lead desde el backend (nueva estructura)
	const responseData = await getClientById<LeadApiResponse>(id);

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

	const clientData = responseData.client;
	const propertiesOfInterest = responseData.properties_of_interest || [];
	const consultationTypeName =
		responseData.consultations && responseData.consultations.length > 0
			? (responseData.consultations[0]?.consultation_type?.name ??
				"Consulta general")
			: "Consulta general";

	// Propiedades disponibles para asignar (desde backend)
	const { properties: availableProperties } = await getProperties({
		includeArchived: false,
	});

	async function handleAddPropertyOfInterest(propertyId: string) {
		"use server";
		await addPropertyOfInterest(id, propertyId);
	}

	async function handleDeletePropertyOfInterest(propertyId: string | number) {
		"use server";
		await removePropertyOfInterest(id, propertyId);
	}

	// Mapear datos del backend
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

	// Mapear propiedades desde el backend con la estructura completa
	const properties = propertiesOfInterest.map((prop) => ({
		id: String(prop.id),
		address: prop.address.full_address,
		city: prop.address.city.name,
		type: prop.property_type.name,
		rooms: prop.bedrooms,
		bathrooms: prop.bathrooms,
		surface: parseFloat(prop.surface_area),
		image: prop.main_image?.url || "",
		status: prop.property_status.name.toLowerCase(),
		age: prop.publication_date
			? new Date(prop.publication_date).toLocaleDateString("es-AR")
			: "",
	}));

	return (
		<div className="min-h-screen">
			<div className="w-full">
				{/* Header */}
				<ClientHeader
					id={client.id}
					firstName={client.first_name}
					lastName={client.last_name}
					status="lead"
					editPath={paths.agent.clients.leads.edit(id)}
					consultationTypeName={consultationTypeName}
				/>
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
					{/* Columna izquierda - Información */}
					<div className="lg:col-span-1 space-y-6">
						<ClientContactInfo
							phone={client.phone}
							email={client.email}
							address={client.address}
							createdAt={client.created_at}
						/>
						<ClientNotes notes={client.notes} />
					</div>

					{/* Columna derecha - Propiedades */}
					<div className="lg:col-span-2">
						<ClientProperties
							properties={properties}
							title="Propiedades de interés"
							availableProperties={availableProperties}
							onAddProperty={handleAddPropertyOfInterest}
							onDeleteProperty={handleDeletePropertyOfInterest}
							operationType={[1, 2]}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
