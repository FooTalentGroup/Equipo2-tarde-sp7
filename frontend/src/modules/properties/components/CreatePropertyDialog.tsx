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
import { Loader2, Plus } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";
import type { z } from "zod";

import type { createPropertySchema } from "../schemas/property.schema";
import { PropertyForm } from "./PropertyForm";

type CreatePropertyDialogProps = {
	form: UseFormReturn<z.infer<typeof createPropertySchema>>;
	// onSubmit should return true on success, false on failure so the dialog can close conditionally
	onSubmit: (values: z.infer<typeof createPropertySchema>) => Promise<boolean>;
	loading: boolean;
};

export function CreatePropertyDialog({
	form,
	onSubmit,
	loading,
}: CreatePropertyDialogProps) {
	// Control the dialog open state so we can reset the form on close
	const [open, setOpen] = useState(false);

	function handleOpenChange(value: boolean) {
		// When dialog closes, reset form values and clear validation errors
		if (!value) {
			try {
				form.reset();
				form.clearErrors();
			} catch (e) {
				// ignore
			}
		}
		setOpen(value);
	}

	// wrap onSubmit so we only close the dialog when the create was successful
	const handleCreate = async (values: z.infer<typeof createPropertySchema>) => {
		const ok = await onSubmit(values);
		if (ok) setOpen(false);
	};

	return (
		<AlertDialog open={open} onOpenChange={handleOpenChange}>
			<AlertDialogTrigger asChild>
				<Button>
					<Plus className="mr-2 h-4 w-4" />
					Agregar propiedad
				</Button>
			</AlertDialogTrigger>

			<AlertDialogContent className="max-w-lg">
				<AlertDialogHeader>
					<AlertDialogTitle>Nueva propiedad</AlertDialogTitle>
					<AlertDialogDescription>
						Completa los siguientes datos para crear una propiedad.
					</AlertDialogDescription>
				</AlertDialogHeader>

				<form
					onSubmit={form.handleSubmit(handleCreate)}
					className="space-y-4 mt-4"
				>
					<PropertyForm form={form} loading={loading} />

					<AlertDialogFooter>
						<AlertDialogCancel disabled={loading}>Cancelar</AlertDialogCancel>
						{/* Use a regular submit Button instead of AlertDialogAction so the dialog
                does not auto-close before form validation / submission completes. */}
						<Button type="submit" disabled={loading}>
							{loading ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Creando...
								</>
							) : (
								<>
									<Plus className="mr-2 h-4 w-4" />
									Crear
								</>
							)}
						</Button>
					</AlertDialogFooter>
				</form>
			</AlertDialogContent>
		</AlertDialog>
	);
}
