"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@src/components/ui/button";
import { Checkbox } from "@src/components/ui/checkbox";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@src/components/ui/form";
import { Input } from "@src/components/ui/input";
import { Spinner } from "@src/components/ui/spinner";
import { Upload } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import {
	type InquilinoFormData,
	inquilinoSchema,
} from "../schemas/tenant.schema";

type InquilinoFormProps = {
	onSubmit?: (data: InquilinoFormData) => Promise<void> | void;
	onCancel?: () => void;
};

export default function TenantForm({ onSubmit, onCancel }: InquilinoFormProps) {
	const form = useForm<InquilinoFormData>({
		resolver: zodResolver(inquilinoSchema),
		defaultValues: {
			nombreApellido: "",
			dni: "",
			telefono: "",
			email: "",
			propiedadQueSeMuda: "",
			fechaInicioContrato: "",
			fechaFinContrato: "",
			fechaProximoAumento: "",
			montoAlquiler: "",
			recordarAumento: false,
			recordarFinContrato: false,
		},
	});

	const handleSubmit = async (data: InquilinoFormData) => {
		try {
			if (onSubmit) {
				await onSubmit(data);
				toast.success("Inquilino guardado correctamente");
			}
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : "Error al guardar inquilino";
			toast.error(errorMessage);
			console.error("Form error:", error);
		}
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			form.setValue("documentacion", file);
		}
	};

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(handleSubmit)}
				className="w-full space-y-6 bg-white p-4"
			>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-seconday-dark">
					<FormField
						control={form.control}
						name="nombreApellido"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="font-semibold text-base">
									Nombre y apellido<span className="text-red-500">*</span>
								</FormLabel>
								<FormControl>
									<Input
										placeholder="Nombre y Apellido"
										className="text-md placeholder:text-primary-light border-grey-normal font-normal"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="dni"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="font-semibold text-base">DNI</FormLabel>
								<FormControl>
									<Input
										placeholder="12345678"
										className="text-md placeholder:text-primary-light border-grey-normal font-normal"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="telefono"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="font-semibold text-base">
									Teléfono<span className="text-red-500">*</span>
								</FormLabel>
								<FormControl>
									<Input
										placeholder="+54 11 0000-0000"
										className="text-md placeholder:text-primary-light border-grey-normal font-normal"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="font-semibold text-base">Email</FormLabel>
								<FormControl>
									<Input
										type="email"
										placeholder="email@gmail.com"
										className="text-md placeholder:text-primary-light border-grey-normal font-normal"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				<FormField
					control={form.control}
					name="propiedadQueSeMuda"
					render={({ field }) => (
						<FormItem>
							<FormLabel className="font-semibold text-base">
								Propiedad que se muda
							</FormLabel>
							<FormControl>
								<Input
									placeholder="Av. Santa Fe 1654"
									className="text-md placeholder:text-primary-light border-grey-normal font-normal"
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<FormField
						control={form.control}
						name="fechaInicioContrato"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="font-semibold text-base">
									Fecha de inicio de contrato
								</FormLabel>
								<FormControl>
									<Input
										placeholder="--/--/----"
										className="text-md placeholder:text-primary-light border-grey-normal font-normal"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="fechaFinContrato"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="font-semibold text-base">
									Fecha de fin de contrato
								</FormLabel>
								<FormControl>
									<Input
										placeholder="--/--/----"
										className="text-md placeholder:text-primary-light border-grey-normal font-normal"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="fechaProximoAumento"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="font-semibold text-base">
									Fecha del próximo aumento
								</FormLabel>
								<FormControl>
									<Input
										placeholder="--/--/----"
										className="text-md placeholder:text-primary-light border-grey-normal font-normal"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="montoAlquiler"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="font-semibold text-base">
									Monto de alquiler
								</FormLabel>
								<FormControl>
									<Input
										placeholder="$800.000"
										className="text-md placeholder:text-primary-light border-grey-normal font-normal"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				<div className="space-y-2">
					<FormField
						control={form.control}
						name="recordarAumento"
						render={({ field }) => (
							<FormItem className="flex flex-row items-start space-x-3 space-y-0">
								<FormControl>
									<Checkbox
										checked={field.value}
										onCheckedChange={field.onChange}
									/>
								</FormControl>
								<div className="space-y-1 leading-none">
									<FormLabel className="font-normal text-sm">
										Recordar 1 mes antes del aumento
									</FormLabel>
								</div>
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="recordarFinContrato"
						render={({ field }) => (
							<FormItem className="flex flex-row items-start space-x-3 space-y-0">
								<FormControl>
									<Checkbox
										checked={field.value}
										onCheckedChange={field.onChange}
									/>
								</FormControl>
								<div className="space-y-1 leading-none">
									<FormLabel className="font-normal text-sm">
										Recordar 1 mes antes del fin de contrato
									</FormLabel>
								</div>
							</FormItem>
						)}
					/>
				</div>

				<div>
					<FormLabel className="font-semibold text-base">
						Documentación (opcional)
					</FormLabel>
					<div className="mt-2">
						<label
							htmlFor="file-upload"
							className="inline-flex items-center gap-2 px-4 py-2 border border-input rounded-md cursor-pointer hover:bg-accent transition-colors"
						>
							<Upload className="w-4 h-4" />
							<span className="text-md placeholder:text-primary-light border-grey-normal font-normal">
								Subir archivo
							</span>
						</label>
						<input
							id="file-upload"
							type="file"
							className="hidden"
							onChange={handleFileChange}
						/>
					</div>
				</div>

				<div className="flex justify-end gap-3">
					<Button
						type="button"
						variant="outline"
						size={"lg"}
						className="border-none text-black"
						onClick={onCancel}
					>
						Cancelar
					</Button>
					<Button
						type="submit"
						variant="secondary"
						size="lg"
						disabled={form.formState.isSubmitting}
					>
						{form.formState.isSubmitting && <Spinner />}
						{form.formState.isSubmitting ? "Guardando..." : "Guardar"}
					</Button>
				</div>
			</form>
		</Form>
	);
}
