import type { Metadata } from "next";

import RegisterForm from "@src/modules/auth/components/register-form";

export const metadata: Metadata = {
	title: "Registro",
	description: "Crea tu cuenta en nuestra app",
};

export default function RegisterPage() {
	return (
		<section className="min-h-screen flex flex-col bg-primary-foreground">
			<main className="flex-1 flex items-center justify-center m-auto w-full z-10 relative">
				<RegisterForm />
			</main>
		</section>
	);
}
