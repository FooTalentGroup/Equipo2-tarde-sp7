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
	AlertDialogTrigger,
} from "@src/components/ui/alert-dialog";
import { Button } from "@src/components/ui/button";
import { Trash } from "lucide-react";
import { toast } from "sonner";

import type { DeleteUserProps } from "../types";

export const DeleteUserAlert = ({ id }: DeleteUserProps) => {
	const router = useRouter();
	const [isDeleting, setIsDeleting] = useState(false);

	const handleDelete = async () => {
		try {
			setIsDeleting(true);
			// Use Next.js API route instead of direct backend call
			const response = await fetch(`/api/users/${id}`, {
				method: "DELETE",
			});

			if (!response.ok) {
				throw new Error("Error al eliminar el usuario");
			}

			toast.success("Usuario eliminado exitosamente");
			router.refresh();
		} catch (error) {
			console.error("Error deleting user:", error);
			toast.error("Error al eliminar el usuario. Por favor, intenta de nuevo.");
		} finally {
			setIsDeleting(false);
		}
	};

	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button
					variant="outline"
					className="hover:text-white hover:bg-destructive-foreground border-destructive-foreground border text-destructive-foreground cursor-pointer transition-colors duration-300"
				>
					<Trash />
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle className="text-secondary text-xl">
						¿Estás seguro de eliminar este usuario?
					</AlertDialogTitle>
				</AlertDialogHeader>
				<AlertDialogDescription className="text-gray-800">
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
