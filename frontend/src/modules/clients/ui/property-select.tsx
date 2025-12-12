"use client";

import { useMemo, useState } from "react";

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
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@src/components/ui/popover";
import { cn } from "@src/lib/utils";
import type { Property } from "@src/types/property";
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";

type PropertySelectProps = {
	availableProperties: Property[];
	operationTypes?: number[]; // [1] = venta, [2] = alquiler, [1,2] = ambas
	value?: string;
	onChange: (propertyId: string, property: Property) => void;
	placeholder?: string;
	className?: string;
};

export default function PropertySelect({
	availableProperties,
	operationTypes = [1, 2],
	value = "",
	onChange,
	placeholder = "Seleccionar propiedad",
	className = "",
}: PropertySelectProps) {
	const [open, setOpen] = useState(false);

	// Filtrar propiedades por tipo de operación, estado y visibilidad
	const filteredProperties = useMemo(() => {
		return availableProperties.filter(
			(property) =>
				property.property_status?.id === 1 &&
				property.visibility_status?.id === 1 &&
				operationTypes.includes(property.main_price?.operation_type?.id ?? 0),
		);
	}, [availableProperties, operationTypes]);

	// Mostrar la propiedad seleccionada aunque esté fuera del filtro
	const selectedProperty = availableProperties.find(
		(p) => p.id.toString() === value,
	);

	const buttonText = selectedProperty
		? selectedProperty.main_address.full_address
		: placeholder;

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="combobox"
					role="combobox"
					aria-expanded={open}
					className={cn(
						"w-full justify-between border-input-border/60 rounded-lg",
						value && "text-input-foreground",
						!value && "text-grey-light",
						className,
					)}
				>
					{buttonText}
					<ChevronsUpDownIcon className="ml-2 size-5 shrink-0 text-input-foreground" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="p-0" sideOffset={4}>
				<Command className="w-full">
					<CommandInput placeholder="Buscar propiedad..." />
					<CommandList className="max-h-[300px]">
						<CommandEmpty>No se encontraron propiedades.</CommandEmpty>

						<CommandGroup>
							{filteredProperties.map((property) => (
								<CommandItem
									className="justify-between truncate"
									value={property.id.toString()}
									key={property.id}
									onSelect={() => {
										onChange(property.id.toString(), property);
										setOpen(false);
									}}
								>
									<div className="flex flex-col items-start min-w-0 flex-1">
										<span className="font-medium truncate">
											{property.main_address.full_address}
										</span>
										{/* <span className="font-medium truncate">
                      {property.title}
                    </span>
                    {property.main_address?.full_address && (
                      <span className="text-xs text-muted-foreground truncate">
                        {property.main_address.full_address}
                      </span>
                    )} */}
									</div>
									<CheckIcon
										className={cn(
											"ml-2 h-4 w-4 shrink-0",
											property.id.toString() === value
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
	);
}
