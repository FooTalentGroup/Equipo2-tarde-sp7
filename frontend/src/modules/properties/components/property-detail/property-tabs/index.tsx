"use client";

import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@src/components/ui/tabs";
import type { PropertyDetail } from "@src/types/property-detail";

import PropertyDocuments from "./property-documents";
import PropertyInfo from "./property-info";
import PropertyMultimedia from "./property-multimedia";

type Props = {
	property: PropertyDetail;
};

export default function PropertyTabs({ property }: Props) {
	return (
		<Tabs defaultValue="details" className="w-full grid gap-8">
			<TabsList className="w-full justify-start" size="lg" variant="blue">
				<TabsTrigger value="details" variant="blue" size="lg">
					DETALLES
				</TabsTrigger>
				<TabsTrigger value="multimedia" variant="blue" size="lg">
					MULTIMEDIA
				</TabsTrigger>
				<TabsTrigger value="documents" variant="blue" size="lg">
					DOCUMENTACIÓN
				</TabsTrigger>
			</TabsList>
			<TabsContent value="details" className="px-4 grid gap-8">
				<PropertyInfo property={property} />
			</TabsContent>
			<TabsContent value="multimedia" className="px-4">
				<PropertyMultimedia property={property} />
			</TabsContent>
			<TabsContent value="documents" className="px-4">
				<PropertyDocuments property={property} />
			</TabsContent>
		</Tabs>
	);
}
