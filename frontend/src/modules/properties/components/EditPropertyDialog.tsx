"use client";

import { useState } from "react";

import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@src/components/ui/alert-dialog";

import { Button } from "@src/components/ui/button";
import { Pencil } from "lucide-react";

import { PropertyForm } from "./PropertyForm";
import { UseFormReturn, useForm } from "react-hook-form";
import { z } from "zod";
import { createPropertySchema } from "../schemas/property.schema";

type EditPropertyDialogProps = {
  property: any;
  onSubmit: (
    id: string,
    values: z.infer<typeof createPropertySchema>
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
      } catch (e) {
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
            onSubmit(property.id, values)
          )}
          className="space-y-4 mt-4"
        >
          <PropertyForm form={form} loading={loading} />

          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>Cancelar</AlertDialogCancel>
            {/* Use regular submit button so Radix doesn't auto-close the dialog */}
            <Button type="submit" disabled={loading}>
              {loading ? "Guardando..." : "Guardar cambios"}
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
