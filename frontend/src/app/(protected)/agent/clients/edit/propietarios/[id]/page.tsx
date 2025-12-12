import OwnerForm from "@src/modules/clients/components/create-owners/owners-forms";
import type { OwnerFormData } from "@src/modules/clients/schemas/owner-form.schema";
import { getClientById } from "@src/modules/clients/services/clients-service";
import TipAlert from "@src/modules/clients/ui/TipAlert";
import { getProperties } from "@src/modules/properties/services/property-service";
import type { OwnerApiResponse } from "@src/types/clients/owner";

export const dynamic = "force-dynamic";

export default async function Page({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;

	const propertyResponse = await getProperties({ includeArchived: false });
	const availableProperties = propertyResponse.properties;

	const clientResponse = await getClientById<OwnerApiResponse>(id);
	if (!clientResponse || !clientResponse.client) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<p className="text-lg text-slate-600">
					No se encontró el propietario solicitado
				</p>
			</div>
		);
	}

	const client = clientResponse.client;
	const firstOwnedPropertyId = clientResponse.owned_properties?.[0]?.id ?? null;

	const initialValues: OwnerFormData = {
		first_name: client.first_name || "",
		last_name: client.last_name || "",
		dni: client.dni || "",
		phone: client.phone || "",
		email: client.email || "",
		address: client.address || "",
		property_id: firstOwnedPropertyId ? String(firstOwnedPropertyId) : "",
		notes: client.notes || "",
	};

	return (
		<div className="flex w-full gap-6">
			<OwnerForm
				availableProperties={availableProperties}
				initialValues={initialValues}
				clientId={id}
			/>
			<TipAlert />
		</div>
	);
}
