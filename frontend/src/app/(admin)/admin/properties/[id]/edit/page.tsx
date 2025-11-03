"use client";

import type { PropertyCreateInput, Property } from "@src/modules/properties/types";
import { Button } from "@src/components/ui/button";
import { getPropertyAction } from "@src/modules/properties/actions/get-property-action";
import { updatePropertyAction } from "@src/modules/properties/actions/update-property-action";
import { PropertyForm } from "@src/modules/properties/components/property-form";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditPropertyPage() {
	const [isLoading, setIsLoading] = useState(true);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [propertyData, setPropertyData] = useState<PropertyCreateInput | null>(
		null,
	);
	const [error, setError] = useState<string | null>(null);

	const router = useRouter();
	const params = useParams();
	const id = params.id as string;

	useEffect(() => {
		const loadProperty = async () => {
			const result = await getPropertyAction(id);

			if (!result.ok) {
				setError(result.error);
				setIsLoading(false);
				return;
			}

			setPropertyData({
				title: result.data.title,
				description: result.data.description,
				price: result.data.price,
				location: result.data.location,
				bedrooms: result.data.bedrooms,
				bathrooms: result.data.bathrooms,
				area: result.data.area,
				type: result.data.type,
				status: result.data.status,
				imageUrl: result.data.imageUrl,
			});
			setIsLoading(false);
		};

		loadProperty();
	}, [id]);

	const handleSubmit = async (data: PropertyCreateInput) => {
		setIsSubmitting(true);
		try {
			const result = await updatePropertyAction(id, data);

			if (!result.ok) {
				alert(`Error: ${result.error}`);
				setIsSubmitting(false);
			} else {
				router.push(`/admin/properties/${id}`);
			}
		} catch (error) {
			alert("Ocurrió un error al actualizar la propiedad");
			setIsSubmitting(false);
		}
	};

	if (isLoading) {
		return (
			<div className="container mx-auto px-4 py-8 max-w-2xl">
				<p className="text-center">Cargando...</p>
			</div>
		);
	}

	if (error) {
		return (
			<div className="container mx-auto px-4 py-8 max-w-2xl">
				<div className="text-center">
					<h1 className="text-2xl font-bold text-red-600">Error</h1>
					<p className="text-muted-foreground mt-2">{error}</p>
					<Button asChild className="mt-4">
						<Link href="/properties">Volver a propiedades</Link>
					</Button>
				</div>
			</div>
		);
	}

	return (
		<div className="container mx-auto px-4 py-8 max-w-2xl">
			<div className="mb-8">
				<Button variant="ghost" asChild className="mb-4">
					<Link href={`/properties/${id}`}>← Volver a detalles</Link>
				</Button>
				<h1 className="text-4xl font-bold mb-2">Editar Propiedad</h1>
				<p className="text-muted-foreground">
					Actualiza la información de la propiedad
				</p>
			</div>

			{propertyData && (
				<PropertyForm
					defaultValues={propertyData}
					onSubmit={handleSubmit}
					submitLabel="Actualizar Propiedad"
					isLoading={isSubmitting}
				/>
			)}
		</div>
	);
}
