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
import type { PropertyData } from "@src/types/property";
import type { UseFormReturn } from "react-hook-form";

interface PropertyBasicInfoProps {
	form: UseFormReturn<PropertyData>;
}

export default function PropertyBasicInfo({ form }: PropertyBasicInfoProps) {
	return (
		<div className="grid grid-cols-2 gap-10 items-start">
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
					name="propertyType"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Tipo de propiedad</FormLabel>
							<Select onValueChange={field.onChange} value={field.value}>
								<FormControl>
									<SelectTrigger className="w-full">
										<SelectValue placeholder="Casa/Departamento/PH" />
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
					name="floor"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Piso/Unidad</FormLabel>
							<FormControl>
								<Input placeholder="4B" {...field} />
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
					name="province"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Provincia</FormLabel>
							<Select onValueChange={field.onChange} value={field.value}>
								<FormControl>
									<SelectTrigger className="w-full">
										<SelectValue placeholder="Buenos Aires" />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									<SelectGroup>
										<SelectItem value="buenos-aires">Buenos Aires</SelectItem>
										<SelectItem value="caba">CABA</SelectItem>
										<SelectItem value="cordoba">Córdoba</SelectItem>
										<SelectItem value="santa-fe">Santa Fe</SelectItem>
										<SelectItem value="mendoza">Mendoza</SelectItem>
										<SelectItem value="tucuman">Tucumán</SelectItem>
										<SelectItem value="salta">Salta</SelectItem>
										<SelectItem value="entre-rios">Entre Ríos</SelectItem>
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
		</div>
	);
}
