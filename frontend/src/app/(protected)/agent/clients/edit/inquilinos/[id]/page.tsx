import TenantForm from "@src/modules/clients/components/create-tenants/tenants-form";
import type { TenantFormData } from "@src/modules/clients/schemas/tenant-form.schema";
import { getClientById } from "@src/modules/clients/services/clients-service";
import TipAlert from "@src/modules/clients/ui/TipAlert";
import { getProperties } from "@src/modules/properties/services/property-service";
import type { TenantApiResponse } from "@src/types/clients/tenant";

export const dynamic = "force-dynamic";

export default async function Page({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;

	const propertyResponse = await getProperties({ includeArchived: false });
	const availableProperties = propertyResponse.properties;

	const clientResponse = await getClientById<TenantApiResponse>(id);
	if (!clientResponse || !clientResponse.client) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<p className="text-lg text-slate-600">
					No se encontró el inquilino solicitado
				</p>
			</div>
		);
	}

	const client = clientResponse.client;
	const rented = clientResponse.rented_property;

	const initialValues: TenantFormData = {
		first_name: client.first_name || "",
		last_name: client.last_name || "",
		dni: client.dni || "",
		phone: client.phone || "",
		email: client.email || "",
		property_id: rented?.id ? String(rented.id) : "",
		contract_start_date: rented?.rental?.contract_start_date || "",
		contract_end_date: rented?.rental?.contract_end_date || "",
		next_increase_date: rented?.rental?.next_increase_date || "",
		monthly_amount:
			rented?.rental?.monthly_amount != null
				? String(rented.rental.monthly_amount)
				: "",
		notes: client.notes || "",
	};

	return (
		<div className="flex w-full gap-6">
			<TenantForm
				availableProperties={availableProperties}
				initialValues={initialValues}
				clientId={id}
			/>
			<TipAlert />
		</div>
	);
}
