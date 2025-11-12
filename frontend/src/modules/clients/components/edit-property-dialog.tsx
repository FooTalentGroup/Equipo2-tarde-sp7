import { useState, useEffect } from "react";
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
import { Input } from "@src/components/ui/input";
import { Pencil } from "lucide-react";
import { Spinner } from "@src/components/ui/spinner";
import { type ClientFormData, clientSchema } from "../schemas/create";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	Form,
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage,
} from "@src/components/ui/form";
import { type Client } from "@src/types/client"

type EditClientModalProps = {
	client?: Client;
	buttonText?: string;
	onSave: (updatedClient: Client) => Promise<void> | void;
};

export const EditClientModal = ({
	client,
	buttonText = "Editar cliente",
	onSave,
}: EditClientModalProps) => {
	const [open, setOpen] = useState(false);
	const form = useForm<ClientFormData>({
		resolver: zodResolver(clientSchema),
		defaultValues: {
			name: client?.name || "",
			email: client?.email || "",
			number: client?.number || 60,
		},
	});

	// Resetear el formulario cuando el cliente cambie
	useEffect(() => {
		if (client) {
			form.reset({
				name: client.name,
				email: client.email,
				number: client.number,
			});
		}
	}, [client, form]);

	const handleSubmit = async (data: ClientFormData) => {
		if (!client) return;

		const updatedClient: Client = {
			id: client.id,
			name: data.name,
			email: data.email,
			number: data.number,
		};

		try {
			await onSave(updatedClient);
			setOpen(false);
			form.reset();
		} catch (error) {
			console.error("Error al guardar cliente:", error);
		}
	};

	if (!client) {
		return (
			<Button variant="outline" disabled>
				<Pencil />
			</Button>
		);
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant="outline">
					<Pencil />
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Editar cliente</DialogTitle>
					<DialogDescription>
						Modifique los detalles del cliente {client.name}{" "}
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
						<div className="grid gap-4">
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
												onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<DialogFooter>
							<Button 
								type="submit" 
								disabled={form.formState.isSubmitting}
							>
								{form.formState.isSubmitting && <Spinner />}
								{form.formState.isSubmitting ? "Guardando cambios..." : buttonText}
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