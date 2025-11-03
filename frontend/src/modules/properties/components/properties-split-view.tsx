"use client";

import type { Property } from "../types";
import { useState } from "react";
import { Input } from "@src/components/ui/input";
import { ScrollArea } from "@src/components/ui/scroll-area";
import { SearchIcon } from "lucide-react";
import { cn } from "@src/lib/utils";
import { PropertyDetailPanel } from "./property-detail-panel";

interface PropertiesSplitViewProps {
	properties: Property[];
}

export function PropertiesSplitView({ properties }: PropertiesSplitViewProps) {
	const [selectedProperty, setSelectedProperty] = useState<Property | null>(
		properties[0] || null,
	);
	const [searchQuery, setSearchQuery] = useState("");

	const filteredProperties = properties.filter((property) =>
		property.title.toLowerCase().includes(searchQuery.toLowerCase()),
	);

	return (
		<div className="flex h-[calc(100vh-8rem)] gap-4">
			{/* Lista de propiedades */}
			<div className="w-96 flex flex-col border rounded-lg bg-card">
				<div className="p-4 border-b">
					<h2 className="text-lg font-semibold mb-3">Todas las propiedades</h2>
					<div className="relative">
						<SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
						<Input
							placeholder="Buscar en la lista"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="pl-8"
						/>
					</div>
				</div>

				<ScrollArea className="flex-1">
					<div className="p-2">
						{filteredProperties.map((property) => (
							<button
								key={property.id}
								type="button"
								onClick={() => setSelectedProperty(property)}
								className={cn(
									"w-full flex items-start gap-3 p-3 rounded-lg text-left transition-colors hover:bg-accent",
									selectedProperty?.id === property.id && "bg-accent",
								)}
							>
								<div className="w-16 h-16 rounded-md bg-muted flex-shrink-0 overflow-hidden">
									{property.imageUrl ? (
										<img
											src={property.imageUrl}
											alt={property.title}
											className="w-full h-full object-cover"
										/>
									) : (
										<div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200" />
									)}
								</div>
								<div className="flex-1 min-w-0">
									<h3 className="font-medium text-sm truncate">
										{property.title}
									</h3>
									<p className="text-xs text-muted-foreground truncate">
										<span className="capitalize">[{property.status}]</span>{" "}
										{property.location || "Sin ubicación"}
									</p>
									<p className="text-xs font-semibold text-primary">
										${property.price.toLocaleString()}
									</p>
								</div>
							</button>
						))}
					</div>
				</ScrollArea>
			</div>

			{/* Panel de detalles */}
			<div className="flex-1 border rounded-lg bg-card overflow-hidden">
				{selectedProperty ? (
					<PropertyDetailPanel property={selectedProperty} />
				) : (
					<div className="flex items-center justify-center h-full text-muted-foreground">
						Selecciona una propiedad para ver los detalles
					</div>
				)}
			</div>
		</div>
	);
}
