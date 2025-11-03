"use client";

import Link from "next/link";
import { Button } from "@src/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@src/components/ui/card";
import type { Property } from "../types";

interface PropertyCardProps {
	property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
	return (
		<Card className="h-full flex flex-col">
			<CardHeader>
				<CardTitle>{property.title}</CardTitle>
				<CardDescription>{property.location}</CardDescription>
			</CardHeader>
			<CardContent className="flex-1">
				<div className="space-y-2">
					<p className="text-2xl font-bold text-primary">
						${property.price.toLocaleString()}
					</p>
					<p className="text-sm text-muted-foreground line-clamp-2">
						{property.description}
					</p>
					<div className="flex gap-4 text-sm text-muted-foreground">
						<span>{property.bedrooms} bed</span>
						<span>{property.bathrooms} bath</span>
						<span>{property.area} m²</span>
					</div>
				</div>
			</CardContent>
			<CardFooter className="flex gap-2">
				<Button asChild variant="default" size="sm">
					<Link href={`/properties/${property.id}`}>Ver Detalles</Link>
				</Button>
				<Button asChild variant="outline" size="sm">
					<Link href={`/properties/${property.id}/edit`}>Editar</Link>
				</Button>
			</CardFooter>
		</Card>
	);
}
