"use client";

import * as React from "react";

import { Badge } from "@src/components/ui/badge";
import {
	Command,
	CommandGroup,
	CommandItem,
	CommandList,
} from "@src/components/ui/command";
import { Command as CommandPrimitive } from "cmdk";
import { X } from "lucide-react";

export type Option = Record<"value" | "label", string>;

interface FancyMultiSelectProps {
	options: Option[];
	value: string[];
	onChange: (value: string[]) => void;
	placeholder?: string;
	className?: string;
}

export function FancyMultiSelect({
	options,
	value,
	onChange,
	placeholder,
	className,
}: FancyMultiSelectProps) {
	const inputRef = React.useRef<HTMLInputElement>(null);
	const [open, setOpen] = React.useState(false);
	const [inputValue, setInputValue] = React.useState("");

	const selected = (value || []).map((v) => {
		const option = options.find((opt) => opt.value === v);
		return option || { value: v, label: v };
	});

	const handleUnselect = React.useCallback(
		(option: Option) => {
			onChange((value || []).filter((s) => s !== option.value));
		},
		[value, onChange],
	);

	const handleKeyDown = React.useCallback(
		(e: React.KeyboardEvent<HTMLDivElement>) => {
			const input = inputRef.current;
			if (input) {
				if (e.key === "Delete" || e.key === "Backspace") {
					if (input.value === "") {
						const newSelected = [...(value || [])];
						newSelected.pop();
						onChange(newSelected);
					}
				}
				// This is not a default behaviour of the <input /> field
				if (e.key === "Escape") {
					input.blur();
				}

				if (e.key === "Enter") {
					const trimmedValue = input.value.trim();
					if (trimmedValue) {
						// Prevent adding if already selected
						if ((value || []).includes(trimmedValue)) {
							setInputValue("");
							return;
						}

						// Check if there are any matching selectables
						const currentSelectables = options.filter(
							(option) => !(value || []).includes(option.value),
						);
						const hasMatch = currentSelectables.some((opt) =>
							opt.label.toLowerCase().includes(trimmedValue.toLowerCase()),
						);

						if (!hasMatch) {
							e.preventDefault();
							onChange([...(value || []), trimmedValue]);
							setInputValue("");
						}
					}
				}
			}
		},
		[value, onChange, options],
	);

	const selectables = options.filter(
		(option) => !(value || []).includes(option.value),
	);

	return (
		<Command
			onKeyDown={handleKeyDown}
			className="overflow-visible bg-transparent"
		>
			<div
				className={
					className
						? `${className} group rounded-md border border-input-border px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2`
						: "group rounded-md border border-input-border px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
				}
			>
				<div className="flex flex-wrap gap-1">
					{selected.map((option) => {
						return (
							<Badge key={option.value} variant="secondary">
								{option.label}
								<button
									type="button"
									className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
									onKeyDown={(e) => {
										if (e.key === "Enter") {
											handleUnselect(option);
										}
									}}
									onMouseDown={(e) => {
										e.preventDefault();
										e.stopPropagation();
									}}
									onClick={() => handleUnselect(option)}
								>
									<X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
								</button>
							</Badge>
						);
					})}
					{/* Avoid having the "Search" Icon */}
					<CommandPrimitive.Input
						ref={inputRef}
						value={inputValue}
						onValueChange={setInputValue}
						onBlur={() => setOpen(false)}
						onFocus={() => setOpen(true)}
						placeholder={placeholder || "Select..."}
						className="ml-2 flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
					/>
				</div>
			</div>
			<div className="relative mt-2">
				<CommandList>
					{open && selectables.length > 0 ? (
						<div className="absolute top-0 z-10 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
							<CommandGroup className="h-full overflow-auto max-h-60">
								{selectables.map((option) => {
									return (
										<CommandItem
											key={option.value}
											onMouseDown={(e) => {
												e.preventDefault();
												e.stopPropagation();
											}}
											onSelect={(_value) => {
												setInputValue("");
												onChange([...value, option.value]);
											}}
											className={"cursor-pointer"}
										>
											{option.label}
										</CommandItem>
									);
								})}
							</CommandGroup>
						</div>
					) : null}
				</CommandList>
			</div>
		</Command>
	);
}
