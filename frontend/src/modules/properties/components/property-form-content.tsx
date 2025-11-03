"use client";

import type { Property } from "../types";
import { useState } from "react";
import { Label } from "@src/components/ui/label";
import { Input } from "@src/components/ui/input";
import { Textarea } from "@src/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@src/components/ui/select";
import { Button } from "@src/components/ui/button";
import { updatePropertyAction } from "../actions/update-property-action";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface PropertyFormContentProps {
	property: Property;
}

export function PropertyFormContent({
	property: initialProperty,
}: PropertyFormContentProps) {
	const [property, setProperty] = useState(initialProperty);
	const [isSaving, setIsSaving] = useState(false);
	const router = useRouter();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSaving(true);

		try {
			const result = await updatePropertyAction(property.id, {
				title: property.title,
				description: property.description,
				price: property.price,
				location: property.location,
				bedrooms: property.bedrooms,
				bathrooms: property.bathrooms,
				area: property.area,
				type: property.type,
				status: property.status,
				imageUrl: property.imageUrl,
			});

			if (!result.ok) {
				toast.error("Error al guardar", {
					description: result.error,
				});
				return;
			}

			toast.success("Propiedad actualizada correctamente");
			router.refresh();
		} catch (error) {
			toast.error("Error inesperado al guardar");
		} finally {
			setIsSaving(false);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-6">
			{/* Título */}
			<div className="space-y-2">
				<Label htmlFor="title">Título</Label>
				<Input
					id="title"
					value={property.title}
					onChange={(e) =>
						setProperty({ ...property, title: e.target.value })
					}
					placeholder="Casa moderna en el centro"
				/>
			</div>

			{/* Descripción */}
			<div className="space-y-2">
				<Label htmlFor="description">Descripción</Label>
				<Textarea
					id="description"
					value={property.description}
					onChange={(e) =>
						setProperty({ ...property, description: e.target.value })
					}
					rows={6}
					placeholder="Descripción de la propiedad..."
				/>
			</div>

			{/* Precio */}
			<div className="space-y-2">
				<Label htmlFor="price">Precio</Label>
				<Input
					id="price"
					type="number"
					value={property.price}
					onChange={(e) =>
						setProperty({ ...property, price: Number(e.target.value) })
					}
					placeholder="350000"
				/>
			</div>

			{/* Ubicación */}
			<div className="space-y-2">
				<Label htmlFor="location">Ubicación</Label>
				<Input
					id="location"
					value={property.location}
					onChange={(e) =>
						setProperty({ ...property, location: e.target.value })
					}
					placeholder="Downtown, City Center"
				/>
			</div>

			<div className="grid grid-cols-3 gap-4">
				{/* Habitaciones */}
				<div className="space-y-2">
					<Label htmlFor="bedrooms">Habitaciones</Label>
					<Input
						id="bedrooms"
						type="number"
						value={property.bedrooms}
						onChange={(e) =>
							setProperty({ ...property, bedrooms: Number(e.target.value) })
						}
						placeholder="3"
					/>
				</div>

				{/* Baños */}
				<div className="space-y-2">
					<Label htmlFor="bathrooms">Baños</Label>
					<Input
						id="bathrooms"
						type="number"
						value={property.bathrooms}
						onChange={(e) =>
							setProperty({ ...property, bathrooms: Number(e.target.value) })
						}
						placeholder="2"
					/>
				</div>

				{/* Área */}
				<div className="space-y-2">
					<Label htmlFor="area">Área (m²)</Label>
					<Input
						id="area"
						type="number"
						value={property.area}
						onChange={(e) =>
							setProperty({ ...property, area: Number(e.target.value) })
						}
						placeholder="120"
					/>
				</div>
			</div>

			<div className="grid grid-cols-2 gap-4">
				{/* Tipo */}
				<div className="space-y-2">
					<Label htmlFor="type">Tipo</Label>
					<Select
						value={property.type}
						onValueChange={(value) =>
							setProperty({
								...property,
								type: value as Property["type"],
							})
						}
					>
						<SelectTrigger id="type">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="apartment">Apartamento</SelectItem>
							<SelectItem value="house">Casa</SelectItem>
							<SelectItem value="condo">Condominio</SelectItem>
							<SelectItem value="land">Terreno</SelectItem>
						</SelectContent>
					</Select>
				</div>

				{/* Estado */}
				<div className="space-y-2">
					<Label htmlFor="status">Estado</Label>
					<Select
						value={property.status}
						onValueChange={(value) =>
							setProperty({
								...property,
								status: value as Property["status"],
							})
						}
					>
						<SelectTrigger id="status">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="available">Disponible</SelectItem>
							<SelectItem value="sold">Vendido</SelectItem>
							<SelectItem value="rented">Alquilado</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</div>

			{/* URL de imagen */}
			<div className="space-y-2">
				<Label htmlFor="imageUrl">URL de Imagen</Label>
				<Input
					id="imageUrl"
					type="url"
					value={property.imageUrl || ""}
					onChange={(e) =>
						setProperty({ ...property, imageUrl: e.target.value })
					}
					placeholder="https://example.com/image.jpg"
				/>
			</div>

			{/* Botón de guardar */}
			<div className="flex justify-end pt-4">
				<Button type="submit" disabled={isSaving}>
					{isSaving ? "Guardando..." : "Guardar cambios"}
				</Button>
			</div>
		</form>
	);
}
