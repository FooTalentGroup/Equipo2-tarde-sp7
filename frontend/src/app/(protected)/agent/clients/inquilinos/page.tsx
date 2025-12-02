import ClientsLayout from "@src/components/layouts/client-layout";
import TenantCard from "@src/modules/clients/ui/TenantCard";
import type { Tenant } from "@src/types/client";

const tenants: Tenant[] = [
	{
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
	},
]; // tus datos

export default function InquilinosPage() {
	return (
		<ClientsLayout activeTab="inquilinos">
			<div className="space-y-0">
				{tenants.map((tenant, index) => (
					<TenantCard
						key={tenant.dni}
						tenant={tenant}
						defaultOpen={index === 0}
					/>
				))}
			</div>
		</ClientsLayout>
	);
}
