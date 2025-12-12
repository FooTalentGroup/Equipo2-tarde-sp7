"use client";

import { useState } from "react";

import Image from "next/image";
import Link from "next/link";

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@src/components/ui/alert-dialog";
import { Button } from "@src/components/ui/button";
import { Card, CardContent } from "@src/components/ui/card";
import { ImagePlaceholder } from "@src/components/ui/image-placeholder";
import { paths } from "@src/lib/paths";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

export interface ClientProperty {
	id: string | number;
	address: string;
	city: string;
	type: string;
	rooms: number;
	bathrooms: number;
	surface: number;
	image: string;
	status: string;
	age?: string;
	prices?: {
		rent: number;
		maintenance: number;
	};
}

interface ClientPropertyCardProps {
	property: ClientProperty;
	onDelete?: (id: string | number) => Promise<void>;
}

export function ClientPropertyCard({
	property,
	onDelete,
}: ClientPropertyCardProps) {
	const [isDeleting, setIsDeleting] = useState(false);
	const [openDialog, setOpenDialog] = useState(false);

	const handleConfirmDelete = async () => {
		if (!onDelete) return;
		try {
			setIsDeleting(true);
			await onDelete(property.id);
			setOpenDialog(false);
			toast.success("Propiedad eliminada correctamente");
		} catch (error) {
			console.error("Error deleting property:", error);
			toast.error("No se pudo eliminar la propiedad");
		} finally {
			setIsDeleting(false);
		}
	};
	return (
		<Card
			key={property.id}
			className="hover:shadow-md transition-shadow overflow-visible"
		>
			<CardContent className="px-4 py-1 overflow-visible">
				<div className="flex gap-4 overflow-visible">
					{/* Imagen */}
					<div className="w-32 h-32 bg-slate-200 rounded-lg shrink-0 overflow-hidden relative">
						{property.image ? (
							<Image
								src={property.image}
								alt={property.address}
								fill
								className="object-cover"
							/>
						) : (
							<ImagePlaceholder className="h-full w-full bg-slate-100" />
						)}
					</div>

					{/* Información */}
					<div className="flex-1">
						<div className="flex items-start justify-between mb-6">
							<div>
								<h4 className="font-semibold text-slate-900 mb-1">
									{property.address}
								</h4>
								<div className="text-sm text-slate-500">
									{property.city} · {property.type}
								</div>
							</div>
							{onDelete && (
								<AlertDialog open={openDialog} onOpenChange={setOpenDialog}>
									<AlertDialogTrigger asChild>
										<Button
											variant="ghost"
											size="icon"
											className="h-8 w-8 text-destructive-foreground hover:bg-destructive-foreground/10 hover:text-destructive-foreground"
											onClick={(e) => e.stopPropagation()}
										>
											<Trash2 className="h-4 w-4" />
										</Button>
									</AlertDialogTrigger>
									<AlertDialogContent>
										<AlertDialogTitle>Eliminar propiedad</AlertDialogTitle>
										<AlertDialogDescription>
											¿Estás seguro de que deseas eliminar esta propiedad? Esta
											acción no se puede deshacer.
										</AlertDialogDescription>
										<div className="flex gap-3 justify-end">
											<AlertDialogCancel>Cancelar</AlertDialogCancel>
											<AlertDialogAction
												onClick={handleConfirmDelete}
												disabled={isDeleting}
												className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
											>
												{isDeleting ? "Eliminando..." : "Eliminar"}
											</AlertDialogAction>
										</div>
									</AlertDialogContent>
								</AlertDialog>
							)}
						</div>

						<div className="flex items-center justify-between">
							<div className="grid grid-cols-3 gap-4 mb-3">
								<div>
									<div className="text-xs text-slate-500">Ambientes</div>
									<div className="text-sm font-medium text-slate-900">
										{property.rooms}
									</div>
								</div>
								<div>
									<div className="text-xs text-slate-500">Baños</div>
									<div className="text-sm font-medium text-slate-900">
										{property.bathrooms}
									</div>
								</div>
								<div>
									<div className="text-xs text-slate-500">Superficie</div>
									<div className="text-sm font-medium text-slate-900">
										{property.surface} m²
									</div>
								</div>
							</div>

							<Button variant="outline" size="sm" asChild>
								<Link href={paths.agent.properties.detail(String(property.id))}>
									Ver Detalles
								</Link>
							</Button>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
