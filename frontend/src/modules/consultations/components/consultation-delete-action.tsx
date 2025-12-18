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
} from "@src/components/ui/alert-dialog";
import { Button } from "@src/components/ui/button";
import { DropdownMenuItem } from "@src/components/ui/dropdown-menu";
import { Form } from "@src/components/ui/form";
import { Spinner } from "@src/components/ui/spinner";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { deleteConsultation } from "../service/consultation-service";

type Props = {
	consultationId: number;
	onDelete: (id: number) => void;
};

const DeleteSchema = z.object({});

export function ConsultationDeleteAction({ consultationId, onDelete }: Props) {
	const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);

	const form = useForm<z.infer<typeof DeleteSchema>>({
		resolver: zodResolver(DeleteSchema),
	});

	const onSubmit = async () => {
		try {
			const result = await deleteConsultation(consultationId);

			if ((result as { message: string }).message) {
				setOpenDeleteDialog(false);
				onDelete(consultationId);
				toast.success("Consulta eliminada correctamente");
			} else {
				toast.error("Error al eliminar la consulta");
			}
		} catch (error) {
			console.error("Error al eliminar la consulta:", error);
			toast.error("Error al eliminar la consulta");
		}
	};

	return (
		<>
			<DropdownMenuItem
				onSelect={(e) => {
					e.preventDefault();
					setOpenDeleteDialog(true);
				}}
				className="text-red-600 focus:text-red-600"
			>
				Eliminar
			</DropdownMenuItem>

			<AlertDialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
				<AlertDialogContent>
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onSubmit)}
							className="flex flex-col gap-4"
						>
							<AlertDialogHeader>
								<AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
								<AlertDialogDescription>
									Esta acción no se puede deshacer. Esto eliminará
									permanentemente la consulta.
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
									{form.formState.isSubmitting ? "Eliminando..." : "Eliminar"}
								</Button>
							</AlertDialogFooter>
						</form>
					</Form>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}
