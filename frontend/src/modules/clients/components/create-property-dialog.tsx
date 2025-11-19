"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@src/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@src/components/ui/dialog";
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
import { useForm } from "react-hook-form";

import { type ClientFormData, clientSchema } from "../schemas/create";

type CreateClientProps = {
	buttonText?: string;
	onSubmit?: (data: ClientFormData) => Promise<void> | void;
};

export const CreateClient = ({
	buttonText = "Crear cliente",
	onSubmit,
}: CreateClientProps) => {
	const form = useForm<ClientFormData>({
		resolver: zodResolver(clientSchema),
		defaultValues: {
			name: "",
			email: "",
			number: 60,
		},
	});

	const handleSubmit = async (data: ClientFormData) => {
		try {
			console.log("Submitting form...", data);

			if (onSubmit) {
				await onSubmit(data);
			} else {
				// Aquí irá la acción del servidor cuando se implemente
				// const result = await createClientAction(data);
			}

			form.reset();
		} catch (error) {
			console.error("Error creating client:", error);
		}
	};

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant="outline">{buttonText}</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(handleSubmit)}
						className="space-y-4"
					>
						<DialogHeader>
							<DialogTitle>Creación del cliente</DialogTitle>
							<DialogDescription>
								Ingrese los detalles del nuevo inquilino
							</DialogDescription>
						</DialogHeader>

						<div className="grid gap-4">
							{/* Campo Nombre */}
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Nombre</FormLabel>
										<FormControl>
											<Input
												type="text"
												placeholder="Pedro Duarte"
												className="text-sm"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							{/* Campo Email */}
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

							{/* Campo Número */}
							<FormField
								control={form.control}
								name="number"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Número</FormLabel>
										<FormControl>
											<Input
												type="number"
												placeholder="04156218952"
												className="text-sm"
												{...field}
												onChange={(e) =>
													field.onChange(parseInt(e.target.value, 10) || 60)
												}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<DialogFooter>
							<Button type="submit" disabled={form.formState.isSubmitting}>
								{form.formState.isSubmitting && <Spinner />}
								{form.formState.isSubmitting ? "Guardando..." : buttonText}
							</Button>

							<DialogClose asChild>
								<Button variant="outline" type="button">
									Cancelar
								</Button>
							</DialogClose>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};
