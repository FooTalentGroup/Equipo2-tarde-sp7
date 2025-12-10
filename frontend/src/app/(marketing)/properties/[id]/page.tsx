import { notFound } from "next/navigation";

import MainLayout from "@src/components/layouts/main-layout";
import { Heading } from "@src/components/ui/heading";
import { getPropertyById } from "@src/modules/properties/services/property-service";

type Props = {
	params: Promise<{
		id: string;
	}>;
};

export default async function PropertyDetailPage({ params }: Props) {
	const { id } = await params;
	const propertyId = Number.parseInt(id, 10);

	if (Number.isNaN(propertyId)) {
		notFound();
	}

	const data = await getPropertyById(propertyId);

	if (!data) {
		notFound();
	}

	const { property } = data;

	return (
		<MainLayout as="section" size="lg" className="py-20">
			<Heading variant="h2">{property.title}</Heading>
		</MainLayout>
	);
}
