import Image from "next/image";
import Link from "next/link";

import { Badge } from "@src/components/ui/badge";
import { Card, CardContent } from "@src/components/ui/card";
import { Separator } from "@src/components/ui/separator";
import { paths } from "@src/lib/paths";
import { cn } from "@src/lib/utils";
import { OperationTypeLabel, type Property } from "@src/types/property";
import { Bath, Bed, MapPin, Square } from "lucide-react";

type Props = {
	property: Property;
	href?: string;
};

export default function PropertyCardDefault({ property, href }: Props) {
	const isAvailable = property.featured_web;
	const price = property.main_price;
	const operationTypeId = property?.main_price?.operation_type?.id || 0;

	return (
		<Card className="py-0 group flex gap-0 relative transition-[color,box-shadow] hover:outline-none focus-visible:border-ring focus-visible:ring-ring/50  focus-visible:ring-[3px]">
			<figure className="rounded-t-lg w-full h-[136px] relative aspect-video">
				<Image
					width={300}
					height={136}
					src={
						property.primary_image?.file_path ||
						"https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80"
					}
					alt={property.title}
					className=" w-full rounded-t-lg object-cover h-full"
				/>
				<div className="absolute top-3 left-3 flex gap-2">
					<Badge variant="secondary" className="bg-card text-secondary">
						{property.property_type.name}
					</Badge>
					<Badge
						variant="default"
						className="bg-primary text-primary-foreground"
					>
						{OperationTypeLabel[operationTypeId] || "Venta"}
					</Badge>
				</div>
			</figure>
			<CardContent className="py-4 flex flex-col gap-0 p-0">
				<div className="flex flex-col gap-4 p-4">
					<div className="h-[48px]">
						<h2 className={cn("text-base font-semibold line-clamp-2")}>
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
						</h2>
					</div>
					<div className="flex items-center gap-1">
						<MapPin className="size-4" />
						<p className="text-base text-muted-foreground">
							{property.main_address.city.name}
						</p>
					</div>
					<div className="flex items-center gap-4">
						<Badge variant="ghost" className="px-0 text-base gap-2 py-0">
							<Bed className="size-4!" />
							{property.rooms_count}
						</Badge>
						<Badge variant="ghost" className="px-0 text-base gap-2 py-0">
							<Bath className="size-4!" />
							{property.bathrooms_count}
						</Badge>
						<Badge variant="ghost" className="px-0 text-base gap-2 py-0">
							<Square className="size-4!" /> {property.total_area || 0}m²
						</Badge>
					</div>
				</div>
				<Separator />
				<div className="flex gap-3 justify-between items-center p-4">
					<p className="font-semibold text-base text-foreground">
						{price?.currency?.symbol || "USD"}
						{Number(price?.price || 0).toLocaleString()}
					</p>
					<Badge
						variant={isAvailable ? "success" : "outline"}
						className={cn(
							"gap-2.5 bg-transparent border-transparent h-7 text-sm",
							!isAvailable && "text-amber-600",
						)}
					>
						<div
							className={cn(
								"w-2 h-2 rounded-full",
								isAvailable ? "bg-success-foreground" : "bg-amber-600",
							)}
						></div>
						{isAvailable ? "Publicado" : "No publicado"}
					</Badge>
				</div>
			</CardContent>
		</Card>
	);
}
