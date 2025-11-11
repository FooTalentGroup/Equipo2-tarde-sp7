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
import { Loader2, Plus } from "lucide-react";

import { PropertyForm } from "./PropertyForm";
import { createPropertySchema } from "../schemas/property.schema";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";

type CreatePropertyDialogProps = {
  form: UseFormReturn<z.infer<typeof createPropertySchema>>;
  onSubmit: (values: z.infer<typeof createPropertySchema>) => Promise<void>;
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

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
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
