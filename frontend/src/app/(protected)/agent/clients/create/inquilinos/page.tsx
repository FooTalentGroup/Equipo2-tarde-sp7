import { cookies } from "next/headers";

import TenantForm from "@src/modules/clients/components/create-tenants/tenants-form";
import TipAlert from "@src/modules/clients/ui/TipAlert";
import { getProperties } from "@src/modules/properties/services/property-service";

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
			<TenantForm availableProperties={availableProperties} />
			<TipAlert />
		</div>
	);
}

export default Page;
