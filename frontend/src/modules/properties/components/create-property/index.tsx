"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, AlertDescription, AlertTitle } from "@src/components/ui/alert";
import { Button } from "@src/components/ui/button";
import { Form } from "@src/components/ui/form";
import { Heading } from "@src/components/ui/heading";
import { Separator } from "@src/components/ui/separator";
import { Spinner } from "@src/components/ui/spinner";
import { paths } from "@src/lib/paths";
import { wait } from "@src/lib/utils";
import { type PropertyData, propertyFormSchema } from "@src/types/property";
import { Info } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import PropertyBasicInfo from "./basic-info";
import PropertyCharacteristics from "./property-characteristics";
import PropertyDocumentation from "./property-documentation";
import PropertyPricing from "./property-pricing";
import PropertyPublicationStatus from "./property-publication-status";

type Props = {
	defaultValues?: PropertyData;
};

export default function CreatePropertyForm({ defaultValues }: Props) {
	const router = useRouter();

	const form = useForm<PropertyData>({
		resolver: zodResolver(propertyFormSchema),
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
			age: defaultValues?.age || 0,
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
			// Documentación
			documents: defaultValues?.documents || [],
			// Estado de publicación
			isPublished: defaultValues?.isPublished ?? false,
		},
		mode: "all",
	});

	async function onSubmit(data: PropertyData) {
		try {
			await wait(3000);
			console.log(data);
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
	}

	return (
		<section className="grid grid-cols-[1fr_auto_275px] gap-4">
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
					<div className="grid gap-6">
						<Heading variant="subtitle2" weight="semibold">
							Información de la propiedad
						</Heading>
						<PropertyBasicInfo form={form} />
					</div>
					<Separator />
					<div className="grid gap-6">
						<Heading variant="subtitle2" weight="semibold">
							Características de la propiedad
						</Heading>
						<PropertyCharacteristics form={form} />
					</div>
					<Separator />
					<div className="grid gap-6">
						<Heading variant="subtitle2" weight="semibold">
							Valores de la propiedad
						</Heading>
						<PropertyPricing form={form} />
					</div>
					<Separator />
					<div className="grid gap-6">
						<PropertyDocumentation form={form} />
					</div>
					<Separator />
					<div className="grid gap-6">
						<Heading variant="subtitle2" weight="semibold">
							Estado de publicación
						</Heading>
						<PropertyPublicationStatus form={form} />
					</div>

					<div className="flex gap-4 justify-self-end">
						<Button
							type="button"
							variant="ghost"
							size="lg"
							asChild
							disabled={form.formState.isSubmitting}
						>
							<Link href={paths.agent.properties.index()}>Cancelar</Link>
						</Button>
						<Button
							type="submit"
							variant="tertiary"
							size="lg"
							disabled={form.formState.isSubmitting}
						>
							{form.formState.isSubmitting && <Spinner />}
							{form.formState.isSubmitting ? "Guardando..." : "Guardar"}
						</Button>
					</div>
				</form>
			</Form>
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
