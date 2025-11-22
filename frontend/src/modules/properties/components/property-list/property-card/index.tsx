import Image from "next/image";

import { AspectRatio } from "@src/components/ui/aspect-ratio";
import { Badge } from "@src/components/ui/badge";
import { Card, CardContent } from "@src/components/ui/card";
import { Separator } from "@src/components/ui/separator";
import type { Property } from "@src/types/property";

type PropertyCardProps = {
	property: Property;
};

export default function PropertyCard({ property }: PropertyCardProps) {
	return (
		<Card className="py-0 grid gap-0">
			<AspectRatio ratio={16 / 9} className="bg-muted rounded-t-lg w-full">
				<Image
					src={
						property.imageUrl ||
						"https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80"
					}
					alt={property.title}
					fill
					className="h-full w-full rounded-t-lg object-cover"
				/>
			</AspectRatio>
			<CardContent className="py-4 grid gap-3">
				<div className="grid gap-5">
					<p className="font-medium text-heading">{property.address}</p>
					<p className="text-base text-muted-foreground">{property.city}</p>
					<div className="flex gap-2">
						<Badge variant="outline">{property.beds} hab</Badge>
						<Badge variant="outline">{property.baths} baños</Badge>
					</div>
				</div>
				<Separator />
				<div className="flex gap-3 justify-between items-center">
					<p className="font-semibold text-lg text-heading">
						USD {property.price.toLocaleString()}
					</p>
					<Badge variant="destructive">Disponible</Badge>
				</div>
			</CardContent>
		</Card>
	);
}
