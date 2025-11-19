import type { ElementType, ReactNode } from "react";

import { cn } from "@src/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const textVariants = cva("font-sans", {
	variants: {
		variant: {
			large: "text-[1.125rem] leading-[1.2]", // 18px
			body: "text-[1rem] leading-[1.2]", // 16px
			small: "text-[0.875rem] leading-[1.2]", // 14px
			tiny: "text-[0.75rem] leading-[1.2]", // 12px
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
		decoration: {
			underline: "underline",
			overline: "overline",
			"line-through": "line-through",
			none: "no-underline",
		},
		truncate: {
			true: "truncate",
			false: "",
		},
	},
	defaultVariants: {
		variant: "body",
	},
});

type TextProps = {
	children: ReactNode;
	className?: string;
	as?: ElementType;
	href?: string;
} & VariantProps<typeof textVariants>;

function Text({
	variant,
	align,
	weight,
	transform,
	decoration,
	truncate,
	children,
	className,
	href,
	as: Tag = "p",
}: TextProps) {
	return (
		<Tag
			className={cn(
				textVariants({
					variant,
					align,
					weight,
					transform,
					decoration,
					truncate,
					className,
				}),
			)}
			href={href}
		>
			{children}
		</Tag>
	);
}

export { Text, textVariants };
