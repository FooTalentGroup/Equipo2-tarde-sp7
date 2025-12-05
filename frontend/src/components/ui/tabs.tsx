"use client";

import type * as React from "react";

import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "@src/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const tabsVariants = cva("flex flex-col gap-2", {
	variants: {
		variant: {
			default: "",
		},
	},
	defaultVariants: {
		variant: "default",
	},
});

function Tabs({
	className,
	variant,
	...props
}: React.ComponentProps<typeof TabsPrimitive.Root> &
	VariantProps<typeof tabsVariants>) {
	return (
		<TabsPrimitive.Root
			data-slot="tabs"
			className={cn(tabsVariants({ variant, className }))}
			{...props}
		/>
	);
}

const tabsListVariants = cva(
	"inline-flex items-center justify-center rounded-md",
	{
		variants: {
			variant: {
				default: "bg-muted text-muted-foreground p-1",
				blue: "bg-transparent px-0",
			},
			size: {
				default: "h-10 w-fit",
				lg: "h-12 w-fit",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	},
);

function TabsList({
	className,
	variant,
	size,
	...props
}: React.ComponentProps<typeof TabsPrimitive.List> &
	VariantProps<typeof tabsListVariants>) {
	return (
		<TabsPrimitive.List
			data-slot="tabs-list"
			className={cn(tabsListVariants({ variant, size, className }))}
			{...props}
		/>
	);
}

const tabsTriggerVariants = cva(
	"inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-md text-sm font-medium transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
	{
		variants: {
			variant: {
				default:
					"data-[state=active]:bg-card text-foreground border border-transparent data-[state=active]:shadow-sm",
				blue: "bg-tertiary text-tertiary-foreground rounded-none border border-transparent data-[state=active]:border-b-card border-b-2 border-b-transparent first:rounded-tl-lg last:rounded-tr-lg",
			},
			size: {
				default: "h-[calc(100%-1px)] flex-1 px-2 py-1",
				lg: "h-12 flex-1 px-2 py-1",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	},
);

function TabsTrigger({
	className,
	variant,
	size,
	...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger> &
	VariantProps<typeof tabsTriggerVariants>) {
	return (
		<TabsPrimitive.Trigger
			data-slot="tabs-trigger"
			className={cn(tabsTriggerVariants({ variant, size, className }))}
			{...props}
		/>
	);
}

const tabsContentVariants = cva("flex-1 outline-none", {
	variants: {
		variant: {
			default: "",
		},
	},
	defaultVariants: {
		variant: "default",
	},
});

function TabsContent({
	className,
	variant,
	...props
}: React.ComponentProps<typeof TabsPrimitive.Content> &
	VariantProps<typeof tabsContentVariants>) {
	return (
		<TabsPrimitive.Content
			data-slot="tabs-content"
			className={cn(tabsContentVariants({ variant, className }))}
			{...props}
		/>
	);
}

export {
	Tabs,
	TabsList,
	TabsTrigger,
	TabsContent,
	tabsVariants,
	tabsListVariants,
	tabsTriggerVariants,
	tabsContentVariants,
};
