import LeadsForm from "@src/modules/clients/components/leads/leads-form";
import type { ContactFormData } from "@src/modules/clients/schemas/contact-form.schema";
import { getClientById } from "@src/modules/clients/services/clients-service";
import TipAlert from "@src/modules/clients/ui/TipAlert";
import { getProperties } from "@src/modules/properties/services/property-service";
import type { LeadApiResponse } from "@src/types/clients/lead";

export const dynamic = "force-dynamic";

export default async function Page({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;

	const propertyResponse = await getProperties({ includeArchived: false });

	const clientResponse = await getClientById<LeadApiResponse>(id);

	if (!clientResponse || !clientResponse.client) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<p className="text-lg text-slate-600">
					No se encontró el lead solicitado
				</p>
			</div>
		);
	}

	const client = clientResponse.client;
	const firstInterestedPropertyId =
		clientResponse.properties_of_interest?.[0]?.id ?? null;

	// Determinar consultation_type_id desde las consultas del lead
	const consultationTypeId =
		clientResponse.consultations?.[0]?.consultation_type?.id || 1;

	const initialValues: ContactFormData = {
		first_name: client.first_name || "",
		last_name: client.last_name || "",
		phone: client.phone || "",
		email: client.email || "",
		consultation_type_id: consultationTypeId,
		notes: client.notes || "",
		property_id: firstInterestedPropertyId
			? String(firstInterestedPropertyId)
			: "",
	};

	const availableProperties = propertyResponse.properties;

	return (
		<div className="flex w-full gap-6">
			<LeadsForm
				availableProperties={availableProperties}
				initialValues={initialValues}
				clientId={id}
			/>
			<TipAlert />
		</div>
	);
}
