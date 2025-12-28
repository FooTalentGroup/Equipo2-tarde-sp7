import MainLayout from "@src/components/layouts/main-layout";
import { Heading } from "@src/components/ui/heading";
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@src/components/ui/tabs";
import { paths } from "@src/lib/paths";
import PropertyCard from "@src/modules/properties/components/property-list/property-card";
import { getProperties } from "@src/modules/properties/services/property-service";

export default async function PropertiesList() {
	const { properties } = await getProperties({ featured_web: true });

	const salesProperties = properties.filter(
		(property) => property?.main_price?.operation_type?.id === 1 || 0,
	);
	const rentProperties = properties.filter(
		(property) => property?.main_price?.operation_type?.id === 2 || 0,
	);

	return (
		<MainLayout size="lg" className="py-10 lg:py-20 grid gap-8">
			<Heading variant="h3" className="text-center">
				Propiedades disponibles
			</Heading>

			<Tabs defaultValue="sales" className="grid gap-8">
				<TabsList
					variant="underline"
					className="justify-center mx-auto w-[336px] gap-0"
					size="lg"
				>
					<TabsTrigger
						variant="underline"
						value="sales"
						size="lg"
						className="font-medium"
						suppressHydrationWarning
					>
						Ventas
					</TabsTrigger>
					<TabsTrigger
						variant="underline"
						value="rent"
						size="lg"
						className="font-medium"
						suppressHydrationWarning
					>
						Alquiler
					</TabsTrigger>
				</TabsList>
				<TabsContent value="sales" suppressHydrationWarning>
					{salesProperties.length > 0 ? (
						<section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
							{salesProperties.map((property) => (
								<PropertyCard
									key={property.id}
									property={property}
									layout="public"
									href={paths.public.property(property.id.toString())}
								/>
							))}
						</section>
					) : (
						<div className="flex h-40 w-full items-center justify-center">
							<p className="text-muted-foreground">
								No se encontraron propiedades en venta
							</p>
						</div>
					)}
				</TabsContent>
				<TabsContent value="rent" suppressHydrationWarning>
					{rentProperties.length > 0 ? (
						<section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
							{rentProperties.map((property) => (
								<PropertyCard
									key={property.id}
									property={property}
									layout="public"
									href={paths.public.property(property.id.toString())}
								/>
							))}
						</section>
					) : (
						<div className="flex h-40 w-full items-center justify-center">
							<p className="text-muted-foreground">
								No se encontraron propiedades en alquiler
							</p>
						</div>
					)}
				</TabsContent>
			</Tabs>
		</MainLayout>
	);
}
