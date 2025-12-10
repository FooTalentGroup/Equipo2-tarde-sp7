"use client";

import { Button } from "@src/components/ui/button";
import { Calendar } from "@src/components/ui/calendar";
import {
	FormControl,
	FormItem,
	FormLabel,
	FormMessageWithIcon,
} from "@src/components/ui/form";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@src/components/ui/popover";
import { cn } from "@src/lib/utils";
import { format, formatISO, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";

type DatePickerFieldProps = {
	value: string;
	onChange: (value: string) => void;
	label: string;
	placeholder?: string;
	required?: boolean;
};

export default function DatePickerField({
	value,
	onChange,
	label,
	placeholder = "dd/mm/aaaa",
	required = false,
}: DatePickerFieldProps) {
	return (
		<FormItem className="flex flex-col">
			<FormLabel className="text-secondary-dark font-semibold">
				{label} {required && <span className="text-danger-normal">*</span>}
			</FormLabel>
			<Popover>
				<PopoverTrigger asChild>
					<FormControl>
						<Button
							variant="outline"
							className={cn(
								"h-10 pl-3 text-left font-normal border-input-border/70 hover:bg-transparent hover:border-input-active rounded-lg",
								!value && "text-grey-light",
							)}
						>
							{value ? (
								format(parseISO(value), "dd/MM/yyyy", { locale: es })
							) : (
								<span>{placeholder}</span>
							)}
							<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
						</Button>
					</FormControl>
				</PopoverTrigger>
				<PopoverContent className="w-full p-0 flex justify-center" align="end">
					<Calendar
						mode="single"
						selected={value ? parseISO(value) : undefined}
						onSelect={(date) =>
							onChange(date ? formatISO(date, { representation: "date" }) : "")
						}
						locale={es}
						initialFocus
					/>
				</PopoverContent>
			</Popover>
			<FormMessageWithIcon className="text-xs" />
		</FormItem>
	);
}
