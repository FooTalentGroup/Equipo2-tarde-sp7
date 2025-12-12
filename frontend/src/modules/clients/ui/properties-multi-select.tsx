"use client";

import {
	FancyMultiSelect,
	type Option,
} from "@src/components/ui/fancy-multi-select";
import type { Property } from "@src/types/property";

type Props = {
	availableProperties: Property[];
	value: string[];
	onChange: (ids: string[]) => void;
	placeholder?: string;
	className?: string;
};

export default function PropertiesMultiSelect({
	availableProperties,
	value,
	onChange,
	placeholder = "Seleccionar propiedades...",
	className,
}: Props) {
	const options: Option[] = availableProperties.map((p) => ({
		value: String(p.id),
		label: `${p.main_address.full_address}`,
	}));

	return (
		<FancyMultiSelect
			options={options}
			value={value || []}
			onChange={onChange}
			placeholder={placeholder}
			className={className}
		/>
	);
}
