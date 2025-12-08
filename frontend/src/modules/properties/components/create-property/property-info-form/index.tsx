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
import { PROPERTY_TYPE } from "@src/modules/properties/consts";
import type { PropertyForm } from "@src/types/property";
import type { UseFormReturn } from "react-hook-form";

import OwnerSelect from "./owner-select";

type Props = {
	form: UseFormReturn<PropertyForm>;
};

export default function PropertyBasicInfoForm({ form }: Props) {
	return (
		<div className="grid grid-cols-2 gap-10 items-start">
			<div className="grid gap-4">
				<FormField
					control={form.control}
					name="basic.title"
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
					name="basic.property_type"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Tipo de propiedad</FormLabel>
							<Select onValueChange={field.onChange} value={field.value}>
								<FormControl>
									<SelectTrigger className="w-full">
										<SelectValue placeholder="Seleccionar tipo" />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									<SelectGroup>
										{PROPERTY_TYPE.map((type, index) => (
											<SelectItem
												key={`${type.label}-${index}`}
												value={type.value}
											>
												{type.label}
											</SelectItem>
										))}
									</SelectGroup>
								</SelectContent>
							</Select>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="address.street"
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
					name="address.floor"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Piso/Unidad</FormLabel>
							<FormControl>
								<Input placeholder="4B" type="string" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="address.postal_code"
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
					name="geography.country"
					render={({ field }) => (
						<FormItem>
							<FormLabel>País</FormLabel>
							<Select onValueChange={field.onChange} value={field.value}>
								<FormControl>
									<SelectTrigger className="w-full">
										<SelectValue placeholder="Seleccionar país" />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									<SelectGroup>
										<SelectItem value="Argentina">Argentina</SelectItem>
									</SelectGroup>
								</SelectContent>
							</Select>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="geography.province"
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
					name="geography.city"
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

				<OwnerSelect form={form} />
			</div>
		</div>
	);
}
