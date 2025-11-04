"use client";

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
import { Input } from "@src/components/ui/input";
import { Spinner } from "@src/components/ui/spinner";
import { wait } from "@src/lib/utils";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { type LoginFormData, loginSchema } from "../schemas/login";

type LoginFormProps = {
	heading?: string;
	buttonText?: string;
	onSubmit?: (data: LoginFormData) => Promise<void> | void;
};

export default function LoginForm({
	heading = "Real Estate App",
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

	const router = useRouter();

	const handleSubmit = async (data: LoginFormData) => {
		try {
			await wait(2000);
			if (onSubmit) {
				await onSubmit(data);
			} else {
				console.log("Login data:", data);
				toast.success("Datos válidos - sesión iniciada");
			}
		} catch (error) {
			toast.error("Error al iniciar sesión. Inténtalo de nuevo.");
			console.error("Login error:", error);
		} finally {
			router.push("/admin/dashboard");
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

					<Button
						type="submit"
						className="w-full"
						disabled={form.formState.isSubmitting}
					>
						{form.formState.isSubmitting && <Spinner />}
						{form.formState.isSubmitting ? "Iniciando..." : buttonText}
					</Button>
				</form>
			</Form>
		</div>
	);
}
