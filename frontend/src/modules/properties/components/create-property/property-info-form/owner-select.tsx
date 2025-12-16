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
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@src/components/ui/popover";
import { Skeleton } from "@src/components/ui/skeleton";
import { ContactCategory } from "@src/enums/contact-category";
import { cn } from "@src/lib/utils";
import { getClients } from "@src/modules/properties/services/client-service";
import type { PropertyForm } from "@src/types/property";
import { useQuery } from "@tanstack/react-query";
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";

type Props = {
	form: UseFormReturn<PropertyForm>;
};

export default function OwnerSelect({ form }: Props) {
	const [open, setOpen] = useState(false);

	const { data, isLoading } = useQuery({
		queryKey: ["clients", "owners"],
		queryFn: () => getClients({ contact_category_id: ContactCategory.OWNER }),
	});

	const clients = data?.clients || [];

	if (isLoading) {
		return (
			<div className="space-y-2">
				<FormLabel required>Propietario asignado</FormLabel>
				<Skeleton className="h-10 w-full" />
			</div>
		);
	}

	return (
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
						<FormLabel required>Propietario asignado</FormLabel>
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
										<CommandEmpty>
											N o se encontraron propietarios.
										</CommandEmpty>

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
																{
																	shouldValidate: true,
																},
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
	);
}
