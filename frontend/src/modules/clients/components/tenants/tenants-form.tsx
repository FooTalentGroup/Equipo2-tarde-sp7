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
import { Spinner } from "@src/components/ui/spinner";
import { Textarea } from "@src/components/ui/textarea";
import { paths } from "@src/lib/paths";
import PropertySelect from "@src/modules/clients/ui/property-select";
import type { CreateTenant } from "@src/types/clients/tenant";
import type { Property } from "@src/types/property";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import {
	type TenantFormData,
	tenantFormSchema,
} from "../../schemas/tenant-form.schema";
import {
	createClientServerAction,
	deleteClientById,
	updateClientById,
} from "../../services/clients-service";
import { ClientType } from "../../services/types";
import DatePickerField from "../../ui/date-picker-field";

type TenantFormProps = {
	availableProperties: Property[];
	onSubmit?: (data: TenantFormData) => Promise<void> | void;
	initialValues?: Partial<TenantFormData>;
	clientId?: string;
	leadId?: string;
};

export default function TenantForm({
	availableProperties,
	onSubmit,
	initialValues,
	clientId,
	leadId,
}: TenantFormProps) {
	const router = useRouter();
	const form = useForm<TenantFormData>({
		resolver: zodResolver(tenantFormSchema),
		defaultValues: {
			first_name: "",
			last_name: "",
			dni: "",
			phone: "",
			email: "",
			property_id: "",
			contract_start_date: "",
			contract_end_date: "",
			next_increase_date: "",
			monthly_amount: "",
			notes: "",
			...initialValues,
		},
	});

	const handleSubmit = async (data: TenantFormData) => {
		try {
			if (onSubmit) {
				await onSubmit(data);
			} else {
				const propertyId =
					data.property_id && data.property_id !== ""
						? Number(data.property_id)
						: undefined;

				const tenantData: Partial<CreateTenant> = {
					first_name: data.first_name,
					last_name: data.last_name,
					phone: data.phone,
					email: data.email,
					dni: data.dni,
					contact_category_id: 2,
					rental_interest: true,
					property_interest_phone: data.phone,
					notes: data.notes || "",
					...(propertyId !== undefined ? { property_id: propertyId } : {}),
					contract_start_date: data.contract_start_date,
					contract_end_date: data.contract_end_date,
					next_increase_date: data.next_increase_date,
					monthly_amount: Number(data.monthly_amount),
					currency_type_id: 1,
				};
				if (clientId) {
					await updateClientById(clientId, tenantData);
					toast.success("Inquilino actualizado exitosamente");
					router.push(paths.agent.clients.inquilinos.detail(clientId));
					return;
				}

				await createClientServerAction(
					ClientType.TENANT,
					tenantData as CreateTenant,
				);

				if (leadId) {
					try {
						await deleteClientById(leadId);
						toast.success("Inquilino creado y lead convertido exitosamente");
					} catch (deleteError) {
						console.error("Error eliminando lead:", deleteError);
						toast.error("Inquilino creado, pero error al eliminar el lead");
					}
				} else {
					toast.success("Inquilino guardado exitosamente");
				}

				router.push(paths.agent.clients.inquilinos.index());
			}
		} catch (error) {
			const errorMessage =
				error instanceof Error
					? error.message
					: "Error al guardar el inquilino";
			toast.error(errorMessage);
			console.error("Tenant form error:", error);
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
											className="text-base placeholder:text-grey-light border-input-border/70 focus-visible:border-input-active focus-visible:shadow-input-active focus-visible:border-2 focus-visible:ring-0 rounded-lg not-placeholder-shown:border-input-active not-placeholder-shown:border-2 text-primary-normal-active h-12 py-4 shadow-input-border aria-invalid:bg-input-danger aria-invalid:border-danger-normal"
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
											className="text-base placeholder:text-grey-light border-input-border/70 focus-visible:border-input-active focus-visible:shadow-input-active focus-visible:border-2 focus-visible:ring-0 rounded-lg not-placeholder-shown:border-input-active not-placeholder-shown:border-2 text-primary-normal-active h-12 py-4 shadow-input-border aria-invalid:bg-input-danger aria-invalid:border-danger-normal"
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
							name="dni"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-secondary-dark font-semibold">
										DNI
									</FormLabel>
									<FormControl>
										<Input
											type="text"
											placeholder="12345678"
											className="text-base placeholder:text-grey-light border-input-border/70 focus-visible:border-input-active focus-visible:shadow-input-active focus-visible:border-2 focus-visible:ring-0 rounded-lg not-placeholder-shown:border-input-active not-placeholder-shown:border-2 text-primary-normal-active h-12 py-4 shadow-input-border aria-invalid:bg-input-danger aria-invalid:border-danger-normal"
											{...field}
										/>
									</FormControl>
									<FormMessageWithIcon className="text-xs" />
								</FormItem>
							)}
						/>

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
											countries={["AR"]}
											placeholder="Ingresá un número de teléfono"
											className="text-base [&_input]:placeholder:text-grey-light [&_input]:border-input-border/70 [&_input]:focus-visible:border-input-active [&_input]:focus-visible:shadow-input-active [&_input]:focus-visible:border-2 [&_input]:focus-visible:ring-0 [&_input]:rounded-r-lg [&_button]:rounded-l-lg [&_input]:not-placeholder-shown:border-input-active [&_input]:not-placeholder-shown:border-2 [&_input]:text-primary-normal-active [&_input]:h-12 [&_input]:py-2 [&_input]:shadow-input-border [&_input]:aria-invalid:bg-input-danger [&_input]:aria-invalid:border-danger-normal [&_button]:not-placeholder-shown:border-input-active [&_button]:not-placeholder-shown:border-2"
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
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-secondary-dark font-semibold">
										Email
									</FormLabel>
									<FormControl>
										<Input
											type="email"
											placeholder="email@gmail.com"
											className="text-base placeholder:text-grey-light border-input-border/70 focus-visible:border-input-active focus-visible:shadow-input-active focus-visible:border-2 focus-visible:ring-0 rounded-lg not-placeholder-shown:border-input-active not-placeholder-shown:border-2 text-primary-normal-active h-12 py-4 shadow-input-border aria-invalid:bg-input-danger aria-invalid:border-danger-normal"
											{...field}
										/>
									</FormControl>
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
										Nuevo inmueble
									</FormLabel>
									<FormControl>
										<PropertySelect
											value={field.value}
											onChange={(propertyId, property) => {
												field.onChange(propertyId);
												console.log("Propiedad seleccionada:", property);
											}}
											availableProperties={availableProperties}
											operationTypes={[2]}
											placeholder="Av. Santa Fe 1234"
											className="aria-invalid:bg-input-danger aria-invalid:border-danger-normal"
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
							name="contract_start_date"
							render={({ field }) => (
								<DatePickerField
									value={field.value}
									onChange={field.onChange}
									label="Fecha de inicio de contrato"
									side="bottom"
								/>
							)}
						/>

						<FormField
							control={form.control}
							name="contract_end_date"
							render={({ field }) => (
								<DatePickerField
									value={field.value}
									onChange={field.onChange}
									label="Fecha de fin de contrato"
									side="bottom"
								/>
							)}
						/>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
						<FormField
							control={form.control}
							name="next_increase_date"
							render={({ field }) => (
								<DatePickerField
									value={field.value || ""}
									onChange={field.onChange}
									label="Fecha del próximo"
									side="bottom"
								/>
							)}
						/>

						<FormField
							control={form.control}
							name="monthly_amount"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-secondary-dark font-semibold">
										Monto de alquiler
									</FormLabel>
									<FormControl>
										<Input
											type="number"
											min="0"
											step="1"
											placeholder="$100.000"
											className="text-base placeholder:text-grey-light border-input-border/70 focus-visible:border-input-active focus-visible:shadow-input-active focus-visible:border-2 focus-visible:ring-0 rounded-lg not-placeholder-shown:border-input-active not-placeholder-shown:border-2 text-primary-normal-active h-12 py-4 shadow-input-border aria-invalid:bg-input-danger aria-invalid:border-danger-normal"
											{...field}
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
							variant="outline"
							size={"lg"}
							onClick={() => router.back()}
							className="rounded-md"
						>
							Cancelar
						</Button>
						<Button
							type="submit"
							className="rounded-md"
							size={"lg"}
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
