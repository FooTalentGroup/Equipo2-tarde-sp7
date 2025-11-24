"use client";

import { AdjustmentsHorizontalIcon } from "@heroicons/react/24/outline";
import { Button } from "@src/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
} from "@src/components/ui/form";
import { Input } from "@src/components/ui/input";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@src/components/ui/select";
import type { PropertyFilterForm } from "@src/types/property-filter";
import { useForm } from "react-hook-form";

export default function PropertyFilter() {
	const form = useForm<PropertyFilterForm>({
		defaultValues: {
			operationType: "",
			propertyType: "",
			priceFrom: "",
			priceTo: "",
			currency: "",
			location: "",
			available: false,
			unavailable: false,
			disabled: false,
		},
	});

	const onSubmit = (data: PropertyFilterForm) => {
		console.log(data);
	};

	return (
		<section className="">
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
					{/* Primera fila: Tipo de operación, Tipo de propiedad, Precio desde, Precio hasta, Moneda, Ubicación y Botón */}
					<div className="grid grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr_auto] items-end gap-2">
						<FormField
							control={form.control}
							name="operationType"
							render={({ field }) => (
								<FormItem className="">
									<FormLabel>Tipo de operación</FormLabel>
									<Select onValueChange={field.onChange} value={field.value}>
										<FormControl>
											<SelectTrigger className="w-full">
												<SelectValue placeholder="Seleccionar" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											<SelectGroup>
												<SelectItem value="sale">Venta</SelectItem>
												<SelectItem value="rent">Alquiler</SelectItem>
												<SelectItem value="temporary">Temporal</SelectItem>
											</SelectGroup>
										</SelectContent>
									</Select>
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="propertyType"
							render={({ field }) => (
								<FormItem className="">
									<FormLabel>Tipo de propiedad</FormLabel>
									<Select onValueChange={field.onChange} value={field.value}>
										<FormControl>
											<SelectTrigger className="w-full">
												<SelectValue placeholder="Seleccionar" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											<SelectGroup>
												<SelectItem value="house">Casa</SelectItem>
												<SelectItem value="apartment">Departamento</SelectItem>
												<SelectItem value="land">Terreno</SelectItem>
												<SelectItem value="commercial">
													Local comercial
												</SelectItem>
												<SelectItem value="office">Oficina</SelectItem>
											</SelectGroup>
										</SelectContent>
									</Select>
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="priceFrom"
							render={({ field }) => (
								<FormItem className="">
									<FormLabel>Precio desde</FormLabel>
									<FormControl>
										<Input type="number" placeholder="Desde" {...field} />
									</FormControl>
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="priceTo"
							render={({ field }) => (
								<FormItem className="">
									<FormLabel>Precio hasta</FormLabel>
									<FormControl>
										<Input type="number" placeholder="Hasta" {...field} />
									</FormControl>
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="currency"
							render={({ field }) => (
								<FormItem className="">
									<FormLabel>Moneda</FormLabel>
									<Select onValueChange={field.onChange} value={field.value}>
										<FormControl>
											<SelectTrigger className="w-full">
												<SelectValue placeholder="Seleccionar" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											<SelectGroup>
												<SelectItem value="usd">USD</SelectItem>
												<SelectItem value="ars">ARS</SelectItem>
												<SelectItem value="eur">EUR</SelectItem>
											</SelectGroup>
										</SelectContent>
									</Select>
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="location"
							render={({ field }) => (
								<FormItem className="">
									<FormLabel>Ubicación</FormLabel>
									<Select onValueChange={field.onChange} value={field.value}>
										<FormControl>
											<SelectTrigger className="w-full">
												<SelectValue placeholder="Seleccionar" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											<SelectGroup>
												<SelectItem value="caba">CABA</SelectItem>
												<SelectItem value="zona_norte">Zona Norte</SelectItem>
												<SelectItem value="zona_sur">Zona Sur</SelectItem>
												<SelectItem value="zona_oeste">Zona Oeste</SelectItem>
											</SelectGroup>
										</SelectContent>
									</Select>
								</FormItem>
							)}
						/>

						<Button
							type="submit"
							size="lg"
							variant="outline"
							className="w-[140px]"
						>
							<AdjustmentsHorizontalIcon className="size-6" /> Filtrar
						</Button>
					</div>
				</form>
			</Form>
		</section>
	);
}
