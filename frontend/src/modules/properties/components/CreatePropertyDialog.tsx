"use client";

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
  return (
    <AlertDialog>
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
            <AlertDialogAction type="submit" disabled={loading}>
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
            </AlertDialogAction>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
