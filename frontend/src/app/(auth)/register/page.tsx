import type { Metadata } from "next";
import Image from "next/image";

import AuthBackground from "@public/images/auth-background.png";
import RegisterForm from "@src/modules/auth/components/register-form";

export const metadata: Metadata = {
	title: "Registro",
	description: "Crea tu cuenta en nuestra app",
};

export default function RegisterPage() {
	return (
		<section className="bg-muted grid px-4 h-screen relative">
			<div className="m-auto md:max-w-md w-full z-10 relative ">
				<RegisterForm />
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
