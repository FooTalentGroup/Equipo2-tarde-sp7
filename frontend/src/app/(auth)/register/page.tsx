import type { Metadata } from "next";

import HeaderAuth from "@src/modules/auth/components/header";
import RegisterForm from "@src/modules/auth/components/register-form";

export const metadata: Metadata = {
	title: "Registro",
	description: "Crea tu cuenta en nuestra app",
};

export default function RegisterPage() {
	return (
		<section className="min-h-screen flex flex-col">
			<HeaderAuth />
			<main className="flex-1 flex items-center justify-center m-auto w-full z-10 relative">
				<RegisterForm />
			</main>
		</section>
	);
}
