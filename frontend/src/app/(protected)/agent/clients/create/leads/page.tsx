import { cookies } from "next/headers";

import LeadsForm from "@src/modules/clients/components/leads/leads-form";
import TipAlert from "@src/modules/clients/ui/tip-alert";
import { getProperties } from "@src/modules/properties/services/property-service";

export const dynamic = "force-dynamic";

async function Page() {
	// Cargar propiedades en el servidor con autenticación
	const cookieStore = await cookies();
	const token = cookieStore.get("authToken")?.value || "";

	const propertyResponse = await getProperties({
		includeArchived: false,
		token,
	});

	const availableProperties = propertyResponse.properties;

	return (
		<div className="flex w-full gap-6">
			<LeadsForm availableProperties={availableProperties} />
			<TipAlert />
		</div>
	);
}

export default Page;
