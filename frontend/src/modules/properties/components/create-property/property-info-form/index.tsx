import { useState } from "react";

import { Button } from "@src/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@src/components/ui/command";
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@src/components/ui/form";
import { Input } from "@src/components/ui/input";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@src/components/ui/popover";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@src/components/ui/select";
import { cn } from "@src/lib/utils";
import type { Client } from "@src/types/client";
import type { PropertyForm } from "@src/types/property";
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";

type Props = {
	form: UseFormReturn<PropertyForm>;
	clients: Client[];
};

export default function PropertyBasicInfoForm({ form, clients }: Props) {
	const [open, setOpen] = useState(false);

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
										<SelectItem value="Casa">Casa</SelectItem>
										{/* <SelectItem value="apartment">Departamento</SelectItem>
										<SelectItem value="ph">PH</SelectItem>
										<SelectItem value="land">Terreno</SelectItem>
										<SelectItem value="commercial">Local comercial</SelectItem>
										<SelectItem value="office">Oficina</SelectItem> */}
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

				<FormField
					control={form.control}
					name="basic.owner_id"
					render={({ field }) => (
						<FormItem className="flex flex-col">
							<FormLabel>Propietario asignado</FormLabel>
							<Popover open={open} onOpenChange={setOpen}>
								<PopoverTrigger asChild>
									<FormControl>
										<Button
											variant="combobox"
											role="combobox"
											aria-expanded={open}
											className={cn(
												"w-full justify-between",
												field.value && "text-input-foreground",
											)}
										>
											{field.value
												? clients.find(
														(client) => client.id.toString() === field.value,
													)
													? `${
															clients.find(
																(client) =>
																	client.id.toString() === field.value,
															)?.name
														}`
													: "Seleccionar propietario"
												: "Seleccionar propietario"}
											<ChevronsUpDownIcon className="ml-2 size-5 shrink-0 text-input-foreground" />
										</Button>
									</FormControl>
								</PopoverTrigger>
								<PopoverContent className="w-full p-0">
									<Command
										defaultValue={
											field.value
												? `${
														clients.find(
															(client) => client.id.toString() === field.value,
														)?.name
													}`
												: undefined
										}
									>
										<CommandInput placeholder="Buscar propietario..." />
										<CommandList>
											<CommandEmpty>
												No se encontraron propietarios.
											</CommandEmpty>
											<CommandGroup>
												{clients.map((client) => (
													<CommandItem
														className="justify-between"
														value={`${client.name}`}
														key={client.id}
														onSelect={() => {
															form.setValue(
																"basic.owner_id",
																client.id.toString(),
																{ shouldValidate: true },
															);
															setOpen(false);
														}}
													>
														{client.name}
														<CheckIcon
															className={cn(
																"mr-2 h-4 w-4",
																client.id.toString() === field.value
																	? "opacity-100"
																	: "opacity-0",
															)}
														/>
													</CommandItem>
												))}
											</CommandGroup>
										</CommandList>
									</Command>
								</PopoverContent>
							</Popover>
							<FormMessage />
						</FormItem>
					)}
				/>
			</div>
		</div>
	);
}
