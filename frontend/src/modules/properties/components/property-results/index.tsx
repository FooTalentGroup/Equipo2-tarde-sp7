import PropertyList from "@src/modules/properties/components/property-list";
import { getProperties } from "@src/modules/properties/services/property-service";
import type { PropertyFilterForm } from "@src/types/property-filter";

interface PropertyResultsProps {
	filters: PropertyFilterForm;
}

import { cookies } from "next/headers";

export default async function PropertyResults({
	filters,
}: PropertyResultsProps) {
	const cookieStore = await cookies();
	const token = cookieStore.get("auth_token")?.value;
	const propertyData = await getProperties(filters, token);

	return <PropertyList properties={propertyData.properties} />;
}
