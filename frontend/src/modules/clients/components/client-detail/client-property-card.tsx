"use client";

import Image from "next/image";
import Link from "next/link";

import { Button } from "@src/components/ui/button";
import { Card, CardContent } from "@src/components/ui/card";
import { ImagePlaceholder } from "@src/components/ui/image-placeholder";
import { paths } from "@src/lib/paths";

export interface ClientProperty {
	id: string | number;
	address: string;
	city: string;
	type: string;
	rooms: number;
	bathrooms: number;
	surface: number;
	image: string;
	status: string;
	age?: string;
	prices?: {
		rent: number;
		maintenance: number;
	};
}

interface ClientPropertyCardProps {
	property: ClientProperty;
}

export function ClientPropertyCard({ property }: ClientPropertyCardProps) {
	return (
		<Card
			key={property.id}
			className="hover:shadow-md transition-shadow overflow-visible"
		>
			<CardContent className="px-4 py-1 overflow-visible">
				<div className="flex gap-4 overflow-visible">
					{/* Imagen */}
					<div className="w-32 h-32 bg-slate-200 rounded-lg shrink-0 overflow-hidden relative">
						{property.image ? (
							<Image
								src={property.image}
								alt={property.address}
								fill
								className="object-cover"
							/>
						) : (
							<ImagePlaceholder className="h-full w-full bg-slate-100" />
						)}
					</div>

					{/* Información */}
					<div className="flex-1">
						<div className="flex items-start justify-between mb-2 lg:mb-6">
							<div>
								<h4 className="font-semibold text-slate-900 mb-1">
									{property.address}
								</h4>
								<div className="text-xs lg:text-sm text-slate-500">
									{property.city} · {property.type}
								</div>
							</div>
							<div className="flex-col items-center hidden lg:flex">
								<div className="text-xs text-slate-500">Antigüedad</div>
								<div className="text-lg font-bold text-slate-900">
									{property.age}
								</div>
							</div>
						</div>

						<div className="flex items-center justify-between">
							<div className="grid-cols-3 gap-4 mb-3 hidden lg:grid">
								<div>
									<div className="text-xs text-slate-500">Ambientes</div>
									<div className="text-sm font-medium text-slate-900">
										{property.rooms}
									</div>
								</div>
								<div>
									<div className="text-xs text-slate-500">Baños</div>
									<div className="text-sm font-medium text-slate-900">
										{property.bathrooms}
									</div>
								</div>
								<div>
									<div className="text-xs text-slate-500">Superficie</div>
									<div className="text-sm font-medium text-slate-900">
										{property.surface} m²
									</div>
								</div>
							</div>

							<Button variant="outline" size="sm" asChild>
								<Link href={paths.agent.properties.detail(String(property.id))}>
									Ver Detalles
								</Link>
							</Button>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
