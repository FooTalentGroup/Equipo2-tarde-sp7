import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
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
import type { PropertyFormData } from "@src/types/property";
import type { UseFormReturn } from "react-hook-form";

interface PropertyBasicInfoProps {
	form: UseFormReturn<PropertyFormData>;
}

export default function PropertyBasicInfo({ form }: PropertyBasicInfoProps) {
	return (
		<div className="grid grid-cols-2 gap-10 items-start">
			{/* Columna izquierda */}
			<div className="grid gap-4">
				<FormField
					control={form.control}
					name="title"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Título de la propiedad</FormLabel>
							<FormControl>
								<Input placeholder="Nombre y Apellido" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="status"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Estado actual</FormLabel>
							<Select onValueChange={field.onChange} value={field.value}>
								<FormControl>
									<SelectTrigger className="w-full">
										<SelectValue placeholder="Seleccionar" />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									<SelectGroup>
										<SelectItem value="available">Disponible</SelectItem>
										<SelectItem value="disabled">Deshabilitada</SelectItem>
										<SelectItem value="reserved">Reservada</SelectItem>
										<SelectItem value="sold">Vendida</SelectItem>
									</SelectGroup>
								</SelectContent>
							</Select>
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
								<Input placeholder="Buenos Aires" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="postalCode"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Código postal</FormLabel>
							<FormControl>
								<Input placeholder="C1425" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="assignedOwner"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Propietario asignado</FormLabel>
							<FormControl>
								<Input placeholder="Juan Perez" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
			</div>

			{/* Columna derecha */}
			<div className="grid gap-4 items-start">
				<FormField
					control={form.control}
					name="propertyType"
					render={({ field }) => (
						<FormItem>
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
										<SelectItem value="ph">PH</SelectItem>
										<SelectItem value="land">Terreno</SelectItem>
										<SelectItem value="commercial">Local comercial</SelectItem>
										<SelectItem value="office">Oficina</SelectItem>
									</SelectGroup>
								</SelectContent>
							</Select>
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
								<Input placeholder="Av. Santa Fe 2456" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="province"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Provincia</FormLabel>
							<FormControl>
								<Input placeholder="Buenos Aires" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
			</div>
		</div>
	);
}
