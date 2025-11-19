import type { ElementType, HTMLAttributes, ReactNode } from "react";

import { cn } from "@src/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const MainLayoutVariants = cva(
	"mx-auto block w-full px-4 xxl:w-[calc(100%-120px)] lg:w-[calc(100%-80px)] md:w-[calc(100%-80px)] md:px-0",
	{
		variants: {
			size: {
				xxl: "max-w-[1520px]",
				xl: "max-w-[1400px]",
				lg: "max-w-[1240px]",
				md: "max-w-[900px]",
				sm: "max-w-[550px]",
			},
		},
	},
);

export interface MainLayoutProps
	extends HTMLAttributes<HTMLElement>,
		VariantProps<typeof MainLayoutVariants> {
	as?: ElementType;
	children?: ReactNode;
	className?: string;
}

export default function MainLayout({
	as = "div",
	children,
	className,
	size = "lg",
}: MainLayoutProps) {
	const Tag = as;

	return (
		<Tag className={cn(MainLayoutVariants({ size, className }))}>
			{children}
		</Tag>
	);
}
