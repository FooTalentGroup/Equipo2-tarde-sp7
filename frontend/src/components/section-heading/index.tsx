"use client";

import type { ReactNode } from "react";

import { useRouter } from "next/navigation";

import { Heading } from "@src/components/ui/heading";
import { Separator } from "@src/components/ui/separator";
import { ArrowLeft } from "lucide-react";

import { Button } from "../ui/button";

type SectionHeadingProps = {
	title: string;
	description?: string;
	actions?: ReactNode;
	separator?: boolean;
	className?: string;
	showBackButton?: boolean;
};

export default function SectionHeading({
	title,
	description,
	actions,
	separator = true,
	showBackButton = false,
}: SectionHeadingProps) {
	const router = useRouter();

	return (
		<>
			<section className="flex items-center gap-4 justify-between h-10">
				<div className="flex items-center gap-2">
					{showBackButton && (
						<Button variant="ghost" size="icon" onClick={() => router.back()}>
							<ArrowLeft className="size-6" />
						</Button>
					)}
					<div className="flex flex-col gap-1">
						<Heading variant="h3" weight="semibold" className="text-secondary">
							{title}
						</Heading>
						{description && (
							<p className="text-sm text-muted-foreground">{description}</p>
						)}
					</div>
				</div>

				{actions && <div className="flex items-center gap-3">{actions}</div>}
			</section>
			{separator && <Separator className="" />}
		</>
	);
}
