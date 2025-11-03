import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@src/components/ui/button";
import { getPropertyAction } from "@src/modules/properties/actions/get-property-action";
import { DeletePropertyButton } from "@src/modules/properties/components/delete-property-button";
import { PropertyDetail } from "@src/modules/properties/components/property-detail";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	const result = await getPropertyAction(id);

	if (!result.ok) {
		return {
			title: "Propiedad no encontrada",
		};
	}

	return {
		title: result.data.title,
		description: result.data.description,
	};
}

export default async function PropertyDetailPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	const result = await getPropertyAction(id);

	if (!result.ok) {
		if (result.error === "Property not found") {
			notFound();
		}

		return (
			<div className="container mx-auto px-4 py-8">
				<div className="text-center">
					<h1 className="text-2xl font-bold text-red-600">Error</h1>
					<p className="text-muted-foreground mt-2">{result.error}</p>
				</div>
			</div>
		);
	}

	return (
		<div className="container mx-auto px-4 py-8 max-w-4xl">
			<div className="mb-8">
				<Button variant="ghost" asChild className="mb-4">
					<Link href="/properties">← Volver a propiedades</Link>
				</Button>
			</div>

			<PropertyDetail property={result.data} />

			<div className="flex gap-4 mt-6">
				<Button asChild variant="default">
					<Link href={`/properties/${id}/edit`}>Editar</Link>
				</Button>
				<DeletePropertyButton propertyId={id} propertyName={result.data.title} />
			</div>
		</div>
	);
}
