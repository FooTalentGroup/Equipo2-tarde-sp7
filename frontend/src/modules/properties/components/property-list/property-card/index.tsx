import Image from "next/image";

import { AspectRatio } from "@src/components/ui/aspect-ratio";
import { Badge } from "@src/components/ui/badge";
import { Card, CardContent } from "@src/components/ui/card";
import { Separator } from "@src/components/ui/separator";
import type { PropertyData } from "@src/types/property";

type PropertyCardProps = {
	property: PropertyData;
};

export default function PropertyCard({ property }: PropertyCardProps) {
	return (
		<Card className="py-0 grid gap-0">
			<AspectRatio
				ratio={16 / 9}
				className="bg-muted rounded-t-lg w-full relative"
			>
				<Image
					src="https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80"
					alt={property.title}
					fill
					className="h-full w-full rounded-t-lg object-cover"
				/>
				<div className="absolute top-3 left-3 flex gap-2">
					<Badge variant="secondary" className="bg-white/90 text-secondary">
						{property.propertyType === "apartment"
							? "Departamento"
							: property.propertyType === "house"
								? "Casa"
								: property.propertyType === "ph"
									? "PH"
									: property.propertyType}
					</Badge>
					<Badge
						variant="default"
						className="bg-primary text-primary-foreground"
					>
						{property.status === "available"
							? "Venta"
							: property.status === "reserved"
								? "Reservado"
								: "Vendido"}
					</Badge>
				</div>
			</AspectRatio>
			<CardContent className="py-4 grid gap-3">
				<div className="grid gap-5">
					<p className="font-medium text-heading">{property.address}</p>
					<p className="text-base text-muted-foreground">{property.city}</p>
					<div className="flex gap-2">
						<Badge variant="outline">{property.rooms} amb</Badge>
						<Badge variant="outline">{property.bathrooms} baños</Badge>
						<Badge variant="outline">220m²</Badge>
					</div>
				</div>
				<Separator />
				<div className="flex gap-3 justify-between items-center">
					<p className="font-semibold text-lg text-heading">
						{property.currency.toUpperCase()} {property.price.toLocaleString()}
					</p>
					<Badge
						variant={
							property.status === "available" ? "destructive" : "secondary"
						}
					>
						{property.status === "available"
							? "Disponible"
							: property.status === "reserved"
								? "Reservado"
								: "Vendido"}
					</Badge>
				</div>
			</CardContent>
		</Card>
	);
}
