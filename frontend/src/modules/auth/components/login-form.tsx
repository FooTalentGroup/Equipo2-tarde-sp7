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
	FormMessage,
} from "@src/components/ui/form";
import { Heading } from "@src/components/ui/heading";
import { Input } from "@src/components/ui/input";
import { Spinner } from "@src/components/ui/spinner";
import { paths } from "@src/lib/paths";
import { ROLES } from "@src/types/user";
import { Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { loginAction } from "../actions/auth.actions";
import { type LoginFormData, loginSchema } from "../schemas/login";

type LoginFormProps = {
	heading?: string;
	buttonText?: string;
	onSubmit?: (data: LoginFormData) => Promise<void> | void;
};

export default function LoginForm({
	heading = "INICIAR SESIÓN",
	buttonText = "Iniciar Sesión",
	onSubmit,
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

					let redirect = "";

					if (result.role === ROLES.ADMIN) {
						redirect = paths.admin.dashboard();
					} else {
						redirect = paths.agent.dashboard();
					}

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
		<div className="border-muted bg-background grid items-center gap-y-4 rounded-md border px-6 py-8">
			{heading && (
				<Heading
					align={"center"}
					variant={"h1"}
					weight={"semibold"}
					className="text-black mb-4"
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
								<FormLabel className="text-[#0A122B] font-semibold">
									Usuario o Email
								</FormLabel>
								<FormControl>
									<Input
										type="email"
										className="text-lg border-[#B3B3B3] focus-visible:border-[#0F1E4D] focus-visible:ring-0 rounded-sm not-placeholder-shown:border-[#0F1E4D] md:min-w-[480px]"
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
									<FormLabel className="text-[#0A122B] font-semibold">
										Contraseña
									</FormLabel>
									<Link
										href={""}
										className="hover:underline text-sm text-[#103557]"
									>
										¿Olvidaste tu contraseña?
									</Link>
								</div>
								<div className="flex items-center relative">
									<FormControl>
										<Input
											type={showPassword ? "text" : "password"}
											className="text-md border-[#B3B3B3] focus-visible:border-[#0F1E4D]! focus-visible:ring-0 rounded-sm not-placeholder-shown:border-[#0F1E4D] md:min-w-[480px]"
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
								<FormMessage />
							</FormItem>
						)}
					/>

					<Button
						type="submit"
						className="w-full rounded-sm"
						disabled={form.formState.isSubmitting}
					>
						{form.formState.isSubmitting && <Spinner />}
						{form.formState.isSubmitting ? "Iniciando..." : buttonText}
					</Button>
				</form>
			</Form>
			<p className="text-sm text-center text-[#103557]">
				¿No tienes cuenta?
				<Button
					asChild
					className="font-semibold text-[#021727] px-2!"
					variant="link"
					size="lg"
				>
					<Link
						className="underline font-semibold"
						href={paths.auth.register()}
					>
						Registrate
					</Link>
				</Button>
			</p>
		</div>
	);
}
