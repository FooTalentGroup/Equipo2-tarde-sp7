"use client";

import { useState } from "react";

import Link from "next/link";

import type { PropertyCreateInput } from "@src/modules/properties/types";
import { Button } from "@src/components/ui/button";
import { createPropertyAction } from "@src/modules/properties/actions/create-property-action";
import { PropertyForm } from "@src/modules/properties/components/property-form";

export default function NewPropertyPage() {
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSubmit = async (data: PropertyCreateInput) => {
		setIsSubmitting(true);
		try {
			const result = await createPropertyAction(data);

			if (result && !result.ok) {
				alert(`Error: ${result.error}`);
				setIsSubmitting(false);
			}
			// Si no hay error, el redirect se maneja en la action
		} catch (error) {
			alert("Ocurrió un error al crear la propiedad");
			setIsSubmitting(false);
		}
	};

	return (
		<div className="container mx-auto px-4 py-8 max-w-2xl">
			<div className="mb-8">
				<Button variant="ghost" asChild className="mb-4">
					<Link href="/properties">← Volver a propiedades</Link>
				</Button>
				<h1 className="text-4xl font-bold mb-2">Nueva Propiedad</h1>
				<p className="text-muted-foreground">
					Crea una nueva propiedad en el sistema
				</p>
			</div>

			<PropertyForm onSubmit={handleSubmit} isLoading={isSubmitting} />
		</div>
	);
}
