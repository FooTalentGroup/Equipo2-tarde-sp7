import type * as React from "react";

import { Badge } from "@src/components/ui/badge";
import { cn } from "@src/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const statusBadgeVariants = cva("", {
	variants: {
		status: {
			lead: "border-[#B8C3CF] bg-[#E8ECF0] text-[#0C1B2D] rounded-full",
			inquilino: "border-[#00B88A] bg-[#E6F8F3] text-[#004030] rounded-full",
			propietario: "border-[#FFE9C1] bg-[#FFF8EB] text-[#BF8B2A] rounded-full",
		},
	},
});

interface StatusBadgeProps
	extends Omit<React.ComponentProps<typeof Badge>, "variant">,
		VariantProps<typeof statusBadgeVariants> {
	status: "lead" | "inquilino" | "propietario";
}

function StatusBadge({ className, status, ...props }: StatusBadgeProps) {
	return (
		<Badge
			className={cn(statusBadgeVariants({ status }), className)}
			{...props}
		/>
	);
}

export { StatusBadge, statusBadgeVariants };
