import ClientsLayout from "@src/components/layouts/client-layout";
import { OwnerCard } from "@src/modules/clients/ui/PropertyOwnerCard";
import type { Owner } from "@src/types/clients/owner";

const owners: Owner[] = [
	{
		first_name: "Ana",
		last_name: "Martínez",
		phone: "1187654321",
		email: "ana.martinez@example.com",
		contact_category: "Propietario",
		dni: "28987654",
		address: "Av. Santa Fe 2345, Piso 5",
		notes: "Propietaria de 3 propiedades, prefiere contacto por email",
		city: "Buenos Aires",
		province: "Buenos Aires",
		country: "Argentina",
		id: "1",
		created_at: "",
		updated_at: "",
	},
	{
		first_name: "Carlos",
		last_name: "Fernández",
		phone: "3415678234",
		email: "carlos.fernandez@example.com",
		contact_category: "Propietario",
		dni: "32456789",
		address: "Bv. Oroño 1520, Depto 8B",
		notes:
			"Propietario de 2 departamentos en zona norte, disponible horario laboral",
		city: "Rosario",
		province: "Santa Fe",
		country: "Argentina",
		id: "2",
		created_at: "",
		updated_at: "",
	},
	{
		first_name: "María",
		last_name: "González",
		phone: "3414892765",
		email: "maria.gonzalez@example.com",
		contact_category: "Propietario",
		dni: "27334521",
		address: "San Lorenzo 945, PB",
		notes:
			"Propietaria de casa en Fisherton, prefiere contacto telefónico por las mañanas",
		city: "Rosario",
		province: "Santa Fe",
		country: "Argentina",
		id: "3",
		created_at: "",
		updated_at: "",
	},
];

export default function PropietariosPage() {
	return (
		<ClientsLayout activeTab="propietarios">
			<div className="space-y-0">
				{owners.map((owner, index) => (
					<OwnerCard key={index} owner={owner} />
				))}
			</div>
		</ClientsLayout>
	);
}
