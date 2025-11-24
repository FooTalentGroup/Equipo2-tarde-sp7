import SectionHeading from "@src/components/section-heading";
import CreatePropertyForm from "@src/modules/properties/components/create-property";

export default function NewPropertyPage() {
	return (
		<>
			<SectionHeading title="Nueva propiedad" />
			<section>
				<CreatePropertyForm />
			</section>
		</>
	);
}
