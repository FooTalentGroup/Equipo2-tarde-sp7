"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@src/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	FormMessageWithIcon,
} from "@src/components/ui/form";
import { Input } from "@src/components/ui/input";
import { Spinner } from "@src/components/ui/spinner";
import { paths } from "@src/lib/paths";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Heading } from "@src/components/ui/heading";
import { registerAction } from "../actions/auth.actions";
import { type RegisterFormData, registerSchema } from "../schemas/register";
import { useState } from "react";

type RegisterFormProps = {
	heading?: string;
	buttonText?: string;
	onSubmit?: (data: RegisterFormData) => Promise<void> | void;
	redirectTo?: string;
};

export default function RegisterForm({
	heading = "REGISTRO",
	buttonText = "Aceptar",
	onSubmit,
	redirectTo,
}: RegisterFormProps) {
	const [showPassword, setShowPassword] = useState(false)
	const form = useForm<RegisterFormData>({
		resolver: zodResolver(registerSchema),
		defaultValues: {
			email: "",
			password: "",
			first_name: "",
			last_name: "",
			// role: "",
		},
	});

	const router = useRouter();

	const handleSubmit = async (data: RegisterFormData) => {
		try {
			if (onSubmit) {
				await onSubmit(data);
			} else {
				const result = await registerAction(data);

				if (result.success) {
					toast.success(result.message);
					const redirect = redirectTo || paths.admin.properties.index();
					router.push(redirect);
					router.refresh();
				} else {
					toast.error(result.message || "Error al crear la cuenta");
				}
			}
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : "Error al crear la cuenta";
			toast.error(errorMessage);
			console.error("Register error:", error);
		}
	};

	return (
		<div className="border-muted bg-background grid items-center gap-y-4 rounded-md border px-6 py-8 min-w-md">
			{heading && <Heading align={"center"} variant={"h1"} weight={"semibold"} className="text-black mb-4">{heading}</Heading>}

			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(handleSubmit)}
					className="w-full space-y-4"
				>
					<div className="grid grid-cols-1 gap-4">
						<FormField
							control={form.control}
							name="first_name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Nombre</FormLabel>
									<FormControl>
										<Input
											type="text"
											placeholder="Tu nombre"
											className="text-sm"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="last_name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Apellido</FormLabel>
									<FormControl>
										<Input
											type="text"
											placeholder="Tu apellido"
											className="text-sm"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>

					<FormField
						control={form.control}
						name="email"
						render={({ field }) => {
							return (
								<FormItem>
									<FormLabel className="text-[#0A122B] font-semibold">Email *</FormLabel>
									<div className="relative">
										<FormControl className="relative">
											<Input
												type="email"
												className="text-lg border-[#B3B3B3] focus-visible:border-[#0F1E4D]! focus-visible:ring-0 rounded-sm relative md:min-w-[480px]"
												{...field}
											/>
										</FormControl>
										<FormMessageWithIcon className="top-0" />
									</div>
								</FormItem>
							);
						}}
					/>

					<FormField
						control={form.control}
						name="password"
						render={({ field }) => {
							return (
								<FormItem>
									<FormLabel className="text-[#0A122B] font-semibold">Contraseña *</FormLabel>
									<div className="relative">
										<FormControl className="relative">
											<Input
												type={showPassword ? "text" : "password"}
												className="text-md border-[#B3B3B3] focus-visible:border-[#0F1E4D]! focus-visible:ring-0 rounded-sm relative md:min-w-[480px]"
												{...field}
											/>
										</FormControl>
										<div className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
											{showPassword ? <EyeOff /> : <Eye />}
										</div>
										<FormMessageWithIcon className="top-0" />
									</div>
								</FormItem>
							);
						}}
					/>

					{/* <FormField
						control={form.control}
						name="confirmPassword"
						render={({ field }) => {
							return (
								<FormItem>
									<FormLabel className="text-[#0A122B] font-semibold">Repetir Contraseña *</FormLabel>
									<div className="relative">
										<FormControl className="relative">
											<Input
												type={showPassword ? "text" : "password"}
												className="text-lg border-[#B3B3B3] focus-visible:border-[#0F1E4D]! focus-visible:ring-0 rounded-sm relative md:min-w-[480px]"
												{...field}
											/>
										</FormControl>
										<div className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
											{showPassword ? <EyeOff /> : <Eye />}
										</div>
										<FormMessageWithIcon className="top-0" />
									</div>
								</FormItem>
							);
						}}
					/>*/}

					<Button
						type="submit"
						className="w-full rounded-sm"
						disabled={form.formState.isSubmitting}
					>
						{form.formState.isSubmitting && <Spinner />}
						{form.formState.isSubmitting ? "Creando cuenta..." : buttonText}
					</Button>
				</form>
			</Form>
			<p className="text-sm text-center">
				Ya tienes cuenta?
				<Button asChild className="font-semibold px-2 py-0" variant="link">
					<Link href={paths.auth.login()}>Inicia sesión</Link>
				</Button>
			</p>
		</div>
	);
}