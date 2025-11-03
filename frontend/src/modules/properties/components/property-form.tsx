"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@src/components/ui/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@src/components/ui/form";
import { Input } from "@src/components/ui/input";
import { Textarea } from "@src/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@src/components/ui/select";
import type { PropertyCreateInput } from "../types";
import { PropertyCreateInputSchema } from "../schemas";

interface PropertyFormProps {
	defaultValues?: Partial<PropertyCreateInput>;
	onSubmit: (data: PropertyCreateInput) => void | Promise<void>;
	submitLabel?: string;
	isLoading?: boolean;
}

export function PropertyForm({
	defaultValues,
	onSubmit,
	submitLabel = "Crear Propiedad",
	isLoading = false,
}: PropertyFormProps) {
	const form = useForm<PropertyCreateInput>({
		resolver: zodResolver(PropertyCreateInputSchema),
		defaultValues: {
			title: defaultValues?.title || "",
			description: defaultValues?.description || "",
			price: defaultValues?.price || 0,
			location: defaultValues?.location || "",
			bedrooms: defaultValues?.bedrooms || 0,
			bathrooms: defaultValues?.bathrooms || 0,
			area: defaultValues?.area || 0,
			type: defaultValues?.type || "apartment",
			status: defaultValues?.status || "available",
			imageUrl: defaultValues?.imageUrl || "",
		},
	});

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
				<FormField
					control={form.control}
					name="title"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Título</FormLabel>
							<FormControl>
								<Input
									placeholder="Casa moderna en el centro"
									{...field}
									disabled={isLoading}
								/>
							</FormControl>
							<FormDescription>
								El título de la propiedad (máximo 200 caracteres)
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="description"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Descripción</FormLabel>
							<FormControl>
								<Textarea
									placeholder="Hermosa propiedad con excelente ubicación..."
									className="min-h-[120px]"
									{...field}
									disabled={isLoading}
								/>
							</FormControl>
							<FormDescription>
								Descripción detallada de la propiedad (máximo 1000 caracteres)
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<FormField
						control={form.control}
						name="price"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Precio</FormLabel>
								<FormControl>
									<Input
										type="number"
										placeholder="350000"
										{...field}
										onChange={e => field.onChange(Number(e.target.value))}
										disabled={isLoading}
									/>
								</FormControl>
								<FormDescription>Precio en dólares</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="location"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Ubicación</FormLabel>
								<FormControl>
									<Input
										placeholder="Downtown, City Center"
										{...field}
										disabled={isLoading}
									/>
								</FormControl>
								<FormDescription>Ubicación de la propiedad</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					<FormField
						control={form.control}
						name="bedrooms"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Habitaciones</FormLabel>
								<FormControl>
									<Input
										type="number"
										placeholder="3"
										{...field}
										onChange={e => field.onChange(Number(e.target.value))}
										disabled={isLoading}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="bathrooms"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Baños</FormLabel>
								<FormControl>
									<Input
										type="number"
										placeholder="2"
										{...field}
										onChange={e => field.onChange(Number(e.target.value))}
										disabled={isLoading}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="area"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Área (m²)</FormLabel>
								<FormControl>
									<Input
										type="number"
										placeholder="120"
										{...field}
										onChange={e => field.onChange(Number(e.target.value))}
										disabled={isLoading}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<FormField
						control={form.control}
						name="type"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Tipo</FormLabel>
								<Select
									onValueChange={field.onChange}
									defaultValue={field.value}
									disabled={isLoading}
								>
									<FormControl>
										<SelectTrigger>
											<SelectValue placeholder="Selecciona el tipo" />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										<SelectItem value="apartment">Apartamento</SelectItem>
										<SelectItem value="house">Casa</SelectItem>
										<SelectItem value="condo">Condominio</SelectItem>
										<SelectItem value="land">Terreno</SelectItem>
									</SelectContent>
								</Select>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="status"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Estado</FormLabel>
								<Select
									onValueChange={field.onChange}
									defaultValue={field.value}
									disabled={isLoading}
								>
									<FormControl>
										<SelectTrigger>
											<SelectValue placeholder="Selecciona el estado" />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										<SelectItem value="available">Disponible</SelectItem>
										<SelectItem value="sold">Vendido</SelectItem>
										<SelectItem value="rented">Alquilado</SelectItem>
									</SelectContent>
								</Select>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				<FormField
					control={form.control}
					name="imageUrl"
					render={({ field }) => (
						<FormItem>
							<FormLabel>URL de Imagen (opcional)</FormLabel>
							<FormControl>
								<Input
									type="url"
									placeholder="https://example.com/image.jpg"
									{...field}
									disabled={isLoading}
								/>
							</FormControl>
							<FormDescription>
								URL de la imagen principal de la propiedad
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				<Button type="submit" disabled={isLoading}>
					{isLoading ? "Procesando..." : submitLabel}
				</Button>
			</form>
		</Form>
	);
}
