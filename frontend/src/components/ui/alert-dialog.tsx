"use client";

import * as React from "react";

import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";
import { buttonVariants } from "@src/components/ui/button";
import { cn } from "@src/lib/utils";
import {
	AlertCircle,
	AlertTriangle,
	CheckCircle,
	InfoIcon,
	X,
} from "lucide-react";

const AlertDialogContext = React.createContext<{
	variant?: "default" | "destructive" | "warning" | "info" | "success";
}>({ variant: "default" });

function AlertDialog({
	...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Root>) {
	return <AlertDialogPrimitive.Root data-slot="alert-dialog" {...props} />;
}

function AlertDialogTrigger({
	...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Trigger>) {
	return (
		<AlertDialogPrimitive.Trigger data-slot="alert-dialog-trigger" {...props} />
	);
}

function AlertDialogPortal({
	...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Portal>) {
	return (
		<AlertDialogPrimitive.Portal data-slot="alert-dialog-portal" {...props} />
	);
}

function AlertDialogOverlay({
	className,
	...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Overlay>) {
	return (
		<AlertDialogPrimitive.Overlay
			data-slot="alert-dialog-overlay"
			className={cn(
				"data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
				className,
			)}
			{...props}
		/>
	);
}

const variantStyles = {
	default: {
		container: "",
		icon: null,
		iconClass: "",
	},
	destructive: {
		container: "bg-red-100",
		icon: AlertCircle,
		iconClass: "text-destructive-foreground",
	},
	warning: {
		container: "bg-amber-100",
		icon: AlertTriangle,
		iconClass: "text-amber-600",
	},
	info: {
		container: "bg-blue-100",
		icon: InfoIcon,
		iconClass: "text-blue-600",
	},
	success: {
		container: "bg-green-100",
		icon: CheckCircle,
		iconClass: "text-green-600",
	},
};

type AlertDialogContentProps = React.ComponentProps<
	typeof AlertDialogPrimitive.Content
> & {
	variant?: keyof typeof variantStyles;
};

function AlertDialogContent({
	className,
	children,
	variant = "destructive",
	...props
}: AlertDialogContentProps) {
	return (
		<AlertDialogPortal>
			<AlertDialogOverlay />
			<AlertDialogPrimitive.Content
				data-slot="alert-dialog-content"
				className={cn(
					"bg-card data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg",
					className,
				)}
				{...props}
			>
				<AlertDialogContext.Provider value={{ variant }}>
					{children}
					<AlertDialogPrimitive.Cancel asChild>
						<button
							type="button"
							className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
						>
							<X className="h-4 w-4" />
							<span className="sr-only">Close</span>
						</button>
					</AlertDialogPrimitive.Cancel>
				</AlertDialogContext.Provider>
			</AlertDialogPrimitive.Content>
		</AlertDialogPortal>
	);
}

function AlertDialogHeader({
	className,
	children,
	...props
}: React.ComponentProps<"div">) {
	const { variant } = React.useContext(AlertDialogContext);
	const activeVariant =
		variant && variantStyles[variant]
			? variantStyles[variant]
			: variantStyles.default;

	if (activeVariant.icon) {
		const { container, icon: Icon, iconClass } = activeVariant;
		return (
			<div className="flex gap-4" {...props}>
				<div
					className={cn(
						"flex h-10 w-10 shrink-0 items-center justify-center rounded-md sm:mx-0 sm:h-10 sm:w-10",
						container,
					)}
				>
					{Icon && (
						<Icon className={cn("h-6 w-6", iconClass)} aria-hidden="true" />
					)}
				</div>
				<div
					data-slot="alert-dialog-header"
					className={cn(
						"flex flex-col gap-2 text-start sm:text-left space-y-1",
						className,
					)}
				>
					{children}
				</div>
			</div>
		);
	}

	return (
		<div
			data-slot="alert-dialog-header"
			className={cn("flex flex-col gap-2 text-center sm:text-left", className)}
			{...props}
		>
			{children}
		</div>
	);
}

function AlertDialogFooter({
	className,
	...props
}: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="alert-dialog-footer"
			className={cn(
				"flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
				className,
			)}
			{...props}
		/>
	);
}

function AlertDialogTitle({
	className,
	...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Title>) {
	return (
		<AlertDialogPrimitive.Title
			data-slot="alert-dialog-title"
			className={cn("text-lg font-semibold", className)}
			{...props}
		/>
	);
}

function AlertDialogDescription({
	className,
	...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Description>) {
	return (
		<AlertDialogPrimitive.Description
			data-slot="alert-dialog-description"
			className={cn("text-muted-foreground text-sm", className)}
			{...props}
		/>
	);
}

function AlertDialogAction({
	className,
	...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Action>) {
	return (
		<AlertDialogPrimitive.Action
			className={cn(buttonVariants(), className)}
			{...props}
		/>
	);
}

function AlertDialogCancel({
	className,
	...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Cancel>) {
	return (
		<AlertDialogPrimitive.Cancel
			className={cn(buttonVariants({ variant: "outline" }), className)}
			{...props}
		/>
	);
}

export {
	AlertDialog,
	AlertDialogPortal,
	AlertDialogOverlay,
	AlertDialogTrigger,
	AlertDialogContent,
	AlertDialogHeader,
	AlertDialogFooter,
	AlertDialogTitle,
	AlertDialogDescription,
	AlertDialogAction,
	AlertDialogCancel,
};
