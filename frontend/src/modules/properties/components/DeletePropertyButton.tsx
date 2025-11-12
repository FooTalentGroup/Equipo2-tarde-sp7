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
import { Trash2 } from "lucide-react";
import { useDeleteProperty } from "@src/modules/properties/hook/useDeleteProperty";

type Props = {
  id: string;
  onDeleted: () => void;
};

export function DeletePropertyButton({ id, onDeleted }: Props) {
  const { deleteProperty, loading } = useDeleteProperty(onDeleted);

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm">
          <Trash2 className="mr-2 h-4 w-4" />
          Eliminar
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            ¿Seguro que querés eliminar esta propiedad?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción no se puede deshacer. La propiedad se eliminará
            permanentemente del sistema.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => deleteProperty(id)}
            disabled={loading}
            className="bg-red-600 text-white hover:bg-red-700"
          >
            {loading ? "Eliminando..." : "Eliminar"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
