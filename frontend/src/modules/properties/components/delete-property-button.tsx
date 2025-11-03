"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
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
import { deletePropertyAction } from "../actions/delete-property-action";

interface DeletePropertyButtonProps {
	propertyId: string;
	propertyName: string;
}

export function DeletePropertyButton({
	propertyId,
	propertyName,
}: DeletePropertyButtonProps) {
	const [isDeleting, setIsDeleting] = useState(false);
	const router = useRouter();

	const handleDelete = async () => {
		setIsDeleting(true);
		try {
			const result = await deletePropertyAction(propertyId);

			if (result && !result.ok) {
				alert(`Error: ${result.error}`);
				setIsDeleting(false);
			}
			// Si no hay error, el redirect se maneja en la action
		} catch (error) {
			alert("Ocurrió un error al eliminar la propiedad");
			setIsDeleting(false);
		}
	};

	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button variant="destructive" disabled={isDeleting}>
					{isDeleting ? "Eliminando..." : "Eliminar"}
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
					<AlertDialogDescription>
						Esta acción no se puede deshacer. Se eliminará permanentemente la
						propiedad &quot;{propertyName}&quot;.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
					<AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
						{isDeleting ? "Eliminando..." : "Eliminar"}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
