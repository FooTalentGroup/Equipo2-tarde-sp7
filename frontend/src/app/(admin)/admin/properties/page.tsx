import Link from "next/link";
import { Button } from "@src/components/ui/button";
import { Plus } from "lucide-react";
import { getAllPropertiesAction } from "@src/modules/properties/actions/get-all-properties-action";
import { PropertiesSplitView } from "@src/modules/properties/components/properties-split-view";

export const metadata = {
	title: "Propiedades",
	description: "Gestión de propiedades inmobiliarias",
};

export default async function PropertiesPage() {
	const result = await getAllPropertiesAction();

	if (!result.ok) {
		return (
			<div className="flex items-center justify-center h-full">
				<div className="text-center">
					<h1 className="text-2xl font-bold text-red-600">Error</h1>
					<p className="text-muted-foreground mt-2">{result.error}</p>
				</div>
			</div>
		);
	}

	if (result.data.length === 0) {
		return (
			<div className="flex items-center justify-center h-full">
				<div className="text-center">
					<h2 className="text-2xl font-bold mb-2">No hay propiedades</h2>
					<p className="text-muted-foreground mb-4">
						Comienza creando tu primera propiedad
					</p>
					<Button asChild>
						<Link href="/admin/properties/new">
							<Plus className="h-4 w-4 mr-2" />
							Nueva Propiedad
						</Link>
					</Button>
				</div>
			</div>
		);
	}

	return <PropertiesSplitView properties={result.data} />;
}
