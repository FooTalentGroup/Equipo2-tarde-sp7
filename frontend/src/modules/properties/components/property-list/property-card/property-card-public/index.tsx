import Image from "next/image";
import Link from "next/link";

import { Badge } from "@src/components/ui/badge";
import { Card, CardContent } from "@src/components/ui/card";
import { paths } from "@src/lib/paths";
import { OperationTypeLabel, type Property } from "@src/types/property";
import { Bath, Bed, MapPin, Square } from "lucide-react";

type Props = {
	property: Property;
	href?: string;
};

export default function PropertyCardPublic({ property, href }: Props) {
	const price = property.main_price;
	const operationTypeId = property.main_price.operation_type.id;

	return (
		<Card className="py-0 group flex flex-col gap-0 relative overflow-hidden">
			<figure className="w-full aspect-video h-[250px] relative">
				<Image
					fill
					src={
						property.primary_image?.file_path ||
						"https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80"
					}
					alt={property.title}
					className="object-cover"
				/>
				<div className="absolute top-4 left-4 z-10">
					<Badge variant="white" className="">
						{OperationTypeLabel[operationTypeId] || "Venta"}
					</Badge>
				</div>
			</figure>
			<CardContent className="flex flex-col justify-between p-4 gap-4 bg-card">
				<div className="flex justify-between items-start gap-2">
					<div className="flex items-center gap-1.5 text-muted-foreground">
						<MapPin className="size-4" />
						<p className="text-sm font-medium">
							{property.main_address.city.name}
						</p>
					</div>
					<p className="font-semibold text-sm text-foreground tracking-tight">
						{price?.currency?.symbol || "USD"}{" "}
						{Number(price?.price || 0).toLocaleString()}
					</p>
				</div>

				<h3 className="text-lg font-medium text-heading line-clamp-1">
					<Link
						href={
							href ||
							paths.agent.properties.detail(
								property.slug || property.id.toString(),
							)
						}
						className="outline-none after:content-[''] after:absolute after:inset-0"
					>
						{property.title}
					</Link>
				</h3>

				<div className="flex items-center gap-4 ">
					<div className="flex items-center gap-2">
						<Bed className="size-5 stroke-[1.5]" />
						<span className="text-sm font-medium">
							{property.bedrooms_count}
						</span>
					</div>
					<div className="flex items-center gap-2">
						<Bath className="size-5 stroke-[1.5]" />
						<span className="text-sm font-medium">
							{property.bathrooms_count}
						</span>
					</div>
					<div className="flex items-center gap-2">
						<Square className="size-5 stroke-[1.5]" />
						<span className="text-sm font-medium">
							{property.total_area || 0}m²
						</span>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
