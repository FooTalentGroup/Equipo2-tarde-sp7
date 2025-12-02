/* import Link from "next/link";

import SectionHeading from "@src/components/section-heading/index";
import { Button } from "@src/components/ui/button";
import { Input } from "@src/components/ui/input";
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@src/components/ui/tabs";
import { paths } from "@src/lib/paths";
import { LeadsCard } from "@src/modules/clients/ui/LeadsCard";
import { PropertyOwnerCard } from "@src/modules/clients/ui/PropertyOwnerCard";
import TenantCard from "@src/modules/clients/ui/TenantCard";
import type { Client, Tenant } from "@src/types/client";
import { Plus, Search } from "lucide-react";

// Datos de ejemplo (en tu caso vendrían de la base de datos)
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

const demoTenant: Tenant = {
	name: "Julián Benítez",
	dni: "33.912.554",
	address: "Lavalle 2240, CABA",
	phone: "+54 11 5678-9012",
	email: "julian.b@email.com",
	type: "Inquilino",
	rentAmount: 250000,
	nextIncrease: {
		date: "2025-03-15",
		amount: 275000,
	},
	currentPayment: {
		amount: 250000,
		dueDate: "2024-12-10",
		status: "pending",
	},
	paymentHistory: [
		{
			month: "Noviembre",
			amount: 250000,
			status: "paid",
			date: "2024-11-08",
		},
		{
			month: "Octubre",
			amount: 250000,
			status: "paid",
			date: "2024-10-10",
		},
		{
			month: "Septiembre",
			amount: 250000,
			status: "paid",
			date: "2024-09-09",
		},
	],
};

export default function pagetabs2() {
	return (
		<div className="w-full mx-auto">
			<SectionHeading
				title="Propiedades"
				actions={
					<Button
						size="lg"
						variant="tertiary"
						asChild
						aria-label="Crear propiedad"
					>
						<Link href={paths.agent.clients.new()}>
							<Plus />
							Crear propiedad
						</Link>
					</Button>
				}
			/>

			<Tabs defaultValue="leads" className="w-full">
				<div className="flex items-center my-4">
					<div className="border-b w-full max-w-2/3">
						<div className="relative">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
							<Input
								type="text"
								placeholder="Buscar por nombre, DNI o dirección..."
								className="pl-10 h-7"
							/>
						</div>
					</div>

					<TabsList className="justify-start gap-2 rounded-none bg-transparent border-b px-5 text-black">
						<TabsTrigger
							value="leads"
							className="data-[state=active]:bg-secondary data-[state=active]:text-primary-foreground rounded-md bg-primary-light"
						>
							Leads
						</TabsTrigger>
						<TabsTrigger
							value="inquilinos"
							className="data-[state=active]:bg-secondary data-[state=active]:text-primary-foreground rounded-md bg-primary-light"
						>
							Inquilinos
						</TabsTrigger>
						<TabsTrigger
							value="propietarios"
							className="data-[state=active]:bg-secondary data-[state=active]:text-primary-foreground rounded-md bg-primary-light"
						>
							Propietarios
						</TabsTrigger>
					</TabsList>
				</div>

				<TabsContent value="leads" className="mt-0">
					<div className="space-y-0">
						{clients
							.filter((client) => client.type === "lead")
							.map((client, index) => (
								<LeadsCard
									key={client.id}
									client={client}
									defaultOpen={index === 0}
								/>
							))}
					</div>
				</TabsContent>

				<TabsContent value="inquilinos" className="mt-0">
					<div className="space-y-0">
						{([demoTenant] as Tenant[]).map((tenant: Tenant, index: number) => (
							<TenantCard
								key={tenant.dni}
								tenant={tenant}
								defaultOpen={index === 0}
							/>
						))}
					</div>
				</TabsContent>

				<TabsContent value="propietarios" className="mt-0">
					<div className="space-y-0">
						{clients
							.filter((client) => client.type === "propietario")
							.map((client, index) => (
								<PropertyOwnerCard
									key={client.id}
									client={client}
									defaultOpen={index === 0}
								/>
							))}
					</div>
				</TabsContent>
			</Tabs>
		</div>
	);
}
 */
