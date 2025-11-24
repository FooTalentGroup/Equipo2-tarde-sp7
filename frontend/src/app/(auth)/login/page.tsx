import type { Metadata } from "next";
import LoginForm from "@src/modules/auth/components/login-form";
import HeaderAuth from "@src/modules/auth/components/header";
export const metadata: Metadata = {
	title: "Login",
	description: "Inicia sesión en nuestra app",
};
export default function LoginPage() {
	return (
		<section className="min-h-screen flex flex-col">
			<HeaderAuth />
			<main className="flex-1 flex items-center justify-center m-auto w-full z-10 relative">
				<LoginForm />
			</main>
		</section>
	);
}
