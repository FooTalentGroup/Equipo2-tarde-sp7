import { cookies } from "next/headers";

import OwnerForm from "@src/modules/clients/components/owners/owners-forms";
import TipAlert from "@src/modules/clients/ui/TipAlert";
import { getProperties } from "@src/modules/properties/services/property-service";

export const dynamic = "force-dynamic";

async function Page() {
	const cookieStore = await cookies();
	const token = cookieStore.get("authToken")?.value || "";

	const propertyResponse = await getProperties({
		includeArchived: false,
		token,
	});

	const availableProperties = propertyResponse.properties;

	return (
		<div className="flex w-full gap-6">
			<OwnerForm availableProperties={availableProperties} />
			<TipAlert />
		</div>
	);
}

export default Page;
