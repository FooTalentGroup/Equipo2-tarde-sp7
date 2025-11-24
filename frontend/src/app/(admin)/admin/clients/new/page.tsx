import { Card, CardContent } from "@src/components/ui/card";
import { Heading } from "@src/components/ui/heading";
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@src/components/ui/tabs";
import TenantForm from "@src/modules/clients/components/tenant-form";
/* import { Button } from "@src/components/ui/button";
import { Input } from "@src/components/ui/input";
import { LeadsCard } from "@src/modules/clients/ui/LeadsCard";
import { PropertyOwnerCard } from "@src/modules/clients/ui/PropertyOwnerCard";
import TenantCard from "@src/modules/clients/ui/TenantCard";
import type { Client, Tenant } from "@src/types/client";
import { Search } from "lucide-react"; */

export default function page() {
	return (
		<div className="w-full mx-auto">
			{/* Header */}
			<Card>
				<CardContent className="flex items-center gap-4 justify-between">
					<Heading variant="h2" weight="semibold" className="text-secondary">
						Nuevo cliente
					</Heading>
				</CardContent>
			</Card>

			{/* Search and Tabs */}
			<Tabs defaultValue="leads" className="w-full">
				<div className="flex items-center my-4">
					<TabsList className="justify-start gap-2 rounded-none bg-transparent border-b text-black">
						<TabsTrigger
							value="leads"
							className="data-[state=active]:bg-secondary data-[state=active]:text-primary-foreground font-normal rounded-md bg-primary-light"
						>
							Leads
						</TabsTrigger>
						<TabsTrigger
							value="inquilinos"
							className="data-[state=active]:bg-secondary data-[state=active]:text-primary-foreground font-normal rounded-md bg-primary-light"
						>
							Inquilinos
						</TabsTrigger>
						<TabsTrigger
							value="propietarios"
							className="data-[state=active]:bg-secondary data-[state=active]:text-primary-foreground font-normal rounded-md bg-primary-light"
						>
							Propietarios
						</TabsTrigger>
					</TabsList>
				</div>

				{/* Tab Content - Leads */}
				<TabsContent value="leads" className="mt-0">
					<h1>Formulario Leads</h1>
				</TabsContent>

				{/* Tab Content - Inquilinos */}
				<TabsContent value="inquilinos" className="mt-0">
					<TenantForm />
				</TabsContent>

				{/* Tab Content - Propietarios */}
				<TabsContent value="propietarios" className="mt-0">
					<h1>Formulario Propietarios</h1>
					{/* <div className="space-y-0">
						{clients
							.filter((client) => client.type === "propietario")
							.map((client, index) => (
								<PropertyOwnerCard
									key={client.id}
									client={client}
									defaultOpen={index === 0}
								/>
							))}
					</div> */}
				</TabsContent>
			</Tabs>
		</div>
	);
}
