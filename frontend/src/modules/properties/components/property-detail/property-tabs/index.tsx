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
		<Tabs defaultValue="details" className="w-full grid gap-4">
			<TabsList className="w-full justify-start">
				<TabsTrigger value="details">Detalles</TabsTrigger>
				<TabsTrigger value="multimedia">Multimedia</TabsTrigger>
				<TabsTrigger value="documents">Documentación</TabsTrigger>
			</TabsList>
			<TabsContent value="details" className=" grid gap-4">
				<PropertyInfo property={property} />
			</TabsContent>
			<TabsContent value="multimedia" className="lg:px-4">
				<PropertyMultimedia property={property} />
			</TabsContent>
			<TabsContent value="documents" className="lg:px-4">
				<PropertyDocuments property={property} />
			</TabsContent>
		</Tabs>
	);
}
