"use client";

import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, AlertDescription, AlertTitle } from "@src/components/ui/alert";
import { Badge } from "@src/components/ui/badge";
import { Button } from "@src/components/ui/button";
import { Form } from "@src/components/ui/form";
import { Heading } from "@src/components/ui/heading";
import { Separator } from "@src/components/ui/separator";
import { Spinner } from "@src/components/ui/spinner";
import { paths } from "@src/lib/paths";
import {
	basicInfoPropertySchema,
	documentsPropertySchema,
	featuresPropertySchema,
	galleryPropertySchema,
	type Property,
	servicesPropertySchema,
	surfacesPropertySchema,
	valuesPropertySchema,
} from "@src/types/property";
import { defineStepper } from "@stepperize/react";
import { Info, InfoIcon } from "lucide-react";
import { type Resolver, useForm } from "react-hook-form";
import { toast } from "sonner";

import { createProperty } from "../../services/property-service";
import PropertyFeaturesForm from "./property-features-form";
import PropertyGalleryForm from "./property-gallery-form";
import PropertyBasicInfoForm from "./property-info-form";
import PropertyServicesForm from "./property-services-form";
import PropertySurfacesForm from "./property-surfaces-form";
import PropertyValuesForm from "./property-values-form";

type Props = {
	defaultValues?: Property;
};

const { useStepper, steps, utils } = defineStepper(
	{
		id: "info",
		title: "Información básica",
		schema: basicInfoPropertySchema,
	},
	{
		id: "features",
		title: "Característica de la propiedad",
		schema: featuresPropertySchema,
	},
	{
		id: "surfaces",
		title: "Superficies",
		schema: surfacesPropertySchema,
	},
	{
		id: "values",
		title: "Valores de la propiedad",
		schema: valuesPropertySchema,
	},
	{
		id: "services",
		title: "Servicios",
		schema: servicesPropertySchema,
	},
	{
		id: "gallery",
		title: "Galería",
		schema: galleryPropertySchema,
	},
	{
		id: "documents",
		title: "Documentación",
		schema: documentsPropertySchema,
	},
);

export default function CreatePropertyForm({ defaultValues }: Props) {
	const router = useRouter();

	const stepper = useStepper();
	const currentIndex = utils.getIndex(stepper.current.id);

	const form = useForm<Property>({
		// biome-ignore lint/suspicious/noTsIgnore: Resolver type complexity requires ts-ignore
		// @ts-ignore
		resolver: zodResolver(stepper.current.schema) as Resolver<Property>,
		defaultValues: {
			// Información de la propiedad
			title: defaultValues?.title || "",
			propertyType: defaultValues?.propertyType || "",
			address: defaultValues?.address || "",
			floor: defaultValues?.floor || "",
			city: defaultValues?.city || "",
			province: defaultValues?.province || "",
			postalCode: defaultValues?.postalCode || "",
			assignedOwner: defaultValues?.assignedOwner || "",
			// Características de la propiedad
			rooms: defaultValues?.rooms ?? 0,
			floors: defaultValues?.floors ?? 0,
			bedrooms: defaultValues?.bedrooms ?? 0,
			antiquity: defaultValues?.antiquity || "",
			bathrooms: defaultValues?.bathrooms ?? 0,
			situation: defaultValues?.situation || "",
			toilets: defaultValues?.toilets ?? 0,
			orientation: defaultValues?.orientation || "",
			garages: defaultValues?.garages ?? 0,
			disposition: defaultValues?.disposition || "",
			// Valores
			price: defaultValues?.price ?? 0,
			priceCurrency: defaultValues?.priceCurrency || "USD",
			expenses: defaultValues?.expenses ?? 0,
			expensesCurrency: defaultValues?.expensesCurrency || "USD",
			// Servicios
			services: defaultValues?.services || [],
			// Galería
			gallery: defaultValues?.gallery || [],
			// Documentación
			documents: defaultValues?.documents || [],
			// Estado de publicación
			isPublished: defaultValues?.isPublished ?? false,
		},
		mode: "all",
	});

	async function onSubmit(_data: Property) {
		if (stepper.isLast) {
			try {
				const allData = form.getValues();
				const formData = new FormData();

				// 1. Basic
				const basic = {
					title: allData.title,
					description: "", // Missing in form
					owner_id: Number.parseInt(allData.assignedOwner, 10) || 1,
					property_type: allData.propertyType,
					operation_type: "Venta", // Default
				};
				formData.append("basic", JSON.stringify(basic));

				// 2. Geography
				const geography = {
					country: "Argentina", // Default
					province: allData.province,
					city: allData.city,
				};
				formData.append("geography", JSON.stringify(geography));

				// 3. Address
				const address = {
					street: allData.address,
					number: "S/N", // Missing in form
					neighborhood: "", // Missing in form
					postal_code: allData.postalCode,
				};
				formData.append("address", JSON.stringify(address));

				// 4. Values
				const values = {
					prices: [
						{
							price: allData.price,
							currency_symbol: allData.priceCurrency,
						},
					],
				};
				formData.append("values", JSON.stringify(values));

				// 5. Characteristics
				const characteristics = {
					rooms_count: allData.rooms,
					bedrooms_count: allData.bedrooms,
					bathrooms_count: allData.bathrooms,
					garage: allData.garages > 0,
				};
				formData.append("characteristics", JSON.stringify(characteristics));

				// 6. Surface
				const surface = {
					land_area: allData.landArea,
					semi_covered_area: allData.semiCoveredArea,
					covered_area: allData.coveredArea,
				};
				formData.append("surface", JSON.stringify(surface));

				// 7. Services
				const services = {
					services: allData.services,
				};
				formData.append("services", JSON.stringify(services));

				// 8. Internal
				const internal = {
					branch_name: "Sucursal Centro",
					appraiser: "Juan Pérez",
				};
				formData.append("internal", JSON.stringify(internal));

				// Files
				if (allData.gallery && allData.gallery.length > 0) {
					allData.gallery.forEach((file) => {
						formData.append("images", file);
					});
				}

				const result = await createProperty(formData);

				if (result && "error" in result) {
					throw new Error(result.error);
				}

				toast.success("Propiedad guardada exitosamente");

				router.push(paths.agent.properties.index());
			} catch (error) {
				const errorMessage =
					error instanceof Error
						? error.message
						: "Error al guardar la propiedad";
				toast.error(errorMessage);
				console.error("Error al guardar propiedad:", error);
			}
		} else {
			stepper.next();
		}
	}

	return (
		<section className="grid lg:grid-cols-[1fr_auto_275px] xl:grid-cols-[1fr_auto_375px] gap-4">
			<div className="flex flex-col gap-8 ">
				<nav aria-label="Progress" className="w-full">
					<ol className="flex items-center justify-between w-full">
						{stepper.all.map((step, index, _array) => (
							<div key={step.id} className="flex items-center w-full">
								<li className="flex items-center ">
									<Button
										type="button"
										role="tab"
										variant={index <= currentIndex ? "default" : "outline"}
										aria-current={
											stepper.current.id === step.id ? "step" : undefined
										}
										aria-posinset={index + 1}
										aria-setsize={steps.length}
										aria-selected={stepper.current.id === step.id}
										className="flex size-10 items-center justify-center rounded-full"
										onClick={async () => {
											const valid = await form.trigger();
											if (!valid) return;

											if (index - currentIndex > 1) return;
											stepper.goTo(step.id);
										}}
									>
										{index + 1}
									</Button>
									<span className="text-sm font-medium">{step.title}</span>
								</li>
								{index < _array.length - 1 && (
									<Separator
										className={`flex-1 ${
											index < currentIndex ? "bg-primary" : "bg-muted"
										}`}
									/>
								)}
							</div>
						))}
					</ol>
				</nav>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
						{stepper.switch({
							info: ({ title }) => (
								<div className="grid gap-6">
									<Heading variant="subtitle2" weight="semibold">
										{title}
									</Heading>
									<PropertyBasicInfoForm form={form} />
								</div>
							),
							features: ({ title }) => (
								<div className="grid gap-6">
									<Heading variant="subtitle2" weight="semibold">
										{title}
									</Heading>
									<PropertyFeaturesForm form={form} />
								</div>
							),
							surfaces: ({ title }) => (
								<div className="grid gap-6">
									<Heading variant="subtitle2" weight="semibold">
										{title}
									</Heading>
									<PropertySurfacesForm form={form} />
								</div>
							),
							values: ({ title }) => (
								<div className="grid gap-6">
									<Heading variant="subtitle2" weight="semibold">
										{title}
									</Heading>
									<PropertyValuesForm form={form} />
								</div>
							),
							services: ({ title }) => (
								<div className="grid gap-6">
									<Heading variant="subtitle2" weight="semibold">
										{title}
									</Heading>
									<PropertyServicesForm form={form} />
								</div>
							),
							gallery: ({ title }) => (
								<div className="grid gap-6">
									<Heading variant="subtitle2" weight="semibold">
										{title}
									</Heading>
									<Badge
										variant="outline"
										size="lg"
										className="text-wrap! grid gap-3 grid-cols-[auto_1fr] h-auto"
									>
										<InfoIcon className="w-4! h-4!" />
										La primera imagen en la galería sera usada como imágen
										principal y se mostrará en el portal
									</Badge>
									<PropertyGalleryForm form={form} />
								</div>
							),
						})}

						<div className="flex gap-4 justify-between mt-8">
							<Button
								type="button"
								size="lg"
								variant="outline"
								onClick={
									stepper.isFirst
										? () => router.push(paths.agent.properties.index())
										: stepper.prev
								}
								disabled={form.formState.isSubmitting}
							>
								{stepper.isFirst ? "Cancelar" : "Anterior"}
							</Button>

							<Button
								type="submit"
								size="lg"
								variant="tertiary"
								disabled={form.formState.isSubmitting}
							>
								{stepper.isLast ? (
									<>
										{form.formState.isSubmitting && <Spinner />}
										{form.formState.isSubmitting
											? "Guardando..."
											: "Guardar Propiedad"}
									</>
								) : (
									"Siguiente"
								)}
							</Button>
						</div>
					</form>
				</Form>
			</div>
			<Separator orientation="vertical" />
			<Alert className="h-fit grid grid-cols-[auto_1fr] gap-4">
				<div className="bg-secondary/20 p-2 w-9 text-secondary h-9 grid place-content-center rounded-md">
					<Info />
				</div>
				<div className="grid items-start h-fit w-full">
					<AlertTitle className="mb-2">Consejos</AlertTitle>
					<AlertDescription>
						Completa todos los campos para tener una publicación más efectiva
					</AlertDescription>
				</div>
			</Alert>
		</section>
	);
}
