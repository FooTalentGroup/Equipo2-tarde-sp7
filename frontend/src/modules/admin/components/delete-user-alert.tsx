"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@src/components/ui/alert-dialog";
import { toast } from "sonner";

import type { DeleteUserProps } from "../types";

export const DeleteUserAlert = ({
	id,
	open,
	onOpenChange,
}: DeleteUserProps) => {
	const router = useRouter();
	const [isDeleting, setIsDeleting] = useState(false);

	const handleDelete = async () => {
		try {
			setIsDeleting(true);
			const response = await fetch(`/api/users/${id}`, {
				method: "DELETE",
			});

			if (!response.ok) {
				throw new Error("Error al eliminar el agente");
			}

			toast.success("Agente eliminado exitosamente");
			onOpenChange?.(false);
			router.refresh();
		} catch (error) {
			console.error("Error deleting user:", error);
			toast.error("Error al eliminar el agente. Por favor, intenta de nuevo.");
		} finally {
			setIsDeleting(false);
		}
	};

	return (
		<AlertDialog open={open} onOpenChange={onOpenChange}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle className="text-secondary sm:text-lg md:text-xl items-center">
						¿Estás seguro de eliminar este agente?
					</AlertDialogTitle>
				</AlertDialogHeader>
				<AlertDialogDescription className="text-gray-800 ">
					Esta acción no se puede deshacer. Esto eliminará permanentemente esta
					cuenta y se borrará de la base de datos.
				</AlertDialogDescription>
				<AlertDialogFooter>
					<AlertDialogCancel className="cursor-pointer" disabled={isDeleting}>
						Cancelar
					</AlertDialogCancel>
					<AlertDialogAction
						className="cursor-pointer"
						onClick={handleDelete}
						disabled={isDeleting}
					>
						{isDeleting ? "Eliminando..." : "Confirmar"}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};
