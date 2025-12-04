import OwnerForm from "@src/modules/clients/components/create-owners/owners-forms";
import TipAlert from "@src/modules/clients/ui/TipAlert";

function Page() {
	return (
		<div className="flex w-full gap-6">
			<OwnerForm />
			<TipAlert />
		</div>
	);
}

export default Page;
