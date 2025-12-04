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
import { PROPERTY_TYPE } from "@src/modules/properties/consts";
import type { Owner } from "@src/types/clients/owner";
import type { PropertyForm } from "@src/types/property";
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";

type Props = {
	form: UseFormReturn<PropertyForm>;
	clients: Owner[];
};

export default function PropertyBasicInfoForm({ form, clients }: Props) {
	const [open, setOpen] = useState(false);

	const getClientFullName = (clientId: string | undefined) => {
		if (!clientId) return "Seleccionar propietario";

		const client = clients.find((c) => c.id.toString() === clientId);

		if (client) {
			return `${client.first_name} ${client.last_name}`;
		}

		return "Seleccionar propietario";
	};

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

				<FormField
					control={form.control}
					name="basic.owner_id"
					render={({ field }) => {
						const selectedClient = clients.find(
							(c) => c.id.toString() === field.value,
						);

						const buttonText = selectedClient
							? `${selectedClient.first_name} ${selectedClient.last_name}`
							: "Seleccionar propietario";

						return (
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
												{buttonText}
												<ChevronsUpDownIcon className="ml-2 size-5 shrink-0 text-input-foreground" />
											</Button>
										</FormControl>
									</PopoverTrigger>
									<PopoverContent className="w-full p-0">
										<Command>
											<CommandInput placeholder="Buscar propietario..." />
											<CommandList>
												<CommandEmpty></CommandEmpty>

												<CommandGroup>
													{clients.map((client) => {
														const clientFullName = `${client.first_name} ${client.last_name}`;

														return (
															<CommandItem
																className="justify-between"
																value={client.id.toString()}
																key={client.id}
																onSelect={(_currentValue) => {
																	form.setValue(
																		"basic.owner_id",
																		client.id.toString(),
																		{ shouldValidate: true },
																	);
																	setOpen(false);
																}}
															>
																  {clientFullName} 
																<CheckIcon
																	className={cn(
																		"mr-2 h-4 w-4",
																		client.id.toString() === field.value
																			? "opacity-100"
																			: "opacity-0",
																	)}
																/>
															</CommandItem>
														);
													})}
												</CommandGroup>
											</CommandList>
										</Command>
									</PopoverContent>
								</Popover>
								<FormMessage />
							</FormItem>
						);
					}}
				/>
			</div>
		</div>
	);
}
