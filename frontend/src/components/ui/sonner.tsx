"use client";

import {
	CircleCheckIcon,
	InfoIcon,
	Loader2Icon,
	TriangleAlertIcon,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
	const { theme = "system" } = useTheme();

	return (
		<Sonner
			theme={theme as ToasterProps["theme"]}
			className="toaster group"
			position="top-center"
			toastOptions={{
				classNames: {
					success:
						"border-success-normal! border! bg-success! text-success-foreground! px-[17px]! py-[15px]!",
					error:
						"px-[17px]! py-[15px]! border-danger-normal! border! bg-danger-light! text-danger-dark!",
					warning:
						"px-[17px]! py-[15px]! border-attention! border! bg-attention-light! text-attention-dark!",
				},
			}}
			icons={{
				success: <CircleCheckIcon className="size-4" />,
				info: <InfoIcon className="size-4" />,
				warning: <TriangleAlertIcon className="size-4" />,
				error: <InfoIcon className="size-4" />,
				loading: <Loader2Icon className="size-4 animate-spin" />,
			}}
			style={
				{
					"--normal-bg": "var(--popover)",
					"--normal-text": "var(--popover-foreground)",
					"--normal-border": "var(--border)",
					"--border-radius": "var(--radius)",
				} as React.CSSProperties
			}
			{...props}
		/>
	);
};

export { Toaster };
