import MainLayout from "@src/components/layouts/main-layout";

import GeneralContactForm from "./_components/general-contact-form";

export default function ContactPage() {
	return (
		<MainLayout className="py-20">
			<div className="max-w-2xl mx-auto space-y-8">
				<GeneralContactForm />
			</div>
		</MainLayout>
	);
}
