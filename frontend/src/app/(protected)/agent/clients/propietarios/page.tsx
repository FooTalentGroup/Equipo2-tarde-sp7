import ClientsLayout from "@src/components/layouts/client-layout";
import { PropertyOwnerCard } from "@src/modules/clients/ui/PropertyOwnerCard";
import type { Client } from "@src/types/client";

const owners: Client[] = []; // tus datos

export default function PropietariosPage() {
	return (
		<ClientsLayout activeTab="propietarios">
			<div className="space-y-0">
				{owners.map((owner, index) => (
					<PropertyOwnerCard
						key={owner.id}
						client={owner}
						defaultOpen={index === 0}
					/>
				))}
			</div>
		</ClientsLayout>
	);
}
