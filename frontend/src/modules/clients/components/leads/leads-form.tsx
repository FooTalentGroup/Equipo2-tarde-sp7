"use client";

import { useRouter } from "next/navigation";

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
import { PhoneInput } from "@src/components/ui/phone-input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@src/components/ui/select";
import { Spinner } from "@src/components/ui/spinner";
import { Textarea } from "@src/components/ui/textarea";
import { paths } from "@src/lib/paths";
import PropertySelect from "@src/modules/clients/ui/property-select";
import type { CreateLead } from "@src/types/clients/lead";
import type { Property } from "@src/types/property";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import {
	type ContactFormData,
	contactFormSchema,
} from "../../schemas/contact-form.schema";
import {
	createClientServerAction,
	updateClientById,
} from "../../services/clients-service";
import { ClientType } from "../../services/types";

type ContactFormProps = {
	availableProperties: Property[];
	onSubmit?: (data: ContactFormData) => Promise<void> | void;
	initialValues?: Partial<ContactFormData>;
	clientId?: string;
};

export default function LeadsForm({
	availableProperties,
	onSubmit,
	initialValues,
	clientId,
}: ContactFormProps) {
	const router = useRouter();

	const defaultValues: ContactFormData = {
		first_name: "",
		last_name: "",
		phone: "",
		email: "",
		consultation_type_id: 1,
		notes: "",
		property_id: "",
		...initialValues,
	};

	const form = useForm<ContactFormData>({
		resolver: zodResolver(contactFormSchema),
		defaultValues,
	});

	const handleSubmit = async (data: ContactFormData) => {
		try {
			if (onSubmit) {
				await onSubmit(data);
				return;
			}

			const payload: Partial<CreateLead> = {
				first_name: data.first_name,
				last_name: data.last_name,
				phone: data.phone,
				email: data.email,
				contact_category_id: 1,
				notes: data.notes || "",
				property_id: data.property_id
					? Number.isNaN(Number(data.property_id))
						? undefined
						: Number(data.property_id)
					: undefined,
			};

			if (clientId) {
				await updateClientById(clientId, payload);
				toast.success("Contacto actualizado exitosamente");
				router.push(`/agent/clients/leads/${clientId}`);
				return;
			}

			await createClientServerAction(ClientType.LEAD, payload as CreateLead);
			toast.success("Contacto guardado exitosamente");
			router.push(paths.agent.clients.leads.index());
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : "Error al guardar el contacto";
			toast.error(errorMessage);
			console.error("Contact form error:", error);
		}
	};

	return (
		<div className="w-full lg:max-w-2/3 mt-4 p-4 rounded-xl shadow-md/20">
			<Form {...form}>
				<form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
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
										<PhoneInput
											defaultCountry="AR"
											countries={["AR", "UY", "CL", "BR", "PY"]}
											placeholder="Ingresá un número de teléfono"
											className="text-base [&_input]:placeholder:text-grey-light [&_input]:border-input-border/70 [&_input]:focus-visible:border-input-active [&_input]:focus-visible:shadow-input-active [&_input]:focus-visible:border-2 [&_input]:focus-visible:ring-0 [&_input]:rounded-r-lg [&_button]:rounded-l-lg [&_input]:not-placeholder-shown:border-input-active [&_input]:not-placeholder-shown:border-2 [&_input]:text-primary-normal-active [&_input]:h-12 [&_input]:py-2 [&_input]:shadow-input-border [&_input]:aria-invalid:bg-input-danger [&_input]:aria-invalid:border-danger-normal [&_button]:not-placeholder-shown:border-input-active [&_button]:not-placeholder-shown:border-2"
											{...field}
										/>
									</FormControl>
									<FormMessageWithIcon className="text-xs" />
								</FormItem>
							)}
						/>{" "}
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
										value={field.value ? String(field.value) : undefined}
										onValueChange={(value) => field.onChange(Number(value))}
									>
										<FormControl>
											<SelectTrigger className="w-full text-base data-placeholder:text-grey-light border-input-border/70 focus:border-input-active focus:shadow-input-active focus:border-2 focus:ring-0 rounded-lg text-primary-normal-active h-12 shadow-input-border not-placeholder-shown:border-input-active not-placeholder-shown:border-2">
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
							name="property_id"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-secondary-dark font-semibold">
										Propiedad de interés
									</FormLabel>
									<FormControl>
										<PropertySelect
											value={field.value}
											onChange={(propertyId, _property) => {
												field.onChange(propertyId);
											}}
											availableProperties={availableProperties}
											operationTypes={[1, 2]}
											placeholder="Av. Santa Fe 1234"
											className="aria-invalid:bg-input-danger aria-invalid:border-danger-normal"
										/>
									</FormControl>
									<FormMessageWithIcon className="text-xs" />
								</FormItem>
							)}
						/>
					</div>

					<div className="border-t border-t-grey-light pt-4">
						<FormField
							control={form.control}
							name="notes"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-secondary-dark font-semibold">
										Agregar nota (opcional)
									</FormLabel>
									<FormControl>
										<Textarea
											placeholder="Agregar notas adicionales..."
											className="text-base border-input-border/70 placeholder:text-grey-light focus-visible:border-input-active focus-visible:shadow-input-active focus-visible:border-2 focus-visible:ring-0 rounded-lg not-placeholder-shown:border-input-active not-placeholder-shown:border-2 text-primary-normal-active py-4 shadow-input-border aria-invalid:bg-input-danger aria-invalid:border-danger-normal resize-none min-h-[100px]"
											maxLength={300}
											{...field}
										/>
									</FormControl>
									<div className="flex justify-between items-center">
										<FormMessageWithIcon className="text-xs" />
										<span className="text-sm text-gray-500">
											{field.value?.length || 0}/300
										</span>
									</div>
								</FormItem>
							)}
						/>
					</div>

					<div className="flex gap-3 justify-end pt-4">
						<Button
							type="button"
							size={"lg"}
							variant="outline"
							onClick={() => router.back()}
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
