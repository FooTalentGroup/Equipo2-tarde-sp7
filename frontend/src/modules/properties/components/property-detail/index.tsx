"use client";

import Image from "next/image";

import { ImagePlaceholder } from "@src/components/ui/image-placeholder";
import type { PropertyDetail } from "@src/types/property-detail";

import PropertySidebar from "./property-sidebar";
import PropertyTabs from "./property-tabs";

type Props = {
	property: PropertyDetail;
};

export default function PropertyDetailView({ property }: Props) {
	return (
		<div className="grid gap-5">
			<div className="grid grid-cols-1 gap-10 lg:grid-cols-4">
				<div className="lg:col-span-3">
					<figure className="border-0 shadow-none flex items-center justify-center p-0 relative overflow-hidden rounded-lg aspect-video h-[295px] xl:h-[400px] w-full">
						{property.images?.[0]?.file_path ? (
							<Image
								src={property.images[0].file_path}
								alt={property.title}
								fill
								className="object-cover w-full h-full"
								priority={true}
							/>
						) : (
							<ImagePlaceholder className="h-full w-full" />
						)}
					</figure>
				</div>
				<div className="lg:col-span-1">
					<PropertySidebar
						propertyId={property.id}
						isEnabled={property.featured_web}
					/>
				</div>
			</div>

			<PropertyTabs property={property} />
		</div>
	);
}
