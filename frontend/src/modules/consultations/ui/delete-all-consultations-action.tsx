"use client";

import { Button } from "@src/components/ui/button";
import { Trash2 } from "lucide-react";

type Props = {
	onStartSelection?: () => void;
};

export function DeleteAllConsultationsAction({ onStartSelection }: Props) {
	return (
		<Button
			variant="outline"
			className="ml-auto flex items-center gap-2 border-red-600 text-red-600 hover:bg-red-50 hover:text-red-500"
			onClick={onStartSelection}
		>
			<Trash2 className="size-4" />
			Seleccionar para borrar
		</Button>
	);
}
