"use client";

import Link from "next/link";

import { PencilIcon } from "@heroicons/react/24/outline";
import { Button } from "@src/components/ui/button";
import { paths } from "@src/lib/paths";

import PropertyArchiveAction from "./property-archive-action";
import PropertyDeleteAction from "./property-delete-action";

type Props = {
	propertyId: number;
	isEnabled: boolean;
};

export default function PropertySidebar({ propertyId, isEnabled }: Props) {
	return (
		<div className="flex flex-col gap-4">
			<Button className="w-full" variant="tertiary" size="lg" asChild>
				<Link href={paths.agent.properties.edit(propertyId)} className="w-full">
					<PencilIcon className="mr-2 h-4 w-4" />
					Editar propiedad
				</Link>
			</Button>

			<PropertyArchiveAction propertyId={propertyId} isEnabled={isEnabled} />
			<PropertyDeleteAction propertyId={propertyId} />
		</div>
	);
}
