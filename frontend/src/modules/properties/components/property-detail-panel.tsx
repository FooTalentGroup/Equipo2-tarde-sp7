"use client";

import type { Property } from "../types";
import { Button } from "@src/components/ui/button";
import { ScrollArea } from "@src/components/ui/scroll-area";
import Link from "next/link";
import { DeletePropertyButton } from "./delete-property-button";

interface PropertyDetailPanelProps {
	property: Property;
}

export function PropertyDetailPanel({ property }: PropertyDetailPanelProps) {
	return (
		<div className="flex flex-col h-full">
			{/* Header */}
			<div className="border-b p-4 flex items-center justify-between gap-4">
				<div className="flex-1 min-w-0">
					<p className="text-sm text-muted-foreground mb-1">Propiedad</p>
					<h1 className="text-2xl font-bold truncate">{property.title}</h1>
				</div>
			</div>

			{/* Content */}
			<ScrollArea className="flex-1">
				<div className="p-6 space-y-6">
					{/* Image */}
					{property.imageUrl && (
						<div className="w-full h-64 rounded-lg overflow-hidden bg-muted">
							<img
								src={property.imageUrl}
								alt={property.title}
								className="w-full h-full object-cover"
							/>
						</div>
					)}

					{/* Basic Info */}
					<div className="grid grid-cols-2 gap-4">
						<div>
							<p className="text-sm font-medium mb-1">Precio</p>
							<p className="text-2xl font-bold text-primary">
								${property.price.toLocaleString()}
							</p>
						</div>
						<div>
							<p className="text-sm font-medium mb-1">Estado</p>
							<p className="text-sm text-muted-foreground capitalize">
								{property.status}
							</p>
						</div>
					</div>

					{/* Location */}
					<div>
						<p className="text-sm font-medium mb-1">Ubicación</p>
						<p className="text-sm text-muted-foreground">{property.location}</p>
					</div>

					{/* Property Details */}
					<div className="grid grid-cols-4 gap-4">
						<div>
							<p className="text-sm font-medium mb-1">Tipo</p>
							<p className="text-sm text-muted-foreground capitalize">
								{property.type}
							</p>
						</div>
						<div>
							<p className="text-sm font-medium mb-1">Habitaciones</p>
							<p className="text-sm text-muted-foreground">{property.bedrooms}</p>
						</div>
						<div>
							<p className="text-sm font-medium mb-1">Baños</p>
							<p className="text-sm text-muted-foreground">
								{property.bathrooms}
							</p>
						</div>
						<div>
							<p className="text-sm font-medium mb-1">Área (m²)</p>
							<p className="text-sm text-muted-foreground">{property.area}</p>
						</div>
					</div>

					{/* Description */}
					<div>
						<p className="text-sm font-medium mb-2">Descripción</p>
						<p className="text-sm text-muted-foreground whitespace-pre-wrap">
							{property.description}
						</p>
					</div>

					{/* Metadata */}
					<div className="border-t pt-4 space-y-2">
						<div>
							<p className="text-sm font-medium mb-1">ID</p>
							<p className="text-sm text-muted-foreground">{property.id}</p>
						</div>
						<div>
							<p className="text-sm font-medium mb-1">Creado</p>
							<p className="text-sm text-muted-foreground">
								{new Date(property.createdAt).toLocaleString("es-ES")}
							</p>
						</div>
						<div>
							<p className="text-sm font-medium mb-1">Última actualización</p>
							<p className="text-sm text-muted-foreground">
								{new Date(property.updatedAt).toLocaleString("es-ES")}
							</p>
						</div>
					</div>
				</div>
			</ScrollArea>

			{/* Footer Actions */}
			<div className="border-t p-4 flex items-center justify-between">
				<Button asChild variant="default">
					<Link href={`/admin/properties/${property.id}/edit`}>Editar</Link>
				</Button>
				<DeletePropertyButton
					propertyId={property.id}
					propertyName={property.title}
				/>
			</div>
		</div>
	);
}
