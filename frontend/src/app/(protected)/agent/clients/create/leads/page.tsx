import LeadsForm from "@src/modules/clients/components/create-leads/leads-form";
import TipAlert from "@src/modules/clients/ui/TipAlert";

function Page() {
	return (
		<div className="flex w-full gap-6">
			<LeadsForm />
			<TipAlert />
		</div>
	);
}

export default Page;
