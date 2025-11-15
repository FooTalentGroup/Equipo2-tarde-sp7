"use client";

import { useState } from "react";

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
import { Loader2, Pencil } from "lucide-react";
import { type UseFormReturn, useForm } from "react-hook-form";
import type { z } from "zod";

import type {
	createPropertySchema,
	Property,
} from "../schemas/property.schema";
import { PropertyForm } from "./PropertyForm";

type EditPropertyDialogProps = {
	property: Property;
	onSubmit: (
		id: string,
		values: z.infer<typeof createPropertySchema>,
		form?: UseFormReturn<z.infer<typeof createPropertySchema>>,
	) => Promise<void>;
	loading: boolean;
};

export function EditPropertyDialog({
	property,
	onSubmit,
	loading,
}: EditPropertyDialogProps) {
	const form = useForm<z.infer<typeof createPropertySchema>>({
		defaultValues: property,
	});
	// control open state so we can prevent closing while loading
	const [open, setOpen] = useState(false);

	function handleOpenChange(value: boolean) {
		// prevent closing while a save is in progress
		if (!value && loading) return;

		// if closing, reset form to original property values
		if (!value) {
			try {
				form.reset(property);
				form.clearErrors();
			} catch {
				// ignore
			}
		}

		setOpen(value);
	}

	return (
		<AlertDialog open={open} onOpenChange={handleOpenChange}>
			<AlertDialogTrigger asChild>
				<Button variant="outline" size="sm">
					<Pencil className="mr-2 h-4 w-4" />
					Editar
				</Button>
			</AlertDialogTrigger>

			<AlertDialogContent className="max-w-lg">
				<AlertDialogHeader>
					<AlertDialogTitle>Editar propiedad</AlertDialogTitle>
					<AlertDialogDescription>
						Modifica los datos de la propiedad y guarda los cambios.
					</AlertDialogDescription>
				</AlertDialogHeader>

				<form
					onSubmit={form.handleSubmit((values) =>
						onSubmit(property.id, values, form),
					)}
					className="space-y-4 mt-4"
				>
					<PropertyForm form={form} loading={loading} />

					<AlertDialogFooter>
						<AlertDialogCancel disabled={loading}>Cancelar</AlertDialogCancel>
						<Button type="submit" disabled={loading}>
							{loading ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Guardando...
								</>
							) : (
								<>
									<Pencil className="mr-2 h-4 w-4" />
									Guardar cambios
								</>
							)}
						</Button>
					</AlertDialogFooter>
				</form>
			</AlertDialogContent>
		</AlertDialog>
	);
}
