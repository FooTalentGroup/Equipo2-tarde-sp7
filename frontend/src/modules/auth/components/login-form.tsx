"use client";

import { useState } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@src/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
} from "@src/components/ui/form";
import { Heading } from "@src/components/ui/heading";
import { Input } from "@src/components/ui/input";
import { Spinner } from "@src/components/ui/spinner";
import { paths } from "@src/lib/paths";
import { HeadingForm } from "@src/modules/auth/components/heading-form";
import { Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { loginAction } from "../actions/auth.actions";
import { type LoginFormData, loginSchema } from "../schemas/login";

type LoginFormProps = {
	title?: string;
	heading?: string;
	buttonText?: string;
	onSubmit?: (data: LoginFormData) => Promise<void> | void;
	redirectTo?: string;
};

export default function LoginForm({
	title = "REDPROP",
	heading = "INICIAR SESIÓN",
	buttonText = "Iniciar Sesión",
	onSubmit,
	redirectTo,
}: LoginFormProps) {
	const form = useForm<LoginFormData>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});
	const [showPassword, setShowPassword] = useState(false);

	const router = useRouter();

	const handleSubmit = async (data: LoginFormData) => {
		try {
			if (onSubmit) {
				await onSubmit(data);
			} else {
				const result = await loginAction(data);

				if (result.success) {
					toast.success(result.message);

					const redirect = redirectTo || paths.admin.properties.index();
					router.push(redirect);
					router.refresh();
				} else {
					toast.error(result.message || "Error al iniciar sesión");
				}
			}
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : "Error al iniciar sesión";
			toast.error(errorMessage);
			console.error("Login error:", error);
		}
	};

	return (
		<div className="bg-primary-foreground grid items-center gap-y-4 rounded-md px-6 py-8">
			<HeadingForm title={title} />
			{heading && (
				<Heading
					align={"center"}
					variant={"h1"}
					weight={"semibold"}
					className="text-secondary mb-7"
				>
					{heading}
				</Heading>
			)}

			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(handleSubmit)}
					className="w-full space-y-7"
				>
					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="text-secondary-dark font-semibold">
									Usuario o Email
								</FormLabel>
								<FormControl>
									<Input
										type="email"
										className="text-base border-input-border focus-visible:border-input-active focus-visible:shadow-input-active focus-visible:border-2 focus-visible:ring-0 rounded-lg not-placeholder-shown:border-input-active not-placeholder-shown:border-2 text-primary-normal-active md:min-w-[480px] h-10 py-2 shadow-input-border aria-invalid:bg-input-danger aria-invalid:border-danger-normal"
										placeholder=" "
										{...field}
									/>
								</FormControl>
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="password"
						render={({ field }) => (
							<FormItem>
								<div className="flex justify-between">
									<FormLabel className="text-secondary-dark font-semibold">
										Contraseña
									</FormLabel>
									<Link href={""} className="hover:underline text-secondary">
										¿Olvidaste tu contraseña?
									</Link>
								</div>
								<div className="flex items-center relative">
									<FormControl>
										<Input
											type={showPassword ? "text" : "password"}
											className="text-base border-input-border focus-visible:border-2 focus-visible:border-input-active focus-visible:ring-0 rounded-lg not-placeholder-shown:border-input-active not-placeholder-shown:border-2 md:min-w-[480px] h-10 py-2 shadow-input-border text-primary-normal-active aria-invalid:bg-input-danger aria-invalid:border-danger-normal"
											placeholder=" "
											{...field}
										/>
									</FormControl>
									<button
										type="button"
										className="absolute right-2"
										onClick={() => setShowPassword(!showPassword)}
									>
										{showPassword ? <EyeOff /> : <Eye />}
									</button>
								</div>
							</FormItem>
						)}
					/>

					<Button
						type="submit"
						className="w-full text-base rounded-md py-3! px-6! h-12!"
						disabled={form.formState.isSubmitting}
					>
						{form.formState.isSubmitting && <Spinner />}
						{form.formState.isSubmitting ? "Iniciando..." : buttonText}
					</Button>
				</form>
			</Form>
			<p className="text-center text-secondary">
				¿No tienes cuenta?
				<Button
					asChild
					className="font-semibold text-primary px-2!"
					variant="link"
					size="lg"
				>
					<Link className="font-semibold" href={paths.auth.register()}>
						Registrate
					</Link>
				</Button>
			</p>
		</div>
	);
}
