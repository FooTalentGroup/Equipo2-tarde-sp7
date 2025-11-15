"use client";

import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@src/components/ui/form";
import { Input } from "@src/components/ui/input";
import { Textarea } from "@src/components/ui/textarea";
import type { UseFormReturn } from "react-hook-form";

import type { CreatePropertyDto } from "../schemas/property.schema";

interface Props {
	form: UseFormReturn<CreatePropertyDto>;
	loading?: boolean;
}

export function PropertyForm({ form, loading }: Props) {
	return (
		<Form {...form}>
			<FormField
				control={form.control}
				name="title"
				render={({ field }) => (
					<FormItem>
						<FormLabel>Título</FormLabel>
						<FormControl>
							<Input
								placeholder="Ej: Casa en Palermo"
								{...field}
								disabled={loading}
							/>
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>

			<FormField
				control={form.control}
				name="price"
				render={({ field }) => (
					<FormItem>
						<FormLabel>Precio</FormLabel>
						<FormControl>
							<Input
								type="number"
								placeholder="Ej: 150000"
								{...field}
								value={field.value ?? ""}
								disabled={loading}
							/>
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>

			<FormField
				control={form.control}
				name="address"
				render={({ field }) => (
					<FormItem>
						<FormLabel>Dirección</FormLabel>
						<FormControl>
							<Input
								placeholder="Ej: Av. Libertador 1234"
								{...field}
								disabled={loading}
							/>
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>

			<FormField
				control={form.control}
				name="city"
				render={({ field }) => (
					<FormItem>
						<FormLabel>Ciudad</FormLabel>
						<FormControl>
							<Input
								placeholder="Ej: Buenos Aires"
								{...field}
								disabled={loading}
							/>
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>

			<div className="grid grid-cols-2 gap-3">
				<FormField
					control={form.control}
					name="beds"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Habitaciones</FormLabel>
							<FormControl>
								<Input
									type="number"
									{...field}
									value={field.value ?? ""}
									disabled={loading}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="baths"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Baños</FormLabel>
							<FormControl>
								<Input
									type="number"
									{...field}
									value={field.value ?? ""}
									disabled={loading}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
			</div>

			<FormField
				control={form.control}
				name="description"
				render={({ field }) => (
					<FormItem>
						<FormLabel>Descripción</FormLabel>
						<FormControl>
							<Textarea
								placeholder="Ej: Hermosa propiedad de 3 ambientes con patio..."
								{...field}
								disabled={loading}
							/>
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>
		</Form>
	);
}
