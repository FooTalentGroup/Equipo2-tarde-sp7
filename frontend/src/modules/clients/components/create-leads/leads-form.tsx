"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@src/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessageWithIcon,
} from "@src/components/ui/form";
import { Input } from "@src/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@src/components/ui/select";
import { Spinner } from "@src/components/ui/spinner";
import type { CreateLead } from "@src/types/clients/lead";
import type { Property } from "@src/types/property";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import {
	type ContactFormData,
	contactFormSchema,
} from "../../schemas/contact-form.schema";
import { createClientServerAction } from "../../services/clients-service";
import { ClientType } from "../../services/types";
import PropertySelect from "../PropertySelect";

type ContactFormProps = {
	availableProperties: Property[];
	onSubmit?: (data: ContactFormData) => Promise<void> | void;
	onCancel?: () => void;
};

export default function LeadsForm({
	availableProperties,
	onSubmit,
	onCancel,
}: ContactFormProps) {
	const form = useForm<ContactFormData>({
		resolver: zodResolver(contactFormSchema),
		defaultValues: {
			first_name: "",
			last_name: "",
			phone: "",
			email: "",
			consultation_type_id: 1,

			interest_zone: "",
		},
	});

	const handleSubmit = async (data: ContactFormData) => {
		try {
			if (onSubmit) {
				await onSubmit(data);
			} else {
				// Preparar datos para el backend
				// Mapear consultation_type a los campos del Lead
				const leadData: Partial<CreateLead> = {
					first_name: data.first_name,
					last_name: data.last_name,
					phone: data.phone,
					email: data.email,
					contact_category: "Lead",
					interest_zone: data.interest_zone,
					consultation_type_id: data.consultation_type_id,

					notes: "",
				};

				await createClientServerAction(ClientType.LEAD, leadData as CreateLead);

				toast.success("Contacto guardado exitosamente");
				form.reset();
			}
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : "Error al guardar el contacto";
			toast.error(errorMessage);
			console.error("Contact form error:", error);
		}
	};

	const handleCancel = () => {
		if (onCancel) {
			onCancel();
		} else {
			form.reset();
		}
	};

	return (
		<div className="w-full max-w-2/3 mt-4 p-4 rounded-xl shadow-md/20">
			<Form {...form}>
				<form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
					{/* Nombre y Apellido */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
						<FormField
							control={form.control}
							name="first_name"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-secondary-dark font-semibold">
										Nombre <span className="text-danger-normal">*</span>
									</FormLabel>
									<FormControl>
										<Input
											type="text"
											placeholder="Nombre"
											className="text-base placeholder:text-grey-light border-input-border/70 focus-visible:border-input-active focus-visible:shadow-input-active focus-visible:border-2 focus-visible:ring-0 rounded-lg not-placeholder-shown:border-input-active not-placeholder-shown:border-2 text-primary-normal-active h-12 py-2 shadow-input-border aria-invalid:bg-input-danger aria-invalid:border-danger-normal"
											{...field}
										/>
									</FormControl>
									<FormMessageWithIcon className="text-xs" />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="last_name"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-secondary-dark font-semibold">
										Apellido <span className="text-danger-normal">*</span>
									</FormLabel>
									<FormControl>
										<Input
											type="text"
											placeholder="Apellido"
											className="text-base placeholder:text-grey-light border-input-border/70 focus-visible:border-input-active focus-visible:shadow-input-active focus-visible:border-2 focus-visible:ring-0 rounded-lg not-placeholder-shown:border-input-active not-placeholder-shown:border-2 text-primary-normal-active h-12 py-2 shadow-input-border aria-invalid:bg-input-danger aria-invalid:border-danger-normal"
											{...field}
										/>
									</FormControl>
									<FormMessageWithIcon className="text-xs" />
								</FormItem>
							)}
						/>
					</div>

					{/* Teléfono y Email */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
						<FormField
							control={form.control}
							name="phone"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-secondary-dark font-semibold">
										Teléfono <span className="text-danger-normal">*</span>
									</FormLabel>
									<FormControl>
										<Input
											type="tel"
											placeholder="+54 11 0000-0000"
											className="text-base placeholder:text-grey-light border-input-border/70 focus-visible:border-input-active focus-visible:shadow-input-active focus-visible:border-2 focus-visible:ring-0 rounded-lg not-placeholder-shown:border-input-active not-placeholder-shown:border-2 text-primary-normal-active h-12 py-2 shadow-input-border aria-invalid:bg-input-danger aria-invalid:border-danger-normal"
											{...field}
										/>
									</FormControl>
									<FormMessageWithIcon className="text-xs" />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-secondary-dark font-semibold">
										Email <span className="text-danger-normal">*</span>
									</FormLabel>
									<FormControl>
										<Input
											type="email"
											placeholder="email@email.com"
											className="text-base placeholder:text-grey-light border-input-border/70 focus-visible:border-input-active focus-visible:shadow-input-active focus-visible:border-2 focus-visible:ring-0 rounded-lg not-placeholder-shown:border-input-active not-placeholder-shown:border-2 text-primary-normal-active h-12 py-2 shadow-input-border aria-invalid:bg-input-danger aria-invalid:border-danger-normal"
											{...field}
										/>
									</FormControl>
									<FormMessageWithIcon className="text-xs" />
								</FormItem>
							)}
						/>
					</div>

					{/* Tipo de consulta y Zona de interés */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
						<FormField
							control={form.control}
							name="consultation_type_id"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-secondary-dark font-semibold">
										Tipo de consulta
									</FormLabel>
									<Select
										onValueChange={(value) => field.onChange(Number(value))}
									>
										<FormControl>
											<SelectTrigger className="w-full text-base placeholder:text-grey-light border-input-border/70 focus:border-input-active focus:shadow-input-active focus:border-2 focus:ring-0 rounded-lg text-primary-normal-active shadow-input-border">
												<SelectValue placeholder="Seleccione tipo de consulta" />
											</SelectTrigger>
										</FormControl>
										<SelectContent className="bg-dropdown-background">
											<SelectItem value="1">Consulta General</SelectItem>
											<SelectItem value="3">Consulta por Alquiler</SelectItem>
											<SelectItem value="2">Consulta por Compra</SelectItem>
											<SelectItem value="4">Consulta por Venta</SelectItem>
										</SelectContent>
									</Select>
									<FormMessageWithIcon className="text-xs" />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="interest_zone"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-secondary-dark font-semibold">
										Propiedad de interés
									</FormLabel>
									<FormControl>
										<PropertySelect
											value={field.value}
											onChange={(propertyId, property) => {
												field.onChange(propertyId);
												console.log("Propiedad seleccionada:", property);
											}}
											availableProperties={availableProperties}
											placeholder="Seleccione o busque una propiedad"
											className="aria-invalid:bg-input-danger aria-invalid:border-danger-normal"
										/>
									</FormControl>
									<FormMessageWithIcon className="text-xs" />
								</FormItem>
							)}
						/>
					</div>

					{/* Botones */}
					<div className="flex gap-3 justify-end pt-4">
						<Button
							type="button"
							size={"lg"}
							variant="outline"
							onClick={handleCancel}
							className="rounded-md"
						>
							Cancelar
						</Button>
						<Button
							type="submit"
							size={"lg"}
							className="rounded-md"
							variant="tertiary"
							disabled={form.formState.isSubmitting}
						>
							{form.formState.isSubmitting && <Spinner />}
							{form.formState.isSubmitting ? "Guardando..." : "Guardar"}
						</Button>
					</div>
				</form>
			</Form>
		</div>
	);
}
