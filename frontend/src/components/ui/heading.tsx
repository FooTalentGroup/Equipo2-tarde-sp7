import type { ElementType, ReactNode } from "react";

import { cn } from "@src/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const headingVariants = cva("font-bold font-mono text-heading", {
	variants: {
		variant: {
			h1: "text-[3.3125rem] leading-[1.2]", // 53px
			h2: "text-[2.5rem] leading-[1.2]", // 40px
			h3: "text-[1.9375rem] leading-[1.2]", // 31px
			subtitle1: "text-[1.5rem] leading-[1.2]", // 24px
			subtitle2: "text-[1.25rem] leading-[1.2]", // 20px
			subtitle3: "text-[1rem] leading-[1.2]", // 16px
		},
		align: {
			left: "text-left",
			center: "text-center",
			right: "text-right",
			justify: "text-justify",
		},
		weight: {
			thin: "font-thin",
			extralight: "font-extralight",
			light: "font-light",
			normal: "font-normal",
			medium: "font-medium",
			semibold: "font-semibold",
			bold: "font-bold",
			extrabold: "font-extrabold",
			black: "font-black",
		},
		transform: {
			uppercase: "uppercase",
			lowercase: "lowercase",
			capitalize: "capitalize",
			normal: "normal-case",
		},
		truncate: {
			true: "truncate",
			false: "",
		},
	},
	defaultVariants: {
		variant: "h1",
		weight: "bold",
	},
});

type HeadingProps = {
	children: ReactNode;
	className?: string;
	as?: ElementType;
} & VariantProps<typeof headingVariants>;

function Heading({
	variant,
	align,
	weight,
	transform,
	truncate,
	children,
	className,
	as: Tag = "h1",
}: HeadingProps) {
	return (
		<Tag
			className={cn(
				headingVariants({
					variant,
					align,
					weight,
					transform,
					truncate,
					className,
				}),
			)}
		>
			{children}
		</Tag>
	);
}

export { Heading, headingVariants };
