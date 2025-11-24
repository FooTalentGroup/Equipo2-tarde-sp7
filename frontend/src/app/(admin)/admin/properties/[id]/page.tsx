import { notFound } from "next/navigation";

export default async function EditPropertyPage({
	params,
}: {
	params: Promise<{ id?: string }>;
}) {
	const resolved = await params;
	const id = resolved?.id;

	if (!id) return notFound();

	return (
		<div className="container mx-auto py-6">
			<div className="mb-6">
				<h1 className="text-2xl font-bold">Editar Propiedad</h1>
				<p className="text-muted-foreground">
					Modifica los datos de la propiedad #{id}
				</p>
			</div>

			{/* TODO: Add PropertyForm component here with propertyId={id} */}
			<div className="rounded-lg border bg-card p-6">
				<p className="text-sm text-muted-foreground">
					El formulario de propiedad se agregará aquí con los datos de la
					propiedad ID: {id}
				</p>
			</div>
		</div>
	);
}
