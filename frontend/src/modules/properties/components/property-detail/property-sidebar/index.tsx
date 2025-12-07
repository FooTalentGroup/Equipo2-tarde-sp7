"use client";

import { PencilIcon } from "@heroicons/react/24/outline";
import { Button } from "@src/components/ui/button";

import PropertyArchiveAction from "./property-archive-action";
import PropertyDeleteAction from "./property-delete-action";

type Props = {
	propertyId: number;
	isEnabled: boolean;
	onEdit: () => void;
};

export default function PropertySidebar({
	propertyId,
	isEnabled,
	onEdit,
}: Props) {
	return (
		<div className="flex flex-col gap-4">
			<Button onClick={onEdit} className="w-full" variant="tertiary" size="lg">
				<PencilIcon className="mr-2 h-4 w-4" />
				Editar propiedad
			</Button>
			<PropertyArchiveAction propertyId={propertyId} isEnabled={isEnabled} />
			<PropertyDeleteAction propertyId={propertyId} />
		</div>
	);
}
