import type { ReactNode } from "react";

import Link from "next/link";
import { notFound } from "next/navigation";

import {
	HomeIcon,
	MapPinIcon,
	Square2StackIcon,
	TagIcon,
} from "@heroicons/react/24/outline";
import MainLayout from "@src/components/layouts/main-layout";
import { Button } from "@src/components/ui/button";
import { Heading } from "@src/components/ui/heading";
import { paths } from "@src/lib/paths";
import { cn } from "@src/lib/utils";
import { getPropertyById } from "@src/modules/properties/services/property-service";
import { ArrowLeft, MapPin } from "lucide-react";

import PropertyContactForm from "./_components/property-contact-form";
import PropertyGallery from "./_components/property-gallery";

type Props = {
	params: Promise<{
		id: string;
	}>;
};

export default async function PropertyDetailPage({ params }: Props) {
	const { id } = await params;
	const propertyId = Number.parseInt(id, 10);

	if (Number.isNaN(propertyId)) {
		notFound();
	}

	const data = await getPropertyById(propertyId);

	if (!data) {
		notFound();
	}

	const { property } = data;

	return (
		<MainLayout as="section" size="lg" className="py-20 flex flex-col gap-8">
			<Button variant="text" asChild className="mr-auto">
				<Link href={paths.public.landing()}>
					<ArrowLeft />
					Volver atrás
				</Link>
			</Button>
			<div className="flex justify-between gap-5">
				<div className="flex flex-col gap-2.5">
					<Heading variant="subtitle1" weight="semibold">
						{property.title}
					</Heading>
					<div className="flex items-center gap-1.5 text-muted-foreground">
						<MapPin className="size-5" />
						<p className="text-base font-medium">
							{property.addresses[0].city.name}
						</p>
					</div>
				</div>

				<Heading
					variant="subtitle1"
					className=" tracking-tight"
					weight="semibold"
				>
					{property.expenses[0].currency?.symbol || "USD"}{" "}
					{property.expenses[0].amount}
				</Heading>
			</div>
			<PropertyGallery images={property.images} />
			<div className="grid gap-3 grid-cols-[1fr_460px]">
				<div className="flex flex-col gap-8">
					<Section title="Descripción">
						<p className="text-muted-foreground whitespace-pre-wrap">
							{property.description || "Sin descripción."}
						</p>
					</Section>
					<Section title="Detalles de la propiedad">
						<div className="grid grid-cols-1 flex-col gap-6 md:grid-cols-2 gap-y-8 gap-x-">
							<div className="flex items-start gap-3">
								<MapPinIcon className="h-6 w-6 text-tertiary" />
								<div>
									<p className="text-sm ">Dirección</p>
									<Heading variant="subtitle4" weight="medium">
										{property.addresses[0].full_address || "-"}
									</Heading>
								</div>
							</div>
							<div className="flex items-start gap-3">
								<MapPinIcon className="h-6 w-6 text-tertiary" />
								<div>
									<p className="text-sm ">Barrio</p>
									<Heading variant="subtitle4" weight="medium">
										{property.addresses[0].neighborhood ||
											property.addresses[0].city?.name ||
											"-"}
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
						</div>
					</Section>
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
						<div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2">
							<InfoRow label="Terreno" value={property.land_area} />
							<InfoRow
								label="Semicubierta"
								value={property.semi_covered_area}
							/>
							<InfoRow label="Cubierta" value={property.covered_area} />
							<InfoRow
								label="Total construido"
								value={property.total_built_area}
							/>
							<InfoRow label="Descubierta" value={property.uncovered_area} />
							<InfoRow label="Total" value={property.total_area} />
						</div>
					</Section>
					<Section title="Servicios">
						{property.services && property.services.length > 0 ? (
							<div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2">
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
				</div>
				<div>
					<PropertyContactForm propertyId={property.id} />
				</div>
			</div>
		</MainLayout>
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
		<div className="flex gap-2 items-center py-1">
			<span className="text-foreground">{label}:</span>
			<span className="text-muted-foreground font-semibold">
				{value || "--"}
			</span>
		</div>
	);
}

function Section({
	title,
	children,
	className,
}: {
	title: string;
	children: ReactNode;
	className?: string;
}) {
	return (
		<div className={cn("flex flex-col gap-5", className)}>
			<Heading variant="subtitle1" weight="semibold">
				{title}
			</Heading>
			{children}
		</div>
	);
}
