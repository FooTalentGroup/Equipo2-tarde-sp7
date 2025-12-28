"use client";

import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, AlertDescription, AlertTitle } from "@src/components/ui/alert";
import { Badge } from "@src/components/ui/badge";
import { Button } from "@src/components/ui/button";
import { Card, CardContent } from "@src/components/ui/card";
import { Form } from "@src/components/ui/form";
import { Heading } from "@src/components/ui/heading";
import { Separator } from "@src/components/ui/separator";
import { Spinner } from "@src/components/ui/spinner";
import { paths } from "@src/lib/paths";
import {
	addressSchema,
	basicSchema,
	characteristicsSchema,
	documentsSchema,
	geographySchema,
	imagesSchema,
	type PropertyForm,
	servicesSchema,
	surfaceSchema,
	VisibilityStatus,
	valuesSchema,
} from "@src/types/property";
import { defineStepper } from "@stepperize/react";
import { Check, Info, InfoIcon } from "lucide-react";
import { type Resolver, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import {
	createProperty,
	updateProperty,
} from "../../services/property-service";
import PropertyDocumentsForm from "./property-documents-form";
import PropertyFeaturesForm from "./property-features-form";
import PropertyGalleryForm from "./property-gallery-form";
import PropertyBasicInfoForm from "./property-info-form";
import PropertyServicesForm from "./property-services-form";
import PropertySurfacesForm from "./property-surfaces-form";
import PropertyValuesForm from "./property-values-form";

type Props = {
	defaultValues?: PropertyForm;
	propertyId?: number | string;
};

const { useStepper, steps, utils } = defineStepper(
	{
		id: "info",
		title: "Información básica",
		subtitle: "Datos",
		schema: z.object({
			basic: basicSchema,
			geography: geographySchema,
			address: addressSchema,
		}),
	},
	{
		id: "features",
		title: "Característica de la propiedad",
		subtitle: "Características",
		schema: z.object({ characteristics: characteristicsSchema }),
	},
	{
		id: "surfaces",
		title: "Superficies",
		subtitle: "Superficies",
		schema: z.object({ surface: surfaceSchema }),
	},
	{
		id: "values",
		title: "Valores de la propiedad",
		subtitle: "Valores",
		schema: z.object({ values: valuesSchema }),
	},
	{
		id: "services",
		title: "Servicios",
		subtitle: "Servicios",
		schema: z.object({ services: servicesSchema }),
	},
	{
		id: "gallery",
		title: "Galería",
		subtitle: "Galería",
		schema: z.object({ images: imagesSchema }),
	},
	{
		id: "documents",
		title: "Documentación",
		subtitle: "Docs",
		schema: z.object({ documents: documentsSchema }),
	},
);

export default function CreatePropertyForm({
	defaultValues,
	propertyId,
}: Props) {
	const router = useRouter();

	const stepper = useStepper();
	const currentIndex = utils.getIndex(stepper.current.id);

	const form = useForm<PropertyForm>({
		// biome-ignore lint/suspicious/noTsIgnore: Resolver type complexity requires ts-ignore
		// @ts-ignore
		resolver: zodResolver(stepper.current.schema) as Resolver<Property>,
		defaultValues: {
			basic: {
				title: defaultValues?.basic?.title || "",
				property_type: defaultValues?.basic?.property_type || "1",
				description: defaultValues?.basic?.description || "",
				property_status: defaultValues?.basic?.property_status || "Disponible",
				visibility_status:
					defaultValues?.basic?.visibility_status || VisibilityStatus.PUBLISHED,
				featured_web: defaultValues?.basic?.featured_web || false,
				publication_date: defaultValues?.basic?.publication_date || "",
				owner_id: defaultValues?.basic?.owner_id || "",
			},
			geography: {
				country: defaultValues?.geography?.country || "",
				province: defaultValues?.geography?.province || "",
				city: defaultValues?.geography?.city || "",
			},
			address: {
				street: defaultValues?.address?.street || "",
				number: defaultValues?.address?.number || "",
				postal_code: defaultValues?.address?.postal_code || "",
				neighborhood: defaultValues?.address?.neighborhood || "",
				latitude: defaultValues?.address?.latitude || 0,
				longitude: defaultValues?.address?.longitude || 0,
			},
			values: {
				prices: defaultValues?.values?.prices || [
					{
						price: 100,
						currency_symbol: "USD",
						operation_type: "Venta",
					},
				],
				expenses: defaultValues?.values?.expenses || [
					{
						amount: 100,
						currency_symbol: "ARS",
						frequency: "Mensual",
					},
				],
			},
			characteristics: {
				rooms_count: defaultValues?.characteristics?.rooms_count || 0,
				bedrooms_count: defaultValues?.characteristics?.bedrooms_count || 0,
				bathrooms_count: defaultValues?.characteristics?.bathrooms_count || 0,
				toilets_count: defaultValues?.characteristics?.toilets_count || 0,
				parking_spaces_count:
					defaultValues?.characteristics?.parking_spaces_count || 0,
				floors_count: defaultValues?.characteristics?.floors_count || 0,
				situation: defaultValues?.characteristics?.situation || "",
				age: defaultValues?.characteristics?.age || "",
				orientation: defaultValues?.characteristics?.orientation || "",
				disposition: defaultValues?.characteristics?.disposition || "",
				zoning: defaultValues?.characteristics?.zoning || "",
			},
			surface: {
				land_area: defaultValues?.surface?.land_area || 0,
				semi_covered_area: defaultValues?.surface?.semi_covered_area || 0,
				covered_area: defaultValues?.surface?.covered_area || 0,
				total_built_area: defaultValues?.surface?.total_built_area || 0,
				uncovered_area: defaultValues?.surface?.uncovered_area || 0,
				total_area: defaultValues?.surface?.total_area || 0,
				zoning: defaultValues?.surface?.zoning || "",
			},
			services: {
				services: defaultValues?.services?.services || [],
			},
			internal: {
				branch_name: defaultValues?.internal?.branch_name || "",
				appraiser: defaultValues?.internal?.appraiser || "",
				producer: defaultValues?.internal?.producer || "",
				maintenance_user: defaultValues?.internal?.maintenance_user || "",
				keys_location: defaultValues?.internal?.keys_location || "",
				internal_comments: defaultValues?.internal?.internal_comments || "",
				social_media_info: defaultValues?.internal?.social_media_info || "",
				operation_commission_percentage:
					defaultValues?.internal?.operation_commission_percentage || 0,
				producer_commission_percentage:
					defaultValues?.internal?.producer_commission_percentage || 0,
			},
			images: {
				gallery: defaultValues?.images?.gallery || [],
			},
			documents: {
				files: defaultValues?.documents?.files || [],
			},
		},
		mode: "all",
	});

	async function handleSave() {
		try {
			const allData = form.getValues();
			let result:
				| Awaited<ReturnType<typeof createProperty>>
				| Awaited<ReturnType<typeof updateProperty>>;

			if (propertyId) {
				result = await updateProperty(propertyId, allData);
			} else {
				result = await createProperty(allData);
			}

			if (result && typeof result === "object" && "error" in result) {
				throw new Error((result as { error: string }).error);
			}

			toast.success(
				propertyId
					? "Propiedad actualizada exitosamente"
					: "Propiedad guardada exitosamente",
			);

			router.push(paths.agent.properties.index());
		} catch (error) {
			const errorMessage =
				error instanceof Error
					? error.message
					: "Error al guardar la propiedad";
			toast.error(errorMessage);
			console.error("Error al guardar propiedad:", error);
		}
	}

	async function onSubmit(_data: PropertyForm) {
		if (stepper.isLast) {
			await handleSave();
		} else {
			stepper.next();
		}
	}

	return (
		<section className="grid lg:grid-cols-[1fr_275px] xl:grid-cols-[1fr_275px] gap-4">
			<div className="grid grid-cols-1 gap-4 lg:gap-8 ">
				<nav aria-label="Progress" className="w-full max-w-[719px] mx-auto">
					<ol className="flex w-full items-start">
						{stepper.all.map((step, index, _array) => (
							<li
								key={step.id}
								className={`${
									index === _array.length - 1 ? "" : "flex-1"
								} grid grid-cols-[2rem_1fr] grid-rows-[auto] lg:grid-cols-[2.5rem_1fr] lg:grid-rows-[auto_auto] gap-0 lg:gap-y-2`}
							>
								<span className="hidden lg:flex col-start-1 row-start-1 w-10 justify-center overflow-visible whitespace-nowrap text-center text-sm font-medium">
									{step.subtitle}
								</span>
								<Button
									type="button"
									role="tab"
									variant={
										index === currentIndex
											? "outline-blue-normal"
											: index < currentIndex
												? "blue-normal"
												: "outline-gray"
									}
									aria-current={
										stepper.current.id === step.id ? "step" : undefined
									}
									aria-posinset={index + 1}
									aria-setsize={steps.length}
									aria-selected={stepper.current.id === step.id}
									className="col-start-1 row-start-1 lg:col-start-1 lg:row-start-2 z-10 flex size-8 p-0 lg:size-10 border-2! items-center justify-center rounded-full"
									onClick={async () => {
										const valid = await form.trigger();
										if (!valid) return;

										stepper.goTo(step.id);
									}}
								>
									{index < currentIndex ? (
										<Check className="size-5" />
									) : (
										index + 1
									)}
								</Button>
								{index < _array.length - 1 && (
									<Separator
										className={`col-start-2 row-start-1 lg:col-start-2 lg:row-start-2 h-0.5! w-full self-center ${
											index < currentIndex ? "bg-tertiary" : "bg-border"
										}`}
									/>
								)}
							</li>
						))}
					</ol>
				</nav>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="grid gap-6 pb-[145px] lg:pb-0"
					>
						{stepper.switch({
							info: ({ title }) => (
								<Card className="">
									<CardContent className="grid gap-6">
										<Heading as="h2" variant="subtitle2" weight="semibold">
											{title}
										</Heading>
										<PropertyBasicInfoForm form={form} />
									</CardContent>
								</Card>
							),
							features: ({ title }) => (
								<Card className="">
									<CardContent className="grid gap-6">
										<Heading as="h2" variant="subtitle2" weight="semibold">
											{title}
										</Heading>
										<PropertyFeaturesForm form={form} />
									</CardContent>
								</Card>
							),
							surfaces: ({ title }) => (
								<Card className="">
									<CardContent className="grid gap-6">
										<Heading as="h2" variant="subtitle2" weight="semibold">
											{title}
										</Heading>
										<PropertySurfacesForm form={form} />
									</CardContent>
								</Card>
							),
							values: ({ title }) => (
								<Card className="">
									<CardContent className="grid gap-6">
										<Heading as="h2" variant="subtitle2" weight="semibold">
											{title}
										</Heading>
										<PropertyValuesForm form={form} />
									</CardContent>
								</Card>
							),
							services: ({ title }) => (
								<Card className="">
									<CardContent className="grid gap-6">
										<Heading as="h2" variant="subtitle2" weight="semibold">
											{title}
										</Heading>
										<PropertyServicesForm form={form} />
									</CardContent>
								</Card>
							),
							gallery: ({ title }) => (
								<Card className="">
									<CardContent className="grid gap-6">
										<Heading as="h2" variant="subtitle2" weight="semibold">
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
									</CardContent>
								</Card>
							),
							documents: () => (
								<Card className="">
									<CardContent className="grid gap-6">
										<PropertyDocumentsForm form={form} />
									</CardContent>
								</Card>
							),
						})}

						<div className="fixed bottom-0 right-0 left-0 z-10  px-4 py-4 bg-card border-t lg:static lg:mx-0 lg:p-0 lg:bg-transparent lg:border-none lg:mt-8 col-span-full flex flex-col gap-4">
							<div className="grid grid-cols-2 lg:flex gap-4 justify-between">
								<Button
									type="button"
									variant="outline"
									className="h-10 px-4 lg:h-11 lg:px-8"
									onClick={
										stepper.isFirst
											? () => router.push(paths.agent.properties.index())
											: stepper.prev
									}
									disabled={form.formState.isSubmitting}
								>
									{stepper.isFirst ? "Cancelar" : "Atrás"}
								</Button>

								{(!stepper.isLast || !propertyId) && (
									<Button
										type="submit"
										variant="tertiary"
										className="h-10 px-4 lg:h-11 lg:px-8"
										disabled={form.formState.isSubmitting}
									>
										{stepper.isLast ? (
											<>
												{form.formState.isSubmitting && <Spinner />}
												{form.formState.isSubmitting
													? "Guardando..."
													: "Guardar"}
											</>
										) : (
											"Continuar"
										)}
									</Button>
								)}
							</div>
							{propertyId && (
								<Button
									type="button"
									variant="tertiary"
									onClick={form.handleSubmit(handleSave)}
									disabled={form.formState.isSubmitting}
									className="w-full lg:w-fit mx-auto h-10 px-4 lg:h-11 lg:px-8"
								>
									{stepper.isLast ? (
										<>
											{form.formState.isSubmitting && <Spinner />}
											{form.formState.isSubmitting
												? "Guardando..."
												: "	Guardar cambios"}
										</>
									) : (
										"	Guardar cambios"
									)}
								</Button>
							)}
						</div>
					</form>
				</Form>
			</div>

			<Alert className="hidden h-fit lg:grid grid-cols-[auto_1fr] gap-4 shadow-md ">
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
