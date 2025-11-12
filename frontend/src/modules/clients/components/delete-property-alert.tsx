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

type AlertDialogDeleteClientProp = {
	handleClick: () => void;
};
export const AlertDialogDeleteClient = ({
	handleClick,
}: AlertDialogDeleteClientProp) => {
	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button variant="outline">
					<Trash />
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>
						¿Estás completamente seguro de eliminar el cliente?
					</AlertDialogTitle>
					<AlertDialogDescription>
						Esta acción no puede ser deshecha. Esto removerá completamente el
						usuario de la tabla y de la base de datos
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogAction onClick={handleClick}>Continuar</AlertDialogAction>
					<AlertDialogCancel>Cancelar</AlertDialogCancel>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
