import type * as React from "react";

import { Slot } from "@radix-ui/react-slot";
import { cn } from "@src/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const buttonVariants = cva(
	"inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive-foreground text-wrap",
	{
		variants: {
			variant: {
				default: "bg-primary text-primary-foreground hover:bg-primary-hover",
				combobox:
					"bg-transparent text-input-placeholder border-input-border border text-sm!	px-3!",
				destructive:
					"bg-destructive-foreground text-destructive text-whitefocus-visible:ring-destructive-foreground/20 ",
				outline:
					"border bg-transparent text-secondary shadow-xs border-secondary hover:bg-outline-hover hover:text-secondary",
				secondary:
					"bg-secondary text-secondary-foreground hover:bg-secondary-hover",
				tertiary:
					"bg-tertiary text-tertiary-foreground hover:bg-tertiary-hover",
				ghost: "hover:bg-accent hover:text-accent-foreground",
				"ghost-blue":
					"hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
				link: "text-primary underline-offset-4 hover:underline",
			},
			size: {
				default: "h-10 px-4 py-2 has-[>svg]:px-3",
				sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
				lg: "h-12 rounded-md px-6 has-[>svg]:px-6 text-base",
				icon: "size-9",
				"icon-sm": "size-8",
				"icon-lg": "size-12",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	},
);

function Button({
	className,
	variant,
	size,
	asChild = false,
	...props
}: React.ComponentProps<"button"> &
	VariantProps<typeof buttonVariants> & {
		asChild?: boolean;
	}) {
	const Comp = asChild ? Slot : "button";

	return (
		<Comp
			data-slot="button"
			className={cn(buttonVariants({ variant, size, className }))}
			{...props}
		/>
	);
}

export { Button, buttonVariants };
