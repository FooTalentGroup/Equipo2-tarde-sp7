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
import type { Property } from "@src/types/property";
import type { UseFormReturn } from "react-hook-form";

interface PropertyCharacteristicsProps {
	form: UseFormReturn<Property>;
}

export default function PropertyFeaturesForm({
	form,
}: PropertyCharacteristicsProps) {
	return (
		<div className="grid grid-cols-2 gap-10 items-start">
			{/* Columna izquierda */}
			<div className="grid gap-4">
				<FormField
					control={form.control}
					name="characteristics.rooms_count"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Ambientes</FormLabel>
							<FormControl>
								<Input type="number" placeholder="3" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="characteristics.bedrooms_count"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Dormitorios</FormLabel>
							<FormControl>
								<Input type="number" placeholder="1" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="characteristics.bathrooms_count"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Baños</FormLabel>
							<FormControl>
								<Input type="number" placeholder="1" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="characteristics.toilets_count"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Toilettes</FormLabel>
							<FormControl>
								<Input type="number" placeholder="1" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="characteristics.parking_spaces_count"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Cocheras</FormLabel>
							<FormControl>
								<Input type="number" placeholder="1" {...field} />
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
					name="characteristics.floors_count"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Plantas</FormLabel>
							<FormControl>
								<Input type="number" placeholder="1" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="characteristics.age"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Antigüedad</FormLabel>
							<Select onValueChange={field.onChange} value={field.value}>
								<FormControl>
									<SelectTrigger className="w-full">
										<SelectValue placeholder="Seleccionar" />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									<SelectGroup>
										<SelectItem value="A estrenar">A estrenar</SelectItem>
										<SelectItem value="1 - 5 años">1 - 5 años</SelectItem>
										<SelectItem value="4 - 10 años">4 - 10 años</SelectItem>
										<SelectItem value="11 - 20 años">11 - 20 años</SelectItem>
										<SelectItem value="Más de 20 años">
											Más de 20 años
										</SelectItem>
									</SelectGroup>
								</SelectContent>
							</Select>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="characteristics.orientation"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Orientación</FormLabel>
							<Select onValueChange={field.onChange} value={field.value}>
								<FormControl>
									<SelectTrigger className="w-full">
										<SelectValue placeholder="Seleccionar" />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									<SelectGroup>
										<SelectItem value="north">Norte</SelectItem>
										<SelectItem value="south">Sur</SelectItem>
										<SelectItem value="east">Este</SelectItem>
										<SelectItem value="west">Oeste</SelectItem>
										<SelectItem value="northeast">Noreste</SelectItem>
										<SelectItem value="northwest">Noroeste</SelectItem>
										<SelectItem value="southeast">Sureste</SelectItem>
										<SelectItem value="southwest">Suroeste</SelectItem>
									</SelectGroup>
								</SelectContent>
							</Select>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="characteristics.disposition"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Disposición</FormLabel>
							<Select onValueChange={field.onChange} value={field.value}>
								<FormControl>
									<SelectTrigger className="w-full">
										<SelectValue placeholder="Seleccionar" />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									<SelectGroup>
										<SelectItem value="front">Frente</SelectItem>
										<SelectItem value="rear">Contrafrente</SelectItem>
										<SelectItem value="internal">Interna</SelectItem>
										<SelectItem value="side">Lateral</SelectItem>
									</SelectGroup>
								</SelectContent>
							</Select>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="characteristics.situation"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Situación</FormLabel>
							<Select onValueChange={field.onChange} value={field.value}>
								<FormControl>
									<SelectTrigger className="w-full">
										<SelectValue placeholder="Seleccionar" />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									<SelectGroup>
										<SelectItem value="front">Frente</SelectItem>
										<SelectItem value="back">Contrafrente</SelectItem>
										<SelectItem value="internal">Interno</SelectItem>
										<SelectItem value="lateral">Lateral</SelectItem>
									</SelectGroup>
								</SelectContent>
							</Select>
							<FormMessage />
						</FormItem>
					)}
				/>
			</div>
		</div>
	);
}
