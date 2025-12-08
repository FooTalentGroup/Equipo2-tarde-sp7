import { notFound } from "next/navigation";

import PropertyDetailView from "@src/modules/properties/components/property-detail";
import { getPropertyById } from "@src/modules/properties/services/property-service";

type Props = {
	params: Promise<{ id?: string }>;
};

export default async function EditPropertyPage({ params }: Props) {
	const resolved = await params;
	const id = resolved?.id;

	const data = await getPropertyById(Number(id));

	if (!data) return notFound();

	return <PropertyDetailView property={data.property} />;
}
