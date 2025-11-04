import type { Metadata } from "next";
import Image from "next/image";

import AuthBackground from "@public/images/auth-background.png";
import LoginForm from "@src/modules/auth/components/login-form";

export const metadata: Metadata = {
	title: "Login",
	description: "Inicia sesión en nuestra app",
};
export default function LoginPage() {
	return (
		<section className="bg-muted grid px-4 h-screen relative">
			<div className="m-auto md:max-w-sm w-full z-10 relative ">
				<LoginForm />
			</div>
			<figure className="absolute inset-0 z-0 ">
				<Image
					src={AuthBackground}
					alt="Auth Background"
					className="w-full h-full object-cover object-center"
				/>
				<div className="absolute inset-0 bg-linear-to-l from-black/50 to-black/50"></div>
			</figure>
		</section>
	);
}
