"use client";

import { PencilIcon } from "@heroicons/react/24/outline";
import { Button } from "@src/components/ui/button";
import { Label } from "@src/components/ui/label";
import { Switch } from "@src/components/ui/switch";

import PropertyDeleteAction from "./property-delete-action";

type Props = {
	propertyId: number;
	isFeatured: boolean;
	onEdit: () => void;
	onPublish: () => void;
	onToggleFeatured: (checked: boolean) => void;
};

export default function PropertySidebar({
	propertyId,
	isFeatured,
	onEdit,
	onPublish,
	onToggleFeatured,
}: Props) {
	return (
		<div className="flex flex-col gap-4">
			<Button onClick={onEdit} className="w-full" variant="tertiary" size="lg">
				<PencilIcon className="mr-2 h-4 w-4" />
				Editar propiedad
			</Button>
			<Button onClick={onPublish} variant="outline-blue" className="w-full">
				Publicar
			</Button>
			<Button asChild variant="outline-blue" className="w-full">
				<div>
					<Label htmlFor="featured-mode" className="text-sm font-medium">
						Destacar en la web
					</Label>
					<Switch
						id="featured-mode"
						checked={isFeatured}
						onCheckedChange={onToggleFeatured}
					/>
				</div>
			</Button>
			<PropertyDeleteAction propertyId={propertyId} />
		</div>
	);
}
