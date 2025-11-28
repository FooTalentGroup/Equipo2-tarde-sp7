import type * as React from "react";

import { Slot } from "@radix-ui/react-slot";
import { cn } from "@src/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const badgeVariants = cva(
	"inline-flex items-center justify-center rounded-sm border px-2 py-1 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 transition-[color,box-shadow] overflow-hidden",
	{
		variants: {
			variant: {
				ghost:
					"border-transparent bg-transparent text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
				default:
					"border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
				secondary:
					"border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
				success:
					"border-success-border border bg-success text-success-foreground [a&]:hover:bg-success/90",
				destructive:
					"border-destructive-border border bg-destructive text-destructive-foreground [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 ",
				white: "border border-white bg-white text-foreground shadow-md",
				outline:
					"text-foreground border border-border [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
				tertiary:
					"border-transparent bg-tertiary text-tertiary-foreground [a&]:hover:bg-tertiary/90",
			},
			size: {
				default: "h-7",
				sm: "h-6",
				lg: "h-9 text-sm",
			},
		},
		defaultVariants: {
			variant: "default",
		},
	},
);

function Badge({
	className,
	variant,
	size,
	asChild = false,
	...props
}: React.ComponentProps<"span"> &
	VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
	const Comp = asChild ? Slot : "span";

	return (
		<Comp
			data-slot="badge"
			className={cn(badgeVariants({ variant, size }), className)}
			{...props}
		/>
	);
}

export { Badge, badgeVariants };
