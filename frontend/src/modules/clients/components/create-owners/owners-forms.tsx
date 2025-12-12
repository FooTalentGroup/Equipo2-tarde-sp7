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
import { PhoneInput } from "@src/components/ui/phone-input";
import { Spinner } from "@src/components/ui/spinner";
import { Textarea } from "@src/components/ui/textarea";
import {
	type OwnerFormData,
	ownerFormSchema,
} from "@src/modules/clients/schemas/owner-form.schema";
import {
	createClientServerAction,
	updateClientById,
} from "@src/modules/clients/services/clients-service";
import { ClientType } from "@src/modules/clients/services/types";
import type { CreateOwner } from "@src/types/clients/owner";
import type { Property } from "@src/types/property";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import PropertySelect from "../PropertySelect";

type OwnerFormProps = {
	availableProperties: Property[];
	onSubmit?: (data: OwnerFormData) => Promise<void> | void;
	onCancel?: () => void;
	initialValues?: Partial<OwnerFormData>;
	clientId?: string;
};

export default function OwnerForm({
	availableProperties,
	onSubmit,
	onCancel,
	initialValues,
	clientId,
}: OwnerFormProps) {
	/* const availableProperties = getPropertiesWithoutOwner(); */

	const form = useForm<OwnerFormData>({
		resolver: zodResolver(ownerFormSchema),
		defaultValues: {
			first_name: "",
			last_name: "",
			dni: "",
			phone: "",
			email: "",
			address: "",
			property_id: "",
			notes: "",
			...initialValues,
		},
	});

	const handleSubmit = async (data: OwnerFormData) => {
		try {
			if (onSubmit) {
				await onSubmit(data);
			} else {
				// Preparar datos para el backend
				const propertyId =
					data.property_id && data.property_id !== ""
						? Number(data.property_id)
						: undefined;

				const ownerData: Partial<CreateOwner> = {
					first_name: data.first_name,
					last_name: data.last_name,
					phone: data.phone,
					email: data.email,
					dni: data.dni,
					contact_category_id: 3,
					address: data.address,
					notes: data.notes || "",
					...(propertyId !== undefined ? { property_id: propertyId } : {}),
				};

				// Aquí irá la llamada al backend
				// const response = await axios.post('/api/owners', {
				//   ...ownerData,
				//   property_id: data.assigned_property_id
				// });
				if (clientId) {
					await updateClientById(clientId, ownerData);
					toast.success("Propietario actualizado exitosamente");
					window.location.href = `/agent/clients/propietarios/${clientId}`;
					return;
				}

				await createClientServerAction(
					ClientType.OWNER,
					ownerData as CreateOwner,
				);
				/* console.log("Datos del propietario para backend:", {
					...ownerData,
					property_id: data.property_id,
				});

				// Simular delay de envío
				await new Promise((resolve) => setTimeout(resolve, 1000)); */

				toast.success("Propietario guardado exitosamente");
				form.reset();
			}
		} catch (error) {
			const errorMessage =
				error instanceof Error
					? error.message
					: "Error al guardar el propietario";
			toast.error(errorMessage);
			console.error("Owner form error:", error);
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

					{/* DNI y Teléfono */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
						<FormField
							control={form.control}
							name="dni"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-secondary-dark font-semibold">
										DNI <span className="text-danger-normal">*</span>
									</FormLabel>
									<FormControl>
										<Input
											type="text"
											placeholder="12345678"
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
											className="text-base [&_input]:placeholder:text-grey-light [&_button]:border-input-border/60 [&_input]:border-input-border/60"
											{...field}
										/>
									</FormControl>
									<FormMessageWithIcon className="text-xs" />
								</FormItem>
							)}
						/>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
						{/* Email */}
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

						{/* Dirección */}
						<FormField
							control={form.control}
							name="address"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-secondary-dark font-semibold">
										Dirección <span className="text-danger-normal">*</span>
									</FormLabel>
									<FormControl>
										<Input
											type="text"
											placeholder="Av. Santa Fe 1234"
											className="text-base placeholder:text-grey-light border-input-border/70 focus-visible:border-input-active focus-visible:shadow-input-active focus-visible:border-2 focus-visible:ring-0 rounded-lg not-placeholder-shown:border-input-active not-placeholder-shown:border-2 text-primary-normal-active h-12 py-2 shadow-input-border aria-invalid:bg-input-danger aria-invalid:border-danger-normal"
											{...field}
										/>
									</FormControl>
									<FormMessageWithIcon className="text-xs" />
								</FormItem>
							)}
						/>
					</div>

					{/* Propiedad Asociada */}
					<div className="w-1/2 pr-4">
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
											onChange={(propertyId, property) => {
												field.onChange(propertyId);
												console.log("Propiedad seleccionada:", property);
											}}
											availableProperties={availableProperties}
											operationTypes={[1]}
											placeholder="Seleccione o busque una propiedad"
											className="aria-invalid:bg-input-danger aria-invalid:border-danger-normal"
										/>
									</FormControl>
									<FormMessageWithIcon className="text-xs" />
								</FormItem>
							)}
						/>
					</div>

					{/* Notas */}
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
											className="text-base border-input-border/70 placeholder:text-grey-light focus-visible:border-input-active focus-visible:shadow-input-active focus-visible:border-2 focus-visible:ring-0 rounded-lg not-placeholder-shown:border-input-active not-placeholder-shown:border-2 text-primary-normal-active py-2 shadow-input-border aria-invalid:bg-input-danger aria-invalid:border-danger-normal resize-none min-h-[100px]"
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

					{/* Botones */}
					<div className="flex gap-3 justify-end pt-4">
						<Button
							type="button"
							variant="outline"
							size={"lg"}
							onClick={handleCancel}
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
