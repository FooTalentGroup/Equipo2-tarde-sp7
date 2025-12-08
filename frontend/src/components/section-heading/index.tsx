import type { ReactNode } from "react";

import { Heading } from "@src/components/ui/heading";
import { Separator } from "@src/components/ui/separator";

type SectionHeadingProps = {
	title: string;
	description?: string;
	actions?: ReactNode;
	separator?: boolean;
};

export default function SectionHeading({
	title,
	description,
	actions,
	separator = true,
}: SectionHeadingProps) {
	return (
		<>
			<section className="flex items-center gap-4 justify-between h-12">
				<div className="flex flex-col gap-1">
					<Heading variant="h3" weight="semibold" className="text-secondary">
						{title}
					</Heading>
					{description && (
						<p className="text-sm text-muted-foreground">{description}</p>
					)}
				</div>

				{actions && <div className="flex items-center gap-3">{actions}</div>}
			</section>
			{separator && <Separator className="" />}
		</>
	);
}
