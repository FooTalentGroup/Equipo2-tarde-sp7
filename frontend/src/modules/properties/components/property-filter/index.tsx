"use client";

import { Button } from "@src/components/ui/button";
import { Checkbox } from "@src/components/ui/checkbox";
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
import { useForm } from "react-hook-form";

interface PropertyFilterForm {
	operationType: string;
	propertyType: string;
	amount: string;
	location: string;
	available: boolean;
	unavailable: boolean;
	disabled: boolean;
}

export default function PropertyFilter() {
	const form = useForm<PropertyFilterForm>({
		defaultValues: {
			operationType: "",
			propertyType: "",
			amount: "",
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
		<div className="">
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
					{/* Primera fila: Tipo de operación, Tipo de propiedad, Monto, Ubicación y Botón */}
					<div className="grid grid-cols-[1fr_1fr_1fr_1fr_auto] items-end gap-2">
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
							name="amount"
							render={({ field }) => (
								<FormItem className="">
									<FormLabel>Monto</FormLabel>
									<FormControl>
										<Input
											type="number"
											placeholder="Ingrese monto"
											{...field}
										/>
									</FormControl>
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="location"
							render={({ field }) => (
								<FormItem className="">
									<FormLabel>Ubicación</FormLabel>
									<FormControl>
										<Input
											type="text"
											placeholder="Ingrese ubicación"
											{...field}
										/>
									</FormControl>
								</FormItem>
							)}
						/>

						<Button type="submit" variant="default">
							Filtrar
						</Button>
					</div>

					{/* Segunda fila: Checkboxes */}
					<div className="flex items-center gap-6">
						<FormField
							control={form.control}
							name="available"
							render={({ field }) => (
								<div className="flex items-center space-x-2">
									<FormControl>
										<Checkbox
											id="available"
											checked={field.value}
											onCheckedChange={field.onChange}
										/>
									</FormControl>
									<FormLabel htmlFor="available" className="">
										Disponible
									</FormLabel>
								</div>
							)}
						/>

						<FormField
							control={form.control}
							name="unavailable"
							render={({ field }) => (
								<div className="flex items-center space-x-2">
									<FormControl>
										<Checkbox
											id="unavailable"
											checked={field.value}
											onCheckedChange={field.onChange}
										/>
									</FormControl>
									<FormLabel htmlFor="unavailable" className="">
										No disponible
									</FormLabel>
								</div>
							)}
						/>

						<FormField
							control={form.control}
							name="disabled"
							render={({ field }) => (
								<div className="flex items-center space-x-2">
									<FormControl>
										<Checkbox
											id="disabled"
											checked={field.value}
											onCheckedChange={field.onChange}
										/>
									</FormControl>
									<FormLabel htmlFor="disabled" className="">
										Deshabilitado
									</FormLabel>
								</div>
							)}
						/>
					</div>
				</form>
			</Form>
		</div>
	);
}
