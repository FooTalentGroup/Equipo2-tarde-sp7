"use client";

import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import {
	AlertDialog,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@src/components/ui/alert-dialog";
import { Button } from "@src/components/ui/button";
import { Form } from "@src/components/ui/form";
import { Spinner } from "@src/components/ui/spinner";
import { Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type Props = {
	onDeleteAll: () => Promise<void> | void;
};

const DeleteSchema = z.object({});

export function DeleteAllConsultationsAction({ onDeleteAll }: Props) {
	const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);

	const form = useForm<z.infer<typeof DeleteSchema>>({
		resolver: zodResolver(DeleteSchema),
	});

	const onSubmit = async () => {
		try {
			await onDeleteAll();
			setOpenDeleteDialog(false);
			toast.success("Todas las consultas fueron eliminadas correctamente");
		} catch (error) {
			console.error("Error al eliminar las consultas:", error);
			toast.error("Error al eliminar las consultas");
		}
	};

	return (
		<AlertDialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
			<AlertDialogTrigger asChild>
				<Button
					variant="outline"
					className="ml-auto flex items-center gap-2 border-red-600 text-red-600 hover:bg-red-50 hover:text-red-500"
				>
					<Trash2 className="size-4" />
					Borrar todas
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="flex flex-col gap-4"
					>
						<AlertDialogHeader>
							<AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
							<AlertDialogDescription>
								Esta acción no se puede deshacer. Esto eliminará permanentemente
								todas las consultas.
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel>Cancelar</AlertDialogCancel>

							<Button
								type="submit"
								disabled={form.formState.isSubmitting}
								variant="destructive"
							>
								{form.formState.isSubmitting && <Spinner />}
								{form.formState.isSubmitting
									? "Eliminando..."
									: "Eliminar todas"}
							</Button>
						</AlertDialogFooter>
					</form>
				</Form>
			</AlertDialogContent>
		</AlertDialog>
	);
}
