"use client";

import Link from "next/link";

import { PencilIcon } from "@heroicons/react/24/outline";
import { Button } from "@src/components/ui/button";
import { paths } from "@src/lib/paths";

import PropertyDeleteAction from "./property-delete-action";
import PropertyFeaturedAction from "./property-featured-action";

type Props = {
	propertyId: number;
	isFeatured: boolean;
};

export default function PropertySidebar({ propertyId, isFeatured }: Props) {
	return (
		<div className="flex flex-col gap-4">
			<Button className="w-full" variant="tertiary" size="lg" asChild>
				<Link href={paths.agent.properties.edit(propertyId)} className="w-full">
					<PencilIcon className="mr-2 h-4 w-4" />
					Editar propiedad
				</Link>
			</Button>

			<PropertyFeaturedAction propertyId={propertyId} isFeatured={isFeatured} />
			<PropertyDeleteAction propertyId={propertyId} />
		</div>
	);
}
