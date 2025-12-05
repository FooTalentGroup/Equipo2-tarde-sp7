import { cn } from "@src/lib/utils";

export function Section({
	title,
	children,
	className,
}: {
	title: string;
	children: React.ReactNode;
	className?: string;
}) {
	return (
		<div
			className={cn(
				"rounded-lg border shadow-sm bg-card overflow-hidden",
				className,
			)}
		>
			<div className="bg-tertiary-light px-6 py-3 border-b">
				<h3 className="text-heading font-semibold">{title}</h3>
			</div>
			<div className="p-6">{children}</div>
		</div>
	);
}
