"use client";

import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@src/components/ui/tabs";
import type { PropertyDetail } from "@src/types/property-detail";

import PropertyInfo from "./property-info";

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
				<TabsTrigger value="archive" variant="blue" size="lg">
					ARCHIVO
				</TabsTrigger>
			</TabsList>
			<TabsContent value="details" className="px-8 grid gap-8">
				<PropertyInfo property={property} />
			</TabsContent>
			<TabsContent value="multimedia">
				<div className="p-6">Multimedia content here</div>
			</TabsContent>
			<TabsContent value="archive">
				<div className="p-6">Archive content here</div>
			</TabsContent>
		</Tabs>
	);
}
