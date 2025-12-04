import { Heading } from "@src/components/ui/heading";
import { Logo } from "@src/modules/logo/logo";

type HeadingFormProp = {
	title?: string;
};

export const HeadingForm = ({ title }: HeadingFormProp) => {
	return (
		<div className="flex flex-col items-center gap-[26.6px]">
			<Logo width={75.27} height={77.24} />
			<Heading variant={"h3"} weight={"light"}>
				{title}
			</Heading>
		</div>
	);
};
