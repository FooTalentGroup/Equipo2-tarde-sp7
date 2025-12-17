"use client";

import { useState } from "react";

import Link from "next/link";

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
import { paths } from "@src/lib/paths";
import { useCreateUserForm } from "@src/modules/admin/hooks/use-create-user-form";
import type { CreateUserFormData } from "@src/modules/admin/schemas/create-user";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";

export default function CreateUserPage() {
	const [showPassword, setShowPassword] = useState(false);
	const { form, handleSubmit, isSubmitting, error } = useCreateUserForm();

	const onSubmit = async (data: CreateUserFormData) => {
		await handleSubmit(data);
	};

	return (
		<section className="min-h-dvh bg-white">
			<div className="max-w-5xl mx-auto">
				<div className="mb-8 rounded-md shadow-create-user py-4 px-4">
					<Link
						href={paths.admin.dashboard()}
						className="inline-flex items-center text-secondary hover:text-secondary-dark mb-4"
					>
						<div className="flex items-center">
							<ArrowLeft className="h-4 w-4 mr-2" />
							<p>Volver a la lista de agentes</p>
						</div>
					</Link>
					<h1 className="text-secondary text-3xl font-bold">Nuevo agente</h1>
				</div>

				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-6 px-4 shadow-create-user"
					>
						<div className="grid sm:grid-cols-2 gap-4 gap-x-8">
							<FormField
								control={form.control}
								name="first_name"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-secondary-dark gap-0.5">
											Nombre
											<span className="text-danger-normal">*</span>
										</FormLabel>
										<FormControl>
											<Input
												placeholder="Juan"
												{...field}
												value={field.value || ""}
												className="placeholder:text-pagination-border border border-input-border shadow-input-border h-10"
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
										<FormLabel className="text-secondary-dark gap-0.5">
											Apellido
											<span className="text-danger-normal">*</span>
										</FormLabel>
										<FormControl>
											<Input
												placeholder="Pérez"
												{...field}
												value={field.value || ""}
												className="placeholder:text-pagination-border border border-input-border shadow-input-border h-10"
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-secondary-dark gap-0.5">
											Correo electrónico
											<span className="text-danger-normal">*</span>
										</FormLabel>
										<FormControl>
											<Input
												type="email"
												placeholder="correo@ejemplo.com"
												{...field}
												value={field.value || ""}
												className="placeholder:text-pagination-border border border-input-border shadow-input-border h-10"
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="phone"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-secondary-dark gap-0.5">
											Teléfono
											<span className="text-danger-normal">*</span>
										</FormLabel>
										<FormControl>
											<Input
												placeholder="04121234567"
												{...field}
												value={field.value || ""}
												className="placeholder:text-pagination-border border border-input-border shadow-input-border h-10"
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
										<FormLabel className="text-secondary-dark gap-0.5">
											Contraseña
											<span className="text-danger-normal">*</span>
										</FormLabel>
										<div className="relative">
											<FormControl>
												<Input
													type={showPassword ? "text" : "password"}
													placeholder="*********"
													{...field}
													value={field.value || ""}
													className="placeholder:text-pagination-border border border-input-border shadow-input-border h-10"
												/>
											</FormControl>
											<button
												type="button"
												className="absolute right-2 top-1/2 -translate-y-1/2 text-input-border"
												onClick={() => setShowPassword(!showPassword)}
											>
												{showPassword ? <EyeOff /> : <Eye />}
											</button>
										</div>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="confirmPassword"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-secondary-dark gap-0.5">
											Confirmar contraseña
											<span className="text-danger-normal">*</span>
										</FormLabel>
										<div className="relative">
											<FormControl>
												<Input
													type={showPassword ? "text" : "password"}
													placeholder="*********"
													{...field}
													value={field.value || ""}
													className="placeholder:text-pagination-border border border-input-border shadow-input-border h-10"
												/>
											</FormControl>
											<button
												type="button"
												className="absolute right-2 top-1/2 -translate-y-1/2 text-input-border"
												onClick={() => setShowPassword(!showPassword)}
											>
												{showPassword ? <EyeOff /> : <Eye />}
											</button>
										</div>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<div className="bg-blue-50 border border-blue-200 rounded-md p-4 mt-4">
							<p className="text-blue-800 text-sm">
								<strong>Nota:</strong> Todos los nuevos agentes serán creados
								como <strong>Agentes</strong> (Rol: Agent). Solo los
								administradores existentes pueden modificar los roles
								posteriormente si es necesario.
							</p>
						</div>

						{error && <p className="text-red-500 text-sm">{error}</p>}

						<div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-4 pb-4">
							<Link href={paths.admin.dashboard()}>
								<Button
									className="cursor-pointer h-12 px-6 py-3 max-sm:w-full sm:min-w-36 text-black"
									type="button"
									variant="outline"
									disabled={isSubmitting}
								>
									Cancelar
								</Button>
							</Link>
							<Button
								className="bg-tertiary cursor-pointer h-12 px-6 py-3 max-sm:w-full sm:min-w-36"
								type="submit"
								disabled={isSubmitting}
							>
								{isSubmitting && (
									<Spinner className="mr-2 h-4 w-4 animate-spin" />
								)}
								{isSubmitting ? "Guardando..." : "Guardar"}
							</Button>
						</div>
					</form>
				</Form>
			</div>
		</section>
	);
}
