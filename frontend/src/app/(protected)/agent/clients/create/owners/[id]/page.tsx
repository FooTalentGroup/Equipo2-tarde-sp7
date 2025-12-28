import { cookies } from "next/headers";

import OwnerForm from "@src/modules/clients/components/owners/owners-forms";
import type { OwnerFormData } from "@src/modules/clients/schemas/owner-form.schema";
import { getClientById } from "@src/modules/clients/services/clients-service";
import TipAlert from "@src/modules/clients/ui/tip-alert";
import { getProperties } from "@src/modules/properties/services/property-service";
import type { LeadApiResponse } from "@src/types/clients/lead";

export const dynamic = "force-dynamic";

interface PageProps {
	params: Promise<{
		id: string;
	}>;
}

async function Page({ params }: PageProps) {
	const resolvedParams = await params;
	const { id } = resolvedParams;

	const cookieStore = await cookies();
	const token = cookieStore.get("authToken")?.value || "";

	const propertyResponse = await getProperties({
		includeArchived: false,
		token,
	});

	const availableProperties = propertyResponse.properties;

	let initialValues: Partial<OwnerFormData> | undefined;
	if (id) {
		try {
			const leadData = await getClientById<LeadApiResponse>(id);
			if (leadData) {
				const email = leadData.client.email || "";
				const formattedEmail =
					email && !email.endsWith(".ar") ? `${email}.ar` : email;
				const phone = leadData.client.phone || "";
				const formattedPhone =
					phone.startsWith("+54") && !phone.startsWith("+549")
						? `+549${phone.substring(3)}`
						: phone;

				initialValues = {
					first_name: leadData.client.first_name,
					last_name: leadData.client.last_name,
					email: formattedEmail,
					phone: formattedPhone,
					dni: leadData.client.dni || "",
				};
			}
		} catch (error) {
			console.error("Error loading lead data:", error);
		}
	}

	return (
		<div className="flex w-full gap-6">
			<OwnerForm
				availableProperties={availableProperties}
				initialValues={initialValues}
				leadId={id}
			/>
			<TipAlert />
		</div>
	);
}

export default Page;
