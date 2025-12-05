"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

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
import { paths } from "@src/lib/paths";
import { deleteProperty } from "@src/modules/properties/services/property-service";
import { TrashIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type Props = {
	propertyId: number;
};

const DeleteSchema = z.object({});

export default function PropertyDeleteAction({ propertyId }: Props) {
	const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);

	const router = useRouter();

	const form = useForm<z.infer<typeof DeleteSchema>>({
		resolver: zodResolver(DeleteSchema),
	});

	const onSubmit = async () => {
		try {
			const result = await deleteProperty(propertyId);

			if (result.success) {
				setOpenDeleteDialog(false);

				toast.success("Propiedad eliminada correctamente");
				router.push(paths.agent.properties.index());
			} else {
				toast.error("Error al eliminar la propiedad");
			}
		} catch (error) {
			console.error("Error al eliminar la propiedad:", error);
			toast.error("Error al eliminar la propiedad");
		}
	};

	return (
		<AlertDialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
			<AlertDialogTrigger asChild>
				<Button variant="outline-destructive" size="lg" className="w-full">
					<TrashIcon className="mr-2 h-4 w-4" />
					Eliminar
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
								la propiedad.
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
	);
}
