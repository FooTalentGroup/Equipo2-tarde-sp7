import ClientsLayout from "@src/components/layouts/client-layout";
import { LeadsCard } from "@src/modules/clients/ui/LeadsCard";
import type { Client } from "@src/types/client";

const clients = [
	{
		id: 1,
		name: "María González",
		type: "lead",
		dni: "28.345.112",
		address: "Av. Rivadavia 7421, CABA",
		phone: "+54 11 4567-8901",
		email: "maria.g@email.com",
		origin: "Web",
		interest: "Alquilar • 2 amb en Palermo",
	},
	{
		id: 2,
		name: "Florencia Duarte",
		type: "lead",
		dni: "31.554.887",
		address: "9 de Julio 128, San Isidro",
		phone: "+54 11 2345-6789",
		email: "florencia.d@email.com",
		origin: "web",
		interest: "Alquilar • Casa en San Isidro",
	},
	{
		id: 3,
		name: "Paula Herrera",
		type: "lead",
		dni: "27.771.338",
		address: "Av. Santa Fe 3500, CABA",
		phone: "+54 11 9876-5432",
		email: "paula.h@email.com",
		origin: "web",
		interest: "Comprar • Departamento en Recoleta",
	},
	{
		id: 4,
		name: "Carolina Vega",
		type: "propietario",
		dni: "34.112.445",
		address: "San Martín 1256, CABA",
		phone: "+54 11 7654-3210",
		email: "carolina.v@email.com",
		origin: "3",
		interest: "Alquilar • 3 amb en Belgrano",
	},
] satisfies Client[];

export default function LeadsPage() {
	return (
		<ClientsLayout activeTab="leads">
			<div className="space-y-0">
				{clients
					.filter((client) => client.type === "lead")
					.map((client) => (
						<LeadsCard key={client.id} client={client} />
					))}
			</div>
		</ClientsLayout>
	);
}
