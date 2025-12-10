import { Heading } from "@src/components/ui/heading";
import { Text } from "@src/components/ui/text";
import { cn } from "@src/lib/utils";
import type { InfoCardProps } from "@src/modules/dashboard/types";
export const InfoAgentsCard = ({
	icon: Icon,
	title,
	description,
	className,
}: InfoCardProps) => {
	return (
		<article
			className={cn(
				"shadow-consultations h-40 w-[255px] py-6 pl-6 pb-[17px] space-y-4 rounded-md",
				className,
			)}
		>
			<Icon className="rounded-md w-12 h-12 p-3" />
			<div>
				<Heading variant="h3" weight={"medium"} className="text-black">
					{title}
				</Heading>
				<Text className="text-black">{description}</Text>
			</div>
		</article>
	);
};
