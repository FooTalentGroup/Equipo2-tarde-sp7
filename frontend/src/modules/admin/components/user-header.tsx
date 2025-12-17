import { Heading } from "@src/components/ui/heading";

export const UserHeader = () => {
	return (
		<Heading
			variant="h3"
			className="text-secondary max-md:text-2xl"
			weight="semibold"
		>
			Lista de agentes
		</Heading>
	);
};
