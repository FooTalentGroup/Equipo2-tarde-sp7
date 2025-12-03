import { cn } from "@src/lib/utils";

type Props = Omit<React.ComponentProps<"input">, "size"> & {
	size?: "default" | "lg" | "sm";
};

function Input({ className, type, size = "default", ...props }: Props) {
	return (
		<input
			type={type}
			data-slot="input"
			data-size={size}
			className={cn(
				"file:text-foreground bg-card placeholder:text-input-placeholder text-input-foreground selection:bg-primary selection:text-primary-foreground border-input-border h-12 w-full min-w-0 rounded-md border px-3 py-1 text-base transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-100 md:text-sm",
				"focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
				"aria-invalid:ring-destructive-foreground/20 aria-invalid:border-destructive-foreground",
				"data-[size=sm]:h-8 data-[size=lg]:h-12 data-[size=default]:h-10",
				className,
			)}
			{...props}
		/>
	);
}

export { Input };
