"use client";

import type * as React from "react";

import * as SwitchPrimitive from "@radix-ui/react-switch";
import { cn } from "@src/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const switchVariants = cva(
	"peer inline-flex shrink-0 items-center rounded-full border border-transparent shadow-xs transition-all outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-blue-normal data-[state=unchecked]:bg-grey-light",
	{
		variants: {
			size: {
				default: "w-12 h-7",
				sm: "w-7 h-[14px]",
			},
		},
		defaultVariants: {
			size: "default",
		},
	},
);

const switchThumbVariants = cva(
	"pointer-events-none block rounded-full bg-card shadow-lg ring-0 transition-transform",
	{
		variants: {
			size: {
				default:
					"size-5 data-[state=checked]:translate-x-6 data-[state=unchecked]:translate-x-1",
				sm: "size-3 data-[state=checked]:translate-x-3.5 data-[state=unchecked]:translate-x-0.5",
			},
		},
		defaultVariants: {
			size: "default",
		},
	},
);

function Switch({
	className,
	size,
	...props
}: React.ComponentProps<typeof SwitchPrimitive.Root> &
	VariantProps<typeof switchVariants>) {
	return (
		<SwitchPrimitive.Root
			data-slot="switch"
			className={cn(switchVariants({ size, className }))}
			{...props}
		>
			<SwitchPrimitive.Thumb
				data-slot="switch-thumb"
				className={cn(switchThumbVariants({ size }))}
			/>
		</SwitchPrimitive.Root>
	);
}

export { Switch };
