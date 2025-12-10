import SectionHeading from "@src/components/section-heading";
import CreatePropertyForm from "@src/modules/properties/components/create-property";

export const dynamic = "force-dynamic";

export default function NewPropertyPage() {
	return (
		<>
			<SectionHeading title="Nueva propiedad" />
			<CreatePropertyForm />
		</>
	);
}
