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
	FormMessageWithIcon,
} from "@src/components/ui/form";
import { Heading } from "@src/components/ui/heading";
import { Input } from "@src/components/ui/input";
import { Spinner } from "@src/components/ui/spinner";
import { paths } from "@src/lib/paths";
import { HeadingForm } from "@src/modules/auth/components/heading-form";
import { ROLES } from "@src/types/user";
import { Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { registerAction } from "../actions/auth.actions";
import { type RegisterFormData, registerSchema } from "../schemas/register";

type RegisterFormProps = {
	title?: string;
	heading?: string;
	buttonText?: string;
	onSubmit?: (data: RegisterFormData) => Promise<void> | void;
};

export default function RegisterForm({
	title = "REDPROP",
	heading = "REGISTRO",
	buttonText = "Aceptar",
	onSubmit,
}: RegisterFormProps) {
	const [showPassword, setShowPassword] = useState(true);
	const form = useForm<RegisterFormData>({
		resolver: zodResolver(registerSchema),
		defaultValues: {
			email: "",
			password: "",
			first_name: "",
			last_name: "",
			confirmPassword: "",
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

					let redirect = "";

					if (result.role === ROLES.ADMIN) {
						redirect = paths.admin.dashboard();
					} else {
						redirect = paths.agent.dashboard();
					}

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
					<div className="grid grid-cols-1 gap-7">
						<FormField
							control={form.control}
							name="first_name"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-secondary-dark font-semibold">
										Nombre *
									</FormLabel>
									<FormControl>
										<Input
											type="text"
											placeholder=" "
											className="text-base border-input-border focus-visible:border-input-active focus-visible:shadow-input-active focus-visible:border-2 focus-visible:ring-0 rounded-lg not-placeholder-shown:border-input-active not-placeholder-shown:border-2 text-primary-normal-active h-10 py-2 shadow-input-border aria-invalid:bg-input-danger aria-invalid:border-danger-normal"
											{...field}
										/>
									</FormControl>
									<FormMessageWithIcon />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="last_name"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-secondary-dark font-semibold">
										Apellido *
									</FormLabel>
									<FormControl>
										<Input
											type="text"
											className="text-base border-input-border focus-visible:border-input-active focus-visible:shadow-input-active focus-visible:border-2 focus-visible:ring-0 rounded-lg not-placeholder-shown:border-input-active not-placeholder-shown:border-2 text-primary-normal-active h-10 py-2 shadow-input-border aria-invalid:bg-input-danger aria-invalid:border-danger-normal"
											placeholder=" "
											{...field}
										/>
									</FormControl>
									<FormMessageWithIcon />
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
									<FormLabel className="text-secondary-dark font-semibold">
										Email *
									</FormLabel>
									<FormControl>
										<Input
											type="email"
											className="text-base border-input-border focus-visible:border-input-active focus-visible:shadow-input-active focus-visible:border-2 focus-visible:ring-0 rounded-lg not-placeholder-shown:border-input-active not-placeholder-shown:border-2 text-primary-normal-active md:min-w-[480px] h-10 py-2 shadow-input-border aria-invalid:bg-input-danger aria-invalid:border-danger-normal"
											placeholder=" "
											{...field}
										/>
									</FormControl>
									<FormMessageWithIcon />
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
									<FormLabel className="text-secondary-dark font-semibold">
										Contraseña *
									</FormLabel>
									<div className="flex items-center relative">
										<FormControl className="relative">
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
										<FormMessageWithIcon />
									</div>
								</FormItem>
							);
						}}
					/>

					<Button
						type="submit"
						className="w-full text-base rounded-md py-3! px-6! h-12!"
						disabled={form.formState.isSubmitting}
					>
						{form.formState.isSubmitting && <Spinner />}
						{form.formState.isSubmitting ? "Creando cuenta..." : buttonText}
					</Button>
				</form>
			</Form>
			<p className="text-center text-secondary">
				¿Ya tienes cuenta?
				<Button
					asChild
					className="font-semibold text-primary px-2!"
					variant="link"
					size="lg"
				>
					<Link className="font-semibold" href={paths.auth.login()}>
						Inicia sesión
					</Link>
				</Button>
			</p>
		</div>
	);
}
