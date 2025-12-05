"use client";

import type { PropertyDetail } from "@src/types/property-detail";

import PropertyGallery from "./property-gallery";
import PropertySidebar from "./property-sidebar";
import PropertyTabs from "./property-tabs";

type Props = {
	property: PropertyDetail;
};

export default function PropertyDetailView({ property }: Props) {
	return (
		<div className="grid gap-5">
			<div className="grid grid-cols-1 gap-20 lg:grid-cols-4">
				<div className="lg:col-span-3">
					<PropertyGallery images={property.images} />
				</div>
				<div className="lg:col-span-1">
					<PropertySidebar
						propertyId={property.id}
						isFeatured={property.featured_web}
						onEdit={() => console.log("Edit")}
						onPublish={() => console.log("Publish")}
						onToggleFeatured={(checked) =>
							console.log("Toggle featured", checked)
						}
					/>
				</div>
			</div>

			<PropertyTabs property={property} />
		</div>
	);
}
