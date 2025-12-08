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
import { paths } from "@src/lib/paths";
import { Loader2, Trash2 } from "lucide-react";

// Archivo: app/agent/clients/propietarios/[id]/components/delete-owner-button.tsx
interface DeleteOwnerButtonProps {
	ownerId: string;
	ownerName: string;
}

export function DeleteOwnerButton({
	/* ownerId, */
	ownerName,
}: DeleteOwnerButtonProps) {
	const [isDeleting, setIsDeleting] = useState(false);
	const router = useRouter();

	const handleDelete = async () => {
		setIsDeleting(true);

		try {
			// Aquí llamarías a tu API para eliminar el propietario
			// await deleteOwner(ownerId);

			// Simulamos una llamada API
			await new Promise((resolve) => setTimeout(resolve, 1000));

			// Redirigir a la lista de propietarios
			router.push(paths.agent.clients.propietarios());
			router.refresh();
		} catch (error) {
			console.error("Error al eliminar propietario:", error);
			// Aquí podrías mostrar un toast de error
		} finally {
			setIsDeleting(false);
		}
	};

	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button
					variant="outline"
					size="sm"
					className="text-[#95141B] hover:text-red-700 border-[#FDBABE] hover:bg-red-50 w-full"
				>
					<Trash2 className="h-4 w-4 mr-2" />
					Borrar contacto
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
					<AlertDialogDescription>
						Estás por eliminar al propietario <strong>{ownerName}</strong>. Esta
						acción no se puede deshacer y se eliminarán todos los datos
						asociados.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
					<AlertDialogAction
						onClick={handleDelete}
						disabled={isDeleting}
						className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
					>
						{isDeleting ? (
							<>
								<Loader2 className="h-4 w-4 mr-2 animate-spin" />
								Eliminando...
							</>
						) : (
							"Eliminar"
						)}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
