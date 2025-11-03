"use client";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@src/components/ui/card";
import type { Property } from "../types";

interface PropertyDetailProps {
	property: Property;
}

export function PropertyDetail({ property }: PropertyDetailProps) {
	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-3xl">{property.title}</CardTitle>
				<CardDescription>
					<div className="flex flex-col gap-1 mt-2">
						<span className="text-xl font-semibold text-primary">
							${property.price.toLocaleString()}
						</span>
						<span>{property.location}</span>
						<span className="text-xs">
							Creado el{" "}
							{new Date(property.createdAt).toLocaleDateString("es-ES")}
						</span>
					</div>
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="space-y-4">
					<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
						<div>
							<h4 className="font-semibold">Tipo</h4>
							<p className="text-muted-foreground capitalize">{property.type}</p>
						</div>
						<div>
							<h4 className="font-semibold">Habitaciones</h4>
							<p className="text-muted-foreground">{property.bedrooms}</p>
						</div>
						<div>
							<h4 className="font-semibold">Baños</h4>
							<p className="text-muted-foreground">{property.bathrooms}</p>
						</div>
						<div>
							<h4 className="font-semibold">Área</h4>
							<p className="text-muted-foreground">{property.area} m²</p>
						</div>
					</div>
					<div>
						<h3 className="font-semibold text-lg mb-2">Descripción</h3>
						<p className="text-muted-foreground whitespace-pre-wrap">
							{property.description}
						</p>
					</div>
					<div>
						<h4 className="font-semibold">Estado</h4>
						<p className="text-muted-foreground capitalize">{property.status}</p>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
