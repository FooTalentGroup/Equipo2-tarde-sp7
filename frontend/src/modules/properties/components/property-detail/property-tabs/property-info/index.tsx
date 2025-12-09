import {
	CheckCircleIcon,
	HomeIcon,
	MapPinIcon,
	Square2StackIcon,
	TagIcon,
} from "@heroicons/react/24/outline";
import { Card, CardContent } from "@src/components/ui/card";
import { Heading } from "@src/components/ui/heading";
import type { PropertyDetail } from "@src/types/property-detail";

import PropertyValueCard from "./property-value-card";
import { Section } from "./section";

type Props = {
	property: PropertyDetail;
};

export default function PropertyInfo({ property }: Props) {
	if (!property) {
		return (
			<div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-16 text-center bg-card">
				<div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted text-muted-foreground">
					<HomeIcon className="h-8 w-8" />
				</div>
				<h3 className="mb-1 text-lg font-medium text-foreground">
					Sin información de la propiedad
				</h3>
				<p className="text-sm text-muted-foreground max-w-sm">
					No se ha podido cargar la información detallada de esta propiedad.
				</p>
			</div>
		);
	}

	const address = property.addresses[0];

	return (
		<>
			<section className="grid grid-cols-1 md:grid-cols-[1fr_0.6fr] gap-4">
				<Card>
					<CardContent className="grid grid-cols-1 flex-col gap-6 md:grid-cols-2 gap-y-8 gap-x-">
						<div className="flex items-start gap-3">
							<MapPinIcon className="h-6 w-6 text-tertiary" />
							<div>
								<p className="text-sm ">Dirección</p>
								<Heading variant="subtitle4" weight="medium">
									{address?.full_address || "-"}
								</Heading>
							</div>
						</div>
						<div className="flex items-start gap-3">
							<MapPinIcon className="h-6 w-6 text-tertiary" />
							<div>
								<p className="text-sm ">Barrio</p>
								<Heading variant="subtitle4" weight="medium">
									{address?.neighborhood || address?.city?.name || "-"}
								</Heading>
							</div>
						</div>
						<div className="flex items-start gap-3">
							<TagIcon className="h-6 w-6 text-tertiary" />
							<div>
								<p className="text-sm ">Tipo de operación</p>
								<Heading variant="subtitle4" weight="medium">
									{property.prices
										.map((p) => p.operation_type.name)
										.join(", ") || "-"}
								</Heading>
							</div>
						</div>
						<div className="flex items-start gap-3">
							<HomeIcon className="h-6 w-6 text-tertiary" />
							<div>
								<p className="text-sm ">Tipo de propiedad</p>
								<Heading variant="subtitle4" weight="medium">
									{property.property_type.name}
								</Heading>
							</div>
						</div>
						<div className="flex items-start gap-3">
							<HomeIcon className="h-6 w-6 text-tertiary" />
							<div>
								<p className="text-sm ">Ambientes</p>
								<Heading variant="subtitle4" weight="medium">
									{property.rooms_count} ambientes ({property.bedrooms_count}{" "}
									dormitorios)
								</Heading>
							</div>
						</div>
						<div className="flex items-start gap-3">
							<Square2StackIcon className="h-6 w-6 text-tertiary" />
							<div>
								<p className="text-sm ">Superficie total</p>
								<Heading variant="subtitle4" weight="medium">
									{property.total_area} m²
								</Heading>
							</div>
						</div>
						<div className="flex items-start gap-3">
							<Square2StackIcon className="h-6 w-6 text-tertiary" />
							<div>
								<p className="text-sm ">Superficie cubierta</p>
								<Heading variant="subtitle4" weight="medium">
									{property.covered_area} m²
								</Heading>
							</div>
						</div>
						<div></div>
						<div className="flex items-start gap-3">
							<CheckCircleIcon className="h-6 w-6 text-tertiary" />
							<div>
								<p className="text-sm ">Estado</p>
								<p className="font-medium text-green-500">
									{property.property_status.name}
								</p>
							</div>
						</div>
					</CardContent>
				</Card>
				<PropertyValueCard prices={property.prices} className="lg:col-span-1" />
			</section>
			<section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
				<div className="lg:col-span-3 grid gap-4">
					<Section title="Información básica">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2">
							<div className="space-y-2">
								<InfoRow label="Ambientes" value={property.rooms_count} />
								<InfoRow label="Dormitorios" value={property.bedrooms_count} />
								<InfoRow label="Baños" value={property.bathrooms_count} />
								<InfoRow label="Toilettes" value={property.toilets_count} />
								<InfoRow
									label="Cocheras"
									value={property.parking_spaces_count}
								/>
								<InfoRow label="Zonificación" value={property.zoning} />
							</div>
							<div className="space-y-2">
								<InfoRow label="Plantas" value={property.floors_count} />
								<InfoRow label="Antigüedad" value={property.age?.name} />
								<InfoRow label="Situación" value={property.situation?.name} />
								<InfoRow
									label="Expensas"
									value={
										property.expenses?.[0]
											? `${property.expenses[0].currency.symbol} ${property.expenses[0].amount}`
											: "--"
									}
								/>
								<InfoRow
									label="Orientación"
									value={property.orientation?.name}
								/>
								<InfoRow
									label="Disposición"
									value={property.disposition?.name}
								/>
							</div>
						</div>
					</Section>

					<Section title="Superficies">
						<div className="grid grid-cols-2 md:grid-cols-2 gap-y-6 gap-x-12">
							<SurfaceItem label="Terreno" value={property.land_area} />
							<SurfaceItem
								label="Semicubierta"
								value={property.semi_covered_area}
							/>
							<SurfaceItem label="Cubierta" value={property.covered_area} />
							<SurfaceItem
								label="Total construido"
								value={property.total_built_area}
							/>
							<SurfaceItem
								label="Descubierta"
								value={property.uncovered_area}
							/>
							<SurfaceItem label="Total" value={property.total_area} />
						</div>
					</Section>

					<Section title="Servicios">
						{property.services && property.services.length > 0 ? (
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								{property.services.map((service) => (
									<div key={service.id} className="flex items-center gap-2">
										<span className="text-foreground">{service.name}</span>
									</div>
								))}
							</div>
						) : (
							<p className="text-muted-foreground">
								No hay servicios registrados.
							</p>
						)}
					</Section>

					<Section title="Descripción">
						<div className="rounded-md border p-4 bg-white min-h-[100px]">
							<p className="text-muted-foreground whitespace-pre-wrap">
								{property.description || "Sin descripción."}
							</p>
						</div>
					</Section>
				</div>
				{/* <div className="space-y-6">
					<OwnerCard owner={property.owner} />
					<RelatedInquiriesCard />
					<RecentActivityCard />
				</div> */}
			</section>
		</>
	);
}

function InfoRow({
	label,
	value,
}: {
	label: string;
	value: string | number | null | undefined;
}) {
	return (
		<div className="flex justify-between items-center py-1">
			<span className="text-foreground font-medium">{label}:</span>
			<span className="text-muted-foreground">{value || "--"}</span>
		</div>
	);
}

function SurfaceItem({
	label,
	value,
}: {
	label: string;
	value: string | number | null | undefined;
}) {
	return (
		<div>
			<p className="text-heading font-medium">{label}</p>
			<p className="text-heading font-bold text-lg">{value || "--"}</p>
		</div>
	);
}
