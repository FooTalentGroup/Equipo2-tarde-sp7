import {
	ClientContactInfo,
	ClientHeader,
	ClientNotes,
	ClientProperties,
} from "@src/modules/clients/components/client-detail";
import { getClientById } from "@src/modules/clients/services/clients-service";
import type { Lead } from "@src/types/clients/lead";

export default async function LeadDetailPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;

	// Obtener datos del propietario desde el backend
	const responseData = await getClientById<{
		client: Lead;
		properties_of_interest: Array<{
			id: number;
			title: string;
			property_type: { id: number; name: string };
			property_status: { id: number; name: string };
			interest_created_at: string;
		}>;
	}>(id);

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
	/* const ownedProperties = responseData.owned_properties || []; */

	// Mapear datos del backend
	const client = {
		id: String(clientData.id),
		first_name: clientData.first_name,
		last_name: clientData.last_name,
		email: clientData.email,
		phone: clientData.phone,
		dni: clientData.dni,
		address: clientData.address ?? "",
		created_at: clientData.registered_at
			? new Date(clientData.registered_at).toLocaleDateString("es-AR")
			: "",
		notes: clientData.notes ?? "",
	};

	// Mapear propiedades desde el backend
	/* const properties = ownedProperties.map((prop) => ({
		id: String(prop.id),
		full-address: prop.title,
		city: "",
		type: prop.property_type?.name || "Propiedad",
		rooms: 0,
		bathrooms: 0,
		surface: 0,
		image: "/api/placeholder/400/300",
		status: prop.property_status?.name?.toLowerCase() || "disponible",
		age: prop.publication_date
			? new Date(prop.publication_date).toLocaleDateString("es-AR")
			: "",
	})); */

	const properties = [
		{
			id: "1",
			address: "Calle Mayor 45, 3º B",
			city: "Rosario",
			type: "Departamento",
			rooms: 3,
			bathrooms: 2,
			surface: 85,
			image: "/api/placeholder/400/300",
			status: "ocupado",
			age: "1 año",
		},
		{
			id: "2",
			address: "Av. de la Libertad 128",
			city: "Rosario",
			type: "Casa",
			rooms: 4,
			bathrooms: 3,
			surface: 180,
			image: "/api/placeholder/400/300",
			status: "disponible",
			age: "2 años",
		},
		{
			id: "3",
			address: "San Martín 567, 1º A",
			city: "Rosario",
			type: "Departamento",
			rooms: 2,
			bathrooms: 1,
			surface: 55,
			image: "/api/placeholder/400/300",
			status: "ocupado",
			age: "5 años",
		},
	];

	return (
		<div className="min-h-screen">
			<div className="w-full">
				{/* Header */}
				<ClientHeader
					id={client.id}
					firstName={client.first_name}
					lastName={client.last_name}
					status="lead"
					editPath={`${id}/edit`}
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
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
