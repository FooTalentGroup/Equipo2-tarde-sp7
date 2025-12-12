import { cn } from "@src/lib/utils";
import { ImageOff } from "lucide-react";

interface ImagePlaceholderProps extends React.HTMLAttributes<HTMLDivElement> {
	icon?: React.ElementType;
	iconSize?: string;
}

export function ImagePlaceholder({
	className,
	icon: Icon = ImageOff,
	iconSize = "h-10 w-10",
	...props
}: ImagePlaceholderProps) {
	return (
		<div
			className={cn(
				"flex h-full w-full items-center justify-center rounded-lg border border-primary bg-white text-primary",
				className,
			)}
			{...props}
		>
			<Icon className={iconSize} />
		</div>
	);
}
