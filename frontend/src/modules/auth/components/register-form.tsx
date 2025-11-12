"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@src/components/ui/button";
import { ButtonGroup } from "@src/components/ui/button-group";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@src/components/ui/form";
import { Input } from "@src/components/ui/input";
import { Spinner } from "@src/components/ui/spinner";
import { paths } from "@src/lib/paths";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { registerAction } from "../actions/auth.actions";
import { type RegisterFormData, registerSchema } from "../schemas/register";

type RegisterFormProps = {
	heading?: string;
	buttonText?: string;
	onSubmit?: (data: RegisterFormData) => Promise<void> | void;
	redirectTo?: string;
};

export default function RegisterForm({
	heading = "RedProp",
	buttonText = "Registrarse",
	onSubmit,
	redirectTo,
}: RegisterFormProps) {
	const form = useForm<RegisterFormData>({
		resolver: zodResolver(registerSchema),
		defaultValues: {
			email: "",
			password: "",
			firstName: "",
			lastName: "",
			role: "",
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
					const redirect = redirectTo || paths.dashboard();
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
		<div className="border-muted bg-background grid items-center gap-y-4 rounded-md border px-6 py-8 shadow-md">
			{heading && <h1 className="text-xl font-semibold">{heading}</h1>}

			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(handleSubmit)}
					className="w-full space-y-4"
				>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<FormField
							control={form.control}
							name="firstName"
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
							name="lastName"
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
						render={({ field }) => (
							<FormItem>
								<FormLabel>Correo electrónico</FormLabel>
								<FormControl>
									<Input
										type="email"
										placeholder="correo@ejemplo.com"
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
						name="password"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Contraseña</FormLabel>
								<FormControl>
									<Input
										type="password"
										placeholder="Tu contraseña"
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
						name="role"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Tipo de cuenta</FormLabel>
								<FormControl>
									<ButtonGroup className="w-full">
										<Button
											type="button"
											variant={field.value === "AGENTE" ? "default" : "outline"}
											className="flex-1"
											onClick={() => field.onChange("AGENTE")}
										>
											Agente
										</Button>
										<Button
											type="button"
											variant={field.value === "ADMIN" ? "default" : "outline"}
											className="flex-1"
											onClick={() => field.onChange("ADMIN")}
										>
											Propietario
										</Button>
									</ButtonGroup>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<Button
						type="submit"
						className="w-full"
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
