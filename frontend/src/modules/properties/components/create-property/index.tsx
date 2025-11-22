"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@src/components/ui/form";
import { Heading } from "@src/components/ui/heading";
import { Separator } from "@src/components/ui/separator";
import { type PropertyFormData, propertyFormSchema } from "@src/types/property";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import PropertyBasicInfo from "./basic-info";
import PropertyCharacteristics from "./property-characteristics";
import PropertyPricing from "./property-pricing";

type CreatePropertyFormProps = {
	defaultValues?: PropertyFormData;
};

export default function CreatePropertyForm({
	defaultValues,
}: CreatePropertyFormProps) {
	const form = useForm<PropertyFormData>({
		resolver: zodResolver(propertyFormSchema),
		defaultValues: {
			// Información de la propiedad
			title: defaultValues?.title || "",
			propertyType: defaultValues?.propertyType || "",
			status: defaultValues?.status || "",
			address: defaultValues?.address || "",
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
			expenses: defaultValues?.expenses ?? 0,
			currency: defaultValues?.currency || "",
		},
		mode: "all",
	});

	function onSubmit(data: PropertyFormData) {
		toast.success("You submitted the following values:", {
			description: (
				<pre className="bg-code text-code-foreground mt-2 w-[320px] overflow-x-auto rounded-md p-4">
					<code>{JSON.stringify(data, null, 2)}</code>
				</pre>
			),
			position: "bottom-right",
			classNames: {
				content: "flex flex-col gap-2",
			},
			style: {
				"--border-radius": "calc(var(--radius)  + 4px)",
			} as React.CSSProperties,
		});
	}

	return (
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
						Valores
					</Heading>
					<PropertyPricing form={form} />
				</div>

				<Separator />

				{/* Futuras secciones se agregarán aquí */}
				{/* Botón de submit se agregará cuando haya más secciones */}
			</form>
		</Form>
	);
}
