"use client";

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
import { Spinner } from "@src/components/ui/spinner";

interface DeleteClientDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onConfirm: () => Promise<void>;
	clientName: string;
	isDeleting: boolean;
	type: "propietario" | "lead" | "inquilino";
}

export function DeleteClientDialog({
	open,
	onOpenChange,
	onConfirm,
	isDeleting,
	type,
}: DeleteClientDialogProps) {
	const typeLabels = {
		propietario: "Eliminar usuario",
		lead: "Eliminar usuario",
		inquilino: "Eliminar usuario",
	};

	return (
		<AlertDialog open={open} onOpenChange={onOpenChange}>
			<AlertDialogContent variant="destructive">
				<AlertDialogHeader>
					<AlertDialogTitle>{typeLabels[type]}</AlertDialogTitle>
					<AlertDialogDescription>
						Si eliminas este usuario, se perderá toda su información asociada.
						<br />
						¿Deseas continuar?
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
					<Button
						onClick={onConfirm}
						disabled={isDeleting}
						variant="destructive"
					>
						{isDeleting && <Spinner className="mr-2" />}
						{isDeleting ? "Eliminando..." : "Eliminar"}
					</Button>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
